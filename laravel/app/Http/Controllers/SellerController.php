<?php
namespace App\Http\Controllers;


use App\Services\OfferService;
use App\Services\DealService;
use App\Models\Deal;
use App\Models\RealEstateListing;
use App\Services\SellerService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller {

    protected OfferService $offerService;
    protected DealService $dealService;
    protected SellerService $sellerService;

    public function __construct(OfferService $offerService, DealService $dealService, SellerService $sellerService ) {
        $this->offerService = $offerService;
        $this->dealService = $dealService;
        $this->sellerService = $sellerService;
    }


    /**
     * Display Seller Dashboard with their Offers
     */
     public function index(): Response {
         /** @var \App\Models\User $user */
        $user = auth()->user();

        return Inertia::render('Users/Seller/Dashboard', [
            'offers' => $this->offerService->getAllOffersForSeller($user->id)
        ]);
    }


    public function showAllDeals(): Response {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        return Inertia::render('Users/Seller/Deals/Index', [
            'deals' => $this->dealService->getAllDealsForUser($user)
        ]);
    }


    public function showListing(RealEstateListing $listing): Response
    {
        $user = auth()->user();
        $listingDetails = $this->sellerService->getSellerListingDetails($user, $listing);

        return Inertia::render('Users/Seller/Listings/Show', [
            'listing' => $listingDetails,
        ]);
    }
}
