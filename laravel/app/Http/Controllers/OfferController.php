<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitOfferRequest;
use App\Http\Requests\UpdateOfferStatusRequest;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use App\Services\OfferService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    protected OfferService $offerService;

    public function __construct(OfferService $offerService)
    {
        $this->offerService = $offerService;
    }


    public function index(): Response
    {

        $user = auth()->user();
        $offers = $this->offerService->getAllUserOffers($user);
        $offers_stats = $this->offerService->getUserOfferStats($user);

        $role = $user->getRoleNames()->first();

        $viewPath = match ($role) {
            'seller' => 'Users/Seller/Offers/Index',
            'buyer'  => 'Users/Buyer/Offers/Index',
            default => throw new \Exception('Unexpected match value'),
        };

        return Inertia::render($viewPath, [
            'offers' => $offers,
            'offers_stats' => $offers_stats,
        ]);

    }

    public function store(SubmitOfferRequest $request, $listing): JsonResponse
    {
        return $this->offerService->submitOffer($request, $listing);
    }

    public function updateStatus(UpdateOfferStatusRequest $request, Offer $offer): JsonResponse
    {
        return $this->offerService->updateStatus($request, $offer);
    }

}
