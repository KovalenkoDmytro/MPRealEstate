<?php
namespace App\Http\Controllers;


use App\Models\Deal;
use App\Models\RealEstateListing;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller {

    protected OfferController $offerController;
    protected DealController $dealController;

    public function __construct(OfferController $offerController, DealController $dealController) {
        $this->offerController = $offerController;
        $this->dealController = $dealController;
    }

    /**
     * ✅ Display Seller Dashboard with their Offers
     */
     public function index(): Response {
        $user = auth()->user();

        return Inertia::render('Users/Seller/Dashboard', [
            'offers' => $this->offerController->showAllOffers($user->id),
        ]);
    }


    public function showAllDeals(): Response {

        return Inertia::render('Users/Seller/Deals/Index', [
            'deals' => $this->dealController->getAllDeals(),
        ]);

    }


    public function showDealView(Deal $deal): Response {

        if (!Gate::allows('view-deal', $deal)) {
            abort(403, "Unauthorized - You are not part of this deal.");
        }

        return Inertia::render('Users/Seller/Deals/Show', [
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

    public function showAllListings() {
        $listings = RealEstateListing::where('seller_id', auth()->user()->id)
            ->with(['mainImage'])
            ->get();

        return Inertia::render('Users/Seller/Listings/Index', [
            'listings' => $listings,
        ]);
    }

    public function showListing(RealEstateListing $listing) {

        // ✅ If user is a seller, ensure they only access their own listings
        if ($listing->seller_id !== auth()->user()->id) {
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
