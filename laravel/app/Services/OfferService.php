<?php

namespace App\Services;

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
use LaravelIdea\Helper\App\Models\_IH_Offer_C;

class OfferService
{

    protected DealService $dealService;

    public function __construct(DealService $dealService)
    {
        $this->dealService = $dealService;
    }
    public function submitOffer(Request $request, $listing_id): JsonResponse {
        $request->validate([
            'offer_price' => 'required|numeric|min:1',
            'message' => 'required|string|max:500',
        ]);

        $listing = RealEstateListing::with('seller')->findOrFail($listing_id);

        $offer = Offer::create([
            'real_estate_listing_id' => $listing_id,
            'buyer_id' => $request->user()->id,
            'offer_price' => $request->offer_price,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        $listing->seller->notify(new OfferSubmitted($listing, $request->user(), $offer));
        $request->user()->notify(new OfferConfirmation($listing, $offer));

        return JsonResponder::send(
            new SuccessResponse('Offer submitted successfully.', [
                'offer_id' => $offer->id,
                'listing_id' => $listing->id,
                'status' => $offer->status,
            ])
        );
    }

    public function updateStatus(Request $request, Offer $offer): JsonResponse {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        if ($offer->listing->seller_id !== auth()->id()) {
            return JsonResponder::send(
                new ErrorResponse('Unauthorized', [], 403)
            );
        }

        $offer->update(['status' => $request->status]);

        if ($request->status === 'accepted') {
            $this->dealService->createDealFromOffer($offer);
        }

        $offer->buyer->notify(new OfferStatusUpdated($offer->listing, $request->status));

        return JsonResponder::send(
            new SuccessResponse('Offer status updated.', [
                'offerStatus' => $offer->status,
            ])
        );
    }

    public function getAllOffersForSeller(int $sellerId): Collection|array|_IH_Offer_C {
        return Offer::with(['buyer:id,name,email', 'listing:id,title'])
            ->whereHas('listing', fn($q) => $q->where('seller_id', $sellerId))
            ->latest()
            ->get();
    }

    public function getBuyerOffers(int $buyerId): Collection|array|_IH_Offer_C {
        return Offer::with(['listing:id,title,price,seller_id', 'listing.seller:id,name'])
            ->where('buyer_id', $buyerId)
            ->latest()
            ->get();
    }
}
