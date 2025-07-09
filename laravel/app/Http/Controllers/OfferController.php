<?php

namespace App\Http\Controllers;

use App\Helpers\Responses\JsonResponder;
use App\Models\Offer;
use Illuminate\Http\Request;
use App\Services\OfferService;
use Illuminate\Http\JsonResponse;

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

    public function showAllOffers(int $sellerId): \Illuminate\Database\Eloquent\Collection|array|\LaravelIdea\Helper\App\Models\_IH_Offer_C {
        return $this->offerService->getAllOffersForSeller($sellerId);
    }

    public function showBuyerOffers(int $buyerId): \Illuminate\Database\Eloquent\Collection|array|\LaravelIdea\Helper\App\Models\_IH_Offer_C {
        return $this->offerService->getBuyerOffers($buyerId);
    }
}
