<?php

namespace App\Services;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Http\Requests\ConfirmDepositRequest;
use App\Http\Requests\InviteLawyerRequest;
use App\Http\Requests\SetConditionDayRequest;
use App\Http\Requests\SetDepositMadeRequest;
use App\Http\Requests\SetDepositRequest;
use App\Http\Requests\SetPossessionDayRequest;
use App\Models\Deal;
use App\Models\DealBreakRequest;
use App\Models\Offer;
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
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DealService
{
    public function setDeposit(SetDepositRequest $request, Deal $deal): JsonResponse
    {
        if (!is_null($deal->security_deposit)) {
            return JsonResponder::send(
                new ErrorResponse(__('deals.errors.security_deposit_already_set'))
            );
        }

        $deal->security_deposit = $request->security_deposit;
        $deal->security_deposit_set_at = now();
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new SecurityDepositSet($deal));
        }

        return JsonResponder::send(
            new SuccessResponse(__('deals.success.security_deposit_set'))
        );
    }

    public function markDepositMade(SetDepositMadeRequest $request, Deal $deal): JsonResponse
    {
        $user = $request->user();

        if (!$deal->users->contains($user)) {
            abort(403, __('global.errors.unauthorized'));
        }

        if (!$deal->is_security_deposit_made) {
            $deal->is_security_deposit_made = $request->is_security_deposit_made;
            $deal->security_deposit_made_at = $request->security_deposit_made_at;
            $deal->save();

            $seller = $deal->users()->where('role', 'seller')->first();
            if ($seller) {
                $deal->load('listing');
                $seller->notify(new DepositMarkedAsMade($deal));
            }
        }

        return JsonResponder::send(
            new SuccessResponse(__('deals.success.deposit_marked_made'))
        );
    }

    public function confirmDeposit(ConfirmDepositRequest $request, Deal $deal): JsonResponse
    {
        $deal->is_security_deposit_confirmed = $request->is_security_deposit_confirmed;
        $deal->security_deposit_confirmed_at = Carbon::parse($request->security_deposit_confirmed_at);
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new DepositConfirmed($deal));
        }

        return JsonResponder::send(
            new SuccessResponse(__('deals.success.deposit_confirmed'), $deal->toArray())
        );
    }

    public function setConditionDay(SetConditionDayRequest $request, Deal $deal): JsonResponse
    {
        if (!is_null($deal->condition_day)) {
            return JsonResponder::send(
                new ErrorResponse(__('deals.errors.condition_day_already_set'))
            );
        }

        $deal->condition_day = $request->condition_day;
        $deal->condition_day_selected_at = now();
        $deal->save();

        $seller = $deal->users()->where('role', 'seller')->first();
        if ($seller) {
            $deal->load('listing');
            $seller->notify(new ConditionDaySet($deal));
        }

        return JsonResponder::send(
            new SuccessResponse(__('deals.success.condition_day_set'))
        );
    }

    public function confirmConditionDay(Deal $deal): JsonResponse
    {
        $deal->is_condition_day_confirmed = true;
        $deal->condition_day_confirmed_at = now();
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new ConditionDayConfirmed($deal));
        }

        return JsonResponder::send(
            new SuccessResponse(__('deals.success.condition_day_confirmed'))
        );
    }

    public function setPossessionDay(SetPossessionDayRequest $request, Deal $deal): JsonResponse
    {
        if (!is_null($deal->possession_day)) {
            return JsonResponder::send(
                new ErrorResponse(__('deals.errors.possession_day_already_set'))
            );
        }

        $deal->possession_day = $request->possession_day;
        $deal->possession_day_selected_at = now();
        $deal->save();

        $seller = $deal->users()->where('role', 'seller')->first();
        if ($seller) {
            $deal->load('listing');
            $seller->notify(new PossessionDaySet($deal));
        }

        return JsonResponder::send(
            new SuccessResponse(__('deals.success.possession_day_set'))
        );
    }

    public function confirmPossessionDay(Deal $deal): JsonResponse
    {
        $deal->is_possession_day_confirmed = true;
        $deal->possession_day_confirmed_at = now();
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new PossessionDayConfirmed($deal));
        }

        return JsonResponder::send(
            new SuccessResponse(__('deals.success.possession_day_confirmed'))
        );
    }

    public function inviteLawyer(InviteLawyerRequest $request, Deal $deal): JsonResponse
    {
        $lawyer = User::where('lawyer_number', $request->lawyer_code)
            ->whereHas('roles', fn($q) => $q->where('name', 'lawyer'))
            ->first();

        if (!$lawyer) {
            return JsonResponder::send(
                new ErrorResponse(__('deals.errors.no_lawyer_found'))
            );
        }

        if ($deal->users->contains($lawyer->id)) {
            return JsonResponder::send(
                new ErrorResponse(__('deals.errors.lawyer_already_in_deal'))
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
            new SuccessResponse(__('deals.success.lawyer_invited'))
        );
    }

    public function createDealFromOffer(Offer $offer): void
    {
        $listing = $offer->listing;

        $deal = Deal::create([
            'name' => "Deal for " . $listing->title,
            'amount' => $offer->amount,
            'deal_message' => $offer->message,
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
                new ErrorResponse(__('deals.errors.deal_completed_cannot_break'))
            );
        }

        if ($deal->breakRequest) {
            return JsonResponder::send(
                new ErrorResponse(__('deals.errors.break_request_exists'))
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
            new SuccessResponse(__('deals.success.break_request_sent'))
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
                new ErrorResponse(__('deals.errors.no_break_request'))
            );
        }

        if ($breakRequest->initiator_id === $responder->id) {
            return JsonResponder::send(
                new ErrorResponse(__('deals.errors.cannot_respond_own_break'))
            );
        }

        if ($accepted === 'approved') {
            $deal->is_broken = true;
            $deal->broken_at = now();

            // Delete all associated files
            $deal->files->each(function ($file) {
                Storage::delete($file->file_path);
                $file->delete();
            });
            $deal->save();

            $breakRequest->status = 'accepted';
            $breakRequest->save();

            $receiver->notify(new DealBreakRequestedApproved($deal));

            return JsonResponder::send(
                new SuccessResponse(__('deals.success.break_confirmed'))
            );
        }

        if ($accepted === 'rejected') {
            $breakRequest->status = 'rejected';
            $breakRequest->save();

            $receiver->notify(new DealBreakRequestedRejected($deal));

            return JsonResponder::send(
                new SuccessResponse(__('deals.success.break_rejected'))
            );
        }

        return JsonResponder::send(
            new ErrorResponse(__('deals.errors.invalid_response_type'))
        );
    }

    /**
     * Get aggregated deals statistics
     */
    public function getUserDealStats(User $user): array
    {

        $deals= $user->deals();

        return [

            'total' => (clone $deals)->count(),

            'broken' => (clone $deals)
                ->where('is_broken', true)
                ->count(),

            'completed' => (clone $deals)
                ->where('is_completed', true)
                ->count(),

            'pending' => (clone $deals)
                ->where('is_broken', false)
                ->where('is_completed', false)
                ->count(),
        ];
    }
}
