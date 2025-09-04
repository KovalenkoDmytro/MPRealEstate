<?php

namespace App\Services;

use App\Http\Requests\SubmitOfferRequest;
use App\Http\Requests\UpdateOfferStatusRequest;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Notifications\OfferConfirmation;
use App\Notifications\OfferStatusUpdated;
use App\Notifications\OfferSubmitted;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
    public function submitOffer(SubmitOfferRequest $request, $listing_id): JsonResponse {

        $listing = RealEstateListing::with('seller')->findOrFail($listing_id);

        $offer = Offer::create([
            'real_estate_listing_id' => $listing_id,
            'buyer_id' => $request->user()->id,
            'amount' => $request->amount,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        $listing->seller->notify(new OfferSubmitted($listing, $request->user(), $offer));
        $request->user()->notify(new OfferConfirmation($listing, $offer));

        return JsonResponder::send(
            new SuccessResponse(__('offers.success.submitted'), [
                'offer_id' => $offer->id,
                'listing_id' => $listing->id,
                'status' => $offer->status,
            ])
        );
    }

    public function updateStatus(UpdateOfferStatusRequest $request, Offer $offer): JsonResponse {

        if ($offer->listing->seller_id !== auth()->id()) {
            return JsonResponder::send(
                new ErrorResponse(__('global.errors.unauthorized'), [], 403)
            );
        }

        if ($request->status === 'accepted') {
            $this->dealService->createDealFromOffer($offer);
        }

        $offer->update(['status' => $request->status]);

        $offer->buyer->notify(new OfferStatusUpdated($offer->listing, $request->status));

        return JsonResponder::send(
            new SuccessResponse(__('offers.success.status_updated'), [
                'offerStatus' => $offer->status,
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
}
