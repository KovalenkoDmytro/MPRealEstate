<?php

namespace App\Http\Controllers;

use App\Models\RealEstateListing;
use App\Services\BuyerService;
use App\Services\ListingViewService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Deal;
use App\Http\Requests\ListingFilterRequest;

class BuyerController extends Controller
{
    protected OfferController $offerController;

    protected DealController $dealController;

    private BuyerService $buyerService;

    private ListingViewService $listingViewService;

    public function __construct(BuyerService $buyerService ,OfferController $offerController,  DealController $dealController, ListingViewService $listingViewService)
    {
        $this->buyerService = $buyerService;
        $this->offerController = $offerController;
        $this->dealController = $dealController;
        $this->listingViewService = $listingViewService;
    }

    public function showAllDeals(): Response {

        return Inertia::render('Users/Buyer/Deals/Index', [
            'deals' => $this->dealController->getAllDeals(),
        ]);

    }

    public function showListing(RealEstateListing $listing): Response {
        /** @var \App\Models\User $user */

        $user = auth()->user();

        // Record that this authenticated buyer viewed the listing
        $this->listingViewService->recordView($user, $listing);

        ['listing' => $listing, 'userOffer' => $userOffer] = $this->buyerService->getListingWithUserOffer($listing->id, $user);

        return Inertia::render('Users/Buyer/Listings/Show', [
            'listing' => $listing,
            'userOffer' => $userOffer,
        ]);
    }
}
