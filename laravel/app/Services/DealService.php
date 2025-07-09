<?php

namespace App\Services;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Models\Deal;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Notifications\ConditionDayConfirmed;
use App\Notifications\ConditionDaySet;
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
            'data' => json_encode(['description' => $offer->message]),
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

}
