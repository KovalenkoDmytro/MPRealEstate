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
}
