<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitOfferRequest;
use App\Http\Requests\UpdateOfferStatusRequest;
use App\Models\Offer;
use Illuminate\Database\Eloquent\Collection;
use App\Services\OfferService;
use Illuminate\Http\JsonResponse;

class OfferController extends Controller
{
    protected OfferService $offerService;

    public function __construct(OfferService $offerService)
    {
        $this->offerService = $offerService;
    }

    public function store(SubmitOfferRequest $request, $listing): JsonResponse
    {
        return $this->offerService->submitOffer($request, $listing);
    }

    public function updateStatus(UpdateOfferStatusRequest $request, Offer $offer): JsonResponse
    {
        return $this->offerService->updateStatus($request, $offer);
    }

    public function showAllOffers(int $sellerId): Collection|array {
        return $this->offerService->getAllOffersForSeller($sellerId);
    }

    public function showBuyerOffers(int $buyerId): Collection|array {
        return $this->offerService->getBuyerOffers($buyerId);
    }
}
