<?php
namespace App\Http\Controllers;


use App\Services\OfferService;
use App\Services\DealService;
use App\Models\Deal;
use App\Models\RealEstateListing;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller {

    protected OfferService $offerService;
    protected DealService $dealService;

    public function __construct(OfferService $offerService, DealService $dealService) {
        $this->offerService = $offerService;
        $this->dealService = $dealService;
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

    public function showAllListings(): Response {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $listings = RealEstateListing::where('seller_id', $user->id)
            ->where('status', '!=', 'inactive')
            ->with(['mainImage'])
            ->paginate(9)
            ->withQueryString();


        return Inertia::render('Users/Seller/Listings/Index', [
            'listings' => $listings,
        ]);
    }

    public function showListing(RealEstateListing $listing): Response {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // If user is a seller, ensure they only access their own listings
        if ($listing->seller_id !== $user->id) {
            abort(403, 'Unauthorized Access: This listing does not belong to you.');
        }
        $listing = RealEstateListing::with([
            'offers' => function ($query) {
                $query->with(['buyer:id,name,email']); // Select only necessary buyer details
            },
            'images',
            'mainImage'])
            ->findOrFail($listing['id']);

        return Inertia::render('Users/Seller/Listings/Show',[
            'listing' => $listing,
        ]);
    }
}
