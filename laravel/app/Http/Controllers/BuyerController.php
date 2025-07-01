<?php

namespace App\Http\Controllers;

use App\Models\RealEstateListing;
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

    public function __construct(OfferController $offerController,  DealController $dealController)
    {
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

        $query = RealEstateListing::query()
            ->where('status', '!=', 'inactive')
            ->with(['seller', 'mainImage']); // ✅ Just build the query — don't call `get()`

        $filters = $request->validatedFilters();

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', $request->bedrooms);
        }

        if ($request->filled('bathrooms')) {
            $query->where('bathrooms', '>=', $request->bathrooms);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->boolean('favorites_only')) {
            $query->whereIn('id', $user->favoriteListings()->pluck('real_estate_listing_id'));
        }

        // ✅ NOW execute the query and paginate
        $listings = $query->latest()->paginate(9)->withQueryString();

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

        // Reload the listing with necessary relations
        $listing = RealEstateListing::with('seller', 'images', 'mainImage', 'deal:id,real_estate_listing_id')
            ->findOrFail($listing->id);

        // Get the current user's offer if it exists
        $userOffer = $listing->offers()
            ->where('buyer_id', $user->id)
            ->latest()
            ->first();

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
