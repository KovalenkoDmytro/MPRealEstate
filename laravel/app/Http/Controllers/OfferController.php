<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Http\Requests\SubmitOfferRequest;
use App\Http\Requests\UpdateOfferStatusRequest;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Services\OfferService;
use App\Support\RoleViewResolver;
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

        return Inertia::render(RoleViewResolver::resolve([
            'seller' => 'Users/Seller/Offers/Index',
            'buyer'  => 'Users/Buyer/Offers/Index',
        ]), [
            'offers'       => $this->offerService->getAllUserOffers($user),
            'offers_stats' => $this->offerService->getUserOfferStats($user),
        ]);
    }

    public function store(SubmitOfferRequest $request, RealEstateListing $listing): JsonResponse
    {
        $this->offerService->submitOffer(
            amount: (float) $request->validated('amount'),
            message: (string) $request->validated('message'),
            buyer: $request->user(),
            listing: $listing,
        );

        return JsonResponder::send(new SuccessResponse(__('offers.success.submitted')));
    }

    public function updateStatus(UpdateOfferStatusRequest $request, Offer $offer): JsonResponse
    {
        try {
            $this->offerService->updateStatus(
                status: (string) $request->validated('status'),
                authorizer: $request->user(),
                offer: $offer,
            );
        } catch (\RuntimeException $e) {
            return JsonResponder::send(new ErrorResponse($e->getMessage()));
        }

        return JsonResponder::send(
            new SuccessResponse(__('offers.success.status_updated'), ['status' => $offer->fresh()->status])
        );
    }
}
