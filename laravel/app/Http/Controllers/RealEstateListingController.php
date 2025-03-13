<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use App\Models;
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
        $user = auth()->user();

        // ✅ If user is a seller, get only their listings
        if ($user->hasRole('seller')) {
            $listings = RealEstateListing::where('seller_id', $user->id)
                ->with(['mainImage'])
                ->get();

            return Inertia::render('RealEstateListings/Seller/Index', [
                'listings' => $listings,
            ]);

        } else {
            // ✅ Otherwise, return all listings
            $listings = RealEstateListing::with(['seller', 'mainImage'])->get();
            return Inertia::render('RealEstateListings/Index', [
                'listings' => $listings,
            ]);
        }


    }


    /**
     * Show details of a single listing.
     */
    public function show(RealEstateListing $listing)
    {
        $user = auth()->user();


        if ($user->hasRole('seller')){
            // ✅ If user is a seller, ensure they only access their own listings
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

            return Inertia::render('RealEstateListings/Seller/Show',[
                'listing' => $listing,
            ]);

        }

        if (!$user->hasRole('seller')){
            $listing = RealEstateListing::with('seller', 'images', 'mainImage')->findOrFail($listing['id']);

            return Inertia::render('RealEstateListings/Show', [
                'listing' => $listing,
                //            'listing' => $listing->load('seller', 'listingImages', 'deals'),
            ]);
        }



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
            'main_image' => 'nullable|url',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'url',
        ]);

        // ✅ Create new listing & attach to seller
        $listing = new RealEstateListing($validated);
        $listing->seller_id = $user->id; // Attach to the seller
        $listing->status = 'available';
        $listing->save();

        // ✅ Attach main image if provided
        if ($request->has('main_image')) {
            $listing->images()->create([
                'image_path' => $request->main_image,
                'is_main' => true,
            ]);
        }

        // ✅ Attach gallery images if provided
        if ($request->has('gallery_images')) {
            foreach ($request->gallery_images as $imageUrl) {
                $listing->images()->create([
                    'image_path' => $imageUrl,
                    'is_main' => false,
                ]);
            }
        }

        return redirect()->route('listings.index')->with('success', 'Listing created successfully!');
    }

}
