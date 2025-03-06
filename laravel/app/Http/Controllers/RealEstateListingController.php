<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RealEstateListing;
use Inertia\Inertia;
use Inertia\Response;

class RealEstateListingController extends Controller
{
    /**
     * List all real estate listings.
     */
    public function index(): Response
    {
        $listings = RealEstateListing::with('seller', 'mainImage')->get();

        return Inertia::render('RealEstateListings/Index', [
            'listings' => $listings,
        ]);
    }

    /**
     * Show details of a single listing.
     */
    public function show(RealEstateListing $listing): Response
    {

        $listing = RealEstateListing::with('seller', 'images')->findOrFail($listing['id']);
        return Inertia::render('RealEstateListings/Show', [
            'listing' => $listing,
//            'listing' => $listing->load('seller', 'listingImages', 'deals'),
        ]);
    }

    public function create(): Response {
        return Inertia::render('RealEstateListings/Create');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse {
        $user = auth()->user();

        // ✅ Only sellers can create listings
        if (!$user->hasRole('seller')) {
            abort(403, 'Unauthorized: Only sellers can create listings.');
        }

        // ✅ Validate input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:10000',
            'location' => 'required|string|max:255',
            'bedrooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
            'square_feet' => 'required|integer|min:500',
        ]);

        // ✅ Create new listing & attach to seller
        $listing = new RealEstateListing($validated);
        $listing->seller_id = $user->id; // Attach to the seller
        $listing->status = 'available';
        $listing->save();

        return redirect()->route('listings.index')->with('success', 'Listing created successfully!');
    }

}
