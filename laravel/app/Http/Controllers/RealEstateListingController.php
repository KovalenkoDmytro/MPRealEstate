<?php

namespace App\Http\Controllers;

use App\Models\ListingImage;
use Illuminate\Http\Request;
use App\Models\RealEstateListing;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\RealEstateListingRequest;
use Illuminate\Support\Facades\Storage;

class RealEstateListingController extends Controller {

    /**
     * List all real estate listings.
     */
    public function index(): Response {
        $user = auth()->user();
        $listings = RealEstateListing::with(['seller', 'mainImage'])->get();
        $favoriteListings = $user->favoriteListings()->pluck(
            'real_estate_listing_id'
        );
        return Inertia::render('RealEstateListings/Index', [
            'listings' => $listings,
            'favoriteListings' => $favoriteListings,
        ]);
    }

    /**
     * Show details of a single listing.
     */
    public function show(RealEstateListing $listing) {
        //        $user = auth()->user();

        //        if ($user->hasRole('seller')){
        //            // ✅ If user is a seller, ensure they only access their own listings
        //            if ($listing->seller_id !== $user->id) {
        //                abort(403, 'Unauthorized Access: This listing does not belong to you.');
        //            }
        //            $listing = RealEstateListing::with([
        //                'offers' => function ($query) {
        //                    $query->with(['buyer:id,name,email']); // Select only necessary buyer details
        //                },
        //                'images',
        //                'mainImage'])
        //                ->findOrFail($listing['id']);
        //
        //            return Inertia::render('RealEstateListings/Seller/Show',[
        //                'listing' => $listing,
        //            ]);
        //
        //        }

        //        if (!$user->hasRole('seller')){
        //            $listing = RealEstateListing::with('seller', 'images', 'mainImage', 'deal:id,real_estate_listing_id')->findOrFail($listing['id']);
        //
        //            return Inertia::render('RealEstateListings/Show', [
        //                'listing' => $listing,
        //            ]);
        //        }
    }

    public function create(): Response {
        return Inertia::render('Users/Seller/Listings/Create');
    }


    public function store(RealEstateListingRequest $request
    ) {

        // ✅ Only sellers can create listings
        if (!auth()->user()->hasRole('seller')) {
            abort(403, 'Unauthorized: Only sellers can create listings.');
        }

        // ✅ Create new listing & attach to seller
        $listing = new RealEstateListing($request->validated());
        $listing->seller_id = auth()->user()->id;
        $listing->status = 'available';
        $listing->save();


        $this->handleListingImages($listing, $request);

        return response()->json([
            'message' => 'Listing created successfully!',
        ]);
    }

    /**
     * ✅ Show the edit form for a listing
     */
    public function edit(RealEstateListing $listing) {
        $user = auth()->user();

        // ✅ Ensure only the owner can edit the listing
        if ($listing->seller_id !== $user->id) {
            abort(403, 'Unauthorized: You do not own this listing.');
        }

        return Inertia::render('Users/Seller/Listings/Edit', [
            'listing' => $listing->load('mainImage', 'images'),
        ]);
    }

    /**
     * ✅ Handle the update request
     */
    public function update(
        RealEstateListingRequest $request,
        RealEstateListing $listing
    ) {
        if ($listing->seller_id !== auth()->user()->id) {
            abort(403, 'Unauthorized: You do not own this listing.');
        }

        $listing->update($request->validated());

        $this->handleListingImages($listing, $request);

        return redirect()->route('listings.index')->with('success', 'Listing updated successfully!');
    }


    //Shared logic for storing/updating images

    private function handleListingImages(RealEstateListing $listing, Request $request): void
    {
        // ✅ Handle Main Image
        if ($request->hasFile('main_image')) {
            if ($listing->mainImage) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $listing->mainImage->image_path));
                $listing->mainImage->delete();
            }

            $mainPath = $request->file('main_image')->store('listings', 'public');
            $listing->images()->create([
                'image_path' => "/storage/{$mainPath}",
                'is_main' => true,
            ]);
        }

        // ✅ Handle Gallery Uploads
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('listings', 'public');
                $listing->images()->create([
                    'image_path' => "/storage/{$path}",
                    'is_main' => false,
                ]);
            }
        }

        // ✅ Handle Gallery Deletion
        if ($request->filled('remove_images')) {
            $images = ListingImage::whereIn('id', $request->remove_images)->get();

            foreach ($images as $image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_path));
                $image->delete();
            }
        }
    }

}
