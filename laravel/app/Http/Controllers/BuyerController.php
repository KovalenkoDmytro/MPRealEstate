<?php

namespace App\Http\Controllers;

use App\Models\RealEstateListing;
use App\Services\BuyerService;
use Illuminate\Http\Request;
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

    public function __construct(BuyerService $buyerService ,OfferController $offerController,  DealController $dealController)
    {
        $this->buyerService = $buyerService;
        $this->offerController = $offerController;
        $this->dealController = $dealController;
    }

    /**
     * ✅ Display Buyer Dashboard with their Offers
     */
    public function index(): Response
        {/** @var \App\Models\User $user */
        $user = auth()->user();

        return Inertia::render('Users/Buyer/Dashboard', [
            'offers' => $this->offerController->showBuyerOffers($user->id),
        ]);
    }
    public function showAllDeals(): Response {

        return Inertia::render('Users/Buyer/Deals/Index', [
            'deals' => $this->dealController->getAllDeals(),
        ]);

    }

    public function showAllListings(ListingFilterRequest $request): Response {
        /** @var \App\Models\User $user */

        $user = auth()->user();

        $filters = $request->validatedFilters();
        $listings = $this->buyerService->getFilteredListings($user, $filters);

        $favoriteListings = $user->favoriteListings()->pluck('real_estate_listing_id');

        return Inertia::render('Users/Buyer/Listings/Index', [
            'listings' => $listings,
            'favoriteListings' => $favoriteListings,
            'filters' => $filters,
        ]);
    }

    public function showListing(RealEstateListing $listing): Response {
        /** @var \App\Models\User $user */

        $user = auth()->user();

        ['listing' => $listing, 'userOffer' => $userOffer] = $this->buyerService->getListingWithUserOffer($listing->id, $user);

        return Inertia::render('Users/Buyer/Listings/Show', [
            'listing' => $listing,
            'userOffer' => $userOffer,
        ]);
    }


    public function showDealView(Deal $deal): Response {


        if (!Gate::allows('view-deal', $deal)) {
            abort(403, "Unauthorized - You are not part of this deal.");
        }

        return Inertia::render('Users/Buyer/Deals/Show', [
            'deal' => $deal->load(
                [
                    'realEstateListing.mainImage', // ✅ Load the main image separately
                    'realEstateListing.images', // ✅ Also load all images
                    'users',
                    'files', // all uploaded files
                ]
            ),
        ]);
    }
}
