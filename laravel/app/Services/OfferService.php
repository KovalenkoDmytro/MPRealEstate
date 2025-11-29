<?php

namespace App\Services;

use App\Http\Requests\SubmitOfferRequest;
use App\Http\Requests\UpdateOfferStatusRequest;
use App\Models\Offer;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User;
use App\Notifications\OfferConfirmation;
use App\Notifications\OfferStatusUpdated;
use App\Notifications\OfferSubmitted;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Helpers\Responses\ErrorResponse;

class OfferService
{

    protected DealService $dealService;

    public function __construct(DealService $dealService)
    {
        $this->dealService = $dealService;
    }
    public function submitOffer(SubmitOfferRequest $request, $listing): JsonResponse {

        $offer = Offer::create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $request->user()->id,
            'amount' => $request->amount,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        $listing->seller->notify(new OfferSubmitted($listing, $request->user(), $offer));
        $request->user()->notify(new OfferConfirmation($listing, $offer));

        return JsonResponder::send(
            new SuccessResponse(__('offers.success.submitted'))
        );
    }

    public function updateStatus(UpdateOfferStatusRequest $request, Offer $offer): JsonResponse {

        if ($offer->listing->seller_id !== auth()->id()) {
            return JsonResponder::send(
                new ErrorResponse(__('global.errors.unauthorized'))
            );
        }

        if ($request->status === 'accepted') {
            $this->dealService->createDealFromOffer($offer);
        }

        $offer->update(['status' => $request->status]);

        $offer->buyer->notify(new OfferStatusUpdated($offer->listing, $request->status));

        return JsonResponder::send(
            new SuccessResponse(__('offers.success.status_updated'), [
                'status' => $offer->status,
            ])
        );
    }

    public function getAllOffersForSeller(int $sellerId): Collection|array {
        return Offer::with(['buyer:id,name,email', 'listing:id,title'])
            ->whereHas('listing', fn($q) => $q->where('seller_id', $sellerId))
            ->latest()
            ->get();
    }

    public function getBuyerOffers(int $buyerId): Collection|array {
        return Offer::with(['listing:id,title,price,seller_id', 'listing.seller:id,name'])
            ->where('buyer_id', $buyerId)
            ->latest()
            ->get();
    }

    /**
     * Get aggregated deals statistics
     */
    /**
     * Get aggregated Offer statistics (Efficient Query Builder Approach).
     */
    public function getUserOfferStats(User $user): array
    {

        $query = Offer::query();

        if ($user->hasRole('seller')) {

            $query->whereHas('listing', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            });
        } elseif ($user->hasRole('buyer')) {

            $query->where('buyer_id', $user->id);
        } else {
            return ['total' => 0, 'pending' => 0, 'accepted' => 0, 'rejected' => 0];
        }

        return $this->calculateStats($query);
    }

    /**
     * Helper to count statuses without loading objects into memory.
     */
    private function calculateStats(Builder $baseQuery): array
    {
        return [
            'total' => (clone $baseQuery)->count(),

            'pending' => (clone $baseQuery)
                ->where('status', 'pending')
                ->count(),

            'accepted' => (clone $baseQuery)
                ->where('status', 'accepted')
                ->count(),

            'rejected' => (clone $baseQuery)
                ->where('status', 'rejected')
                ->count(),
        ];
    }
}
