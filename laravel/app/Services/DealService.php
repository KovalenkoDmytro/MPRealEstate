<?php

namespace App\Services;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Models\Deal;
use App\Models\DealBreakRequest;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Notifications\ConditionDayConfirmed;
use App\Notifications\ConditionDaySet;
use App\Notifications\DealBreakRequested;
use App\Notifications\DealBreakRequestedApproved;
use App\Notifications\DealBreakRequestedRejected;
use App\Notifications\DepositMarkedAsMade;
use App\Notifications\LawyerInvitedToDeal;
use App\Notifications\PossessionDayConfirmed;
use App\Notifications\PossessionDaySet;
use App\Notifications\SecurityDepositSet;
use App\Notifications\DepositConfirmed;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Storage;

use function Illuminate\Events\queueable;

class DealService
{
    public function setDeposit(Request $request, Deal $deal): JsonResponse
    {
        if (!is_null($deal->security_deposit)) {
            return JsonResponder::send(
                new ErrorResponse('Security deposit has already been set and cannot be changed.', [], 400)
            );

        }

        $validated = $request->validate([
            'security_deposit' => 'required|numeric|min:100',
        ]);

        $deal->security_deposit = $validated['security_deposit'];
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new SecurityDepositSet($deal));
        }

        return JsonResponder::send(
            new SuccessResponse('Security deposit has been set successfully.', $deal->toArray())
        );
    }

    public function markDepositMade(Request $request, Deal $deal): JsonResponse
    {
        $user = $request->user();

        if (!$deal->users->contains($user)) {
            abort(403, 'Unauthorized');
        }

        if (!$deal->is_made) {
            $deal->is_made = true;
            $deal->save();

            $seller = $deal->users()->where('role', 'seller')->first();
            if ($seller) {
                $deal->load('listing');
                $seller->notify(new DepositMarkedAsMade($deal));
            }
        }

        return JsonResponder::send(
            new SuccessResponse('Deposit marked as made.', $deal->toArray())
        );
    }

    public function confirmDeposit(Deal $deal): JsonResponse
    {
        if (!$deal->is_made) {
            return JsonResponder::send(
                new ErrorResponse('Security deposit has not been marked as made.', [], 400),
            );
        }

        $deal->is_confirmed = true;
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new DepositConfirmed($deal));
        }

        return JsonResponder::send(
            new SuccessResponse('Deposit confirmed.', $deal->toArray()),
        );
    }

    public function setConditionDay(Request $request, Deal $deal): JsonResponse
    {
        if (!is_null($deal->condition_day)) {
            return JsonResponder::send(
                new ErrorResponse('Condition day has already been set and cannot be changed.', [], 400),
            );
        }

        $validated = $request->validate([
            'condition_day' => 'required|date|after_or_equal:today',
        ]);

        $deal->condition_day = $validated['condition_day'];
        $deal->save();

        $seller = $deal->users()->where('role', 'seller')->first();
        if ($seller) {
            $deal->load('listing');
            $seller->notify(new ConditionDaySet($deal));
        }

        return JsonResponder::send(
            new SuccessResponse('Condition day has been set successfully.', $deal->toArray()),
        );
    }

    public function confirmConditionDay(Deal $deal): JsonResponse
    {
        $deal->is_condition_day_confirmed = true;
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new ConditionDayConfirmed($deal));
        }

        return JsonResponder::send(
            new SuccessResponse('Condition day has confirmed.', $deal->toArray()),
        );
    }

    public function setPossessionDay(Request $request, Deal $deal): JsonResponse
    {
        if (!is_null($deal->possession_day)) {
            return JsonResponder::send(
                new ErrorResponse('Possession day has already been set and cannot be changed.', [], 400)
            );
        }

        $validated = $request->validate([
            'possession_day' => 'required|date|after_or_equal:today',
        ]);

        $deal->possession_day = $validated['possession_day'];
        $deal->save();

        $seller = $deal->users()->where('role', 'seller')->first();
        if ($seller) {
            $deal->load('listing');
            $seller->notify(new PossessionDaySet($deal));
        }

        return JsonResponder::send(
            new SuccessResponse('Possession day has been set successfully.', $deal->toArray()),
        );
    }

    public function confirmPossessionDay(Deal $deal): JsonResponse
    {
        $deal->is_possession_day_confirmed = true;
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new PossessionDayConfirmed($deal));
        }

        return JsonResponder::send(
            new SuccessResponse('Possession day has confirmed.', $deal->toArray()),
        );
    }

    public function inviteLawyer(Request $request, Deal $deal): JsonResponse
    {
        $validated = $request->validate([
            'lawyer_code' => 'required|string|size:9',
        ]);

        $lawyer = User::where('lawyer_number', $validated['lawyer_code'])
            ->whereHas('roles', fn ($q) => $q->where('name', 'lawyer'))
            ->first();

        if (!$lawyer) {
            return JsonResponder::send(
                new ErrorResponse('No lawyer found with this code.', [],404)
            );
        }

        if ($deal->users->contains($lawyer->id)) {
            return JsonResponder::send(
                new ErrorResponse('This lawyer is already part of this deal.', [],422)
            );
        }

        if ($request->user()->role === 'buyer') {
            $lawyer->is_buyer_lawyer = true;
        } elseif ($request->user()->role === 'seller') {
            $lawyer->is_seller_lawyer = true;
        }

        $lawyer->save();
        $deal->users()->attach($lawyer->id);
        $lawyer->notify(new LawyerInvitedToDeal($deal));

        return JsonResponder::send(
            new SuccessResponse('Lawyer invited successfully.', $lawyer->toArray())
        );
    }

    public function createDealFromOffer(Offer $offer): void
    {

        $listing = $offer->listing;

        $deal = Deal::create([
            'name' => "Deal for " . $listing->title,
            'amount' => $offer->offer_price,
            'seller_message' => $offer->message,
            'real_estate_listing_id' => $listing->id,
        ]);

        $deal->users()->attach([$offer->buyer_id, $listing->seller_id]);

        DB::table('real_estate_listings')
            ->where('id', $listing->id)
            ->update(['status' => 'pending']);
    }

    public function getAllDealsForUser(User $user)
    {
        return $user->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images'])
            ->get();
    }

    public function breakDeal(array $data, Deal $deal): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($deal->is_completed) {
            return JsonResponder::send(
                new ErrorResponse('Cannot break a completed deal.', [], 400)
            );
        }

        // Prevent duplicate break requests
        if ($deal->breakRequest) {
            return JsonResponder::send(
                new ErrorResponse('Break request already exists.', [], 400)
            );
        }

        DealBreakRequest::create([
            'deal_id' => $deal->id,
            'initiator_id' => $user->id,
            'status' => 'pending',
            'message' => $data['message'],
        ]);


        // Notify counterparty
        $main_sides = $deal->users()->whereIn('role', ['buyer', 'seller'])->get();
        foreach ($main_sides as $user) {
            $user->notify(new DealBreakRequested($deal));
        }


        return JsonResponder::send(
            new SuccessResponse('Break request sent successfully.')
        );
    }

    public function respondBreak(Deal $deal, User $responder, string $accepted): JsonResponse
    {
        $breakRequest = $deal->breakRequest;
        $receiver = $deal->users()
            ->where('user_id', '!=', $responder->id)
            ->whereIn('role', ['buyer', 'seller'])
            ->first();


        if (!$breakRequest) {
            return JsonResponder::send(
                new ErrorResponse('No break request exists for this deal.', [], 404)
            );
        }

        if ($breakRequest->initiator_id === $responder->id) {
            return JsonResponder::send(
                new ErrorResponse('You cannot respond to your own break request.', [], 403)
            );
        }

        if ($accepted === 'approved') {
            $deal->is_broken = true;

            // Delete all associated files
            $deal->files->each(function ($file) {
                // Delete the physical file from storage
                Storage::delete($file->file_path); // Make sure 'file_path' is correct
                $file->delete(); // Remove the database record
            });
            $deal->save();

            $breakRequest->status = 'accepted';
            $breakRequest->save();

            $receiver->notify(new DealBreakRequestedApproved($deal));

            return JsonResponder::send(
                new SuccessResponse('Deal break confirmed. The deal has been broken.')
            );
        }

        if ($accepted === 'rejected') {
            $breakRequest->status = 'rejected';
            $breakRequest->save();

            $receiver->notify(new DealBreakRequestedRejected($deal));

            return JsonResponder::send(
                new SuccessResponse('Deal break request rejected.')
            );
        }

        return JsonResponder::send(
            new ErrorResponse('Invalid response type.', [], 400)
        );
    }
}
