<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use App\Services\OfferService;
use Illuminate\Http\JsonResponse;
use LaravelIdea\Helper\App\Models\_IH_Offer_C;

class OfferController extends Controller
{
    protected OfferService $offerService;

    public function __construct(OfferService $offerService)
    {
        $this->offerService = $offerService;
    }

    public function store(Request $request, $listing_id): JsonResponse
    {
        return $this->offerService->submitOffer($request, $listing_id);
    }

    public function updateStatus(Request $request, Offer $offer): JsonResponse
    {
        return $this->offerService->updateStatus($request, $offer);
    }

    public function showAllOffers(int $sellerId): Collection|array|_IH_Offer_C {
        return $this->offerService->getAllOffersForSeller($sellerId);
    }

    public function showBuyerOffers(int $buyerId): Collection|array|_IH_Offer_C {
        return $this->offerService->getBuyerOffers($buyerId);
    }
}
