<?php

namespace App\Http\Controllers;

use App\Models\ListingImage;
use App\Models\Seller;
use Illuminate\Http\Request;
use App\Models;
use App\Models\RealEstateListing;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\StoreRealEstateListingRequest;

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
            $listing = RealEstateListing::with('seller', 'images', 'mainImage', 'deal:id,real_estate_listing_id')->findOrFail($listing['id']);

            return Inertia::render('RealEstateListings/Show', [
                'listing' => $listing,
                //            'listing' => $listing->load('seller', 'listingImages', 'deals'),
            ]);
        }



    }

    public function create(): Response {
        return Inertia::render('RealEstateListings/Create');
    }

    public function store(StoreRealEstateListingRequest $request): \Illuminate\Http\RedirectResponse {
        $user = auth()->user();

        // ✅ Only sellers can create listings
        if (!$user->hasRole('seller')) {
            abort(403, 'Unauthorized: Only sellers can create listings.');
        }

        // ✅ Create new listing & attach to seller
        $listing = new RealEstateListing($request->validated());
        $listing->seller_id = $user->id;
        $listing->status = 'available';
        $listing->save();

        // ✅ Handle Main Image Upload
        if ($request->hasFile('main_image')) {
            $path = $request->file('main_image')->store('listings', 'public'); // ✅ Store in `storage/app/public/listings`
            $listing->images()->create([
                'image_path' => "/storage/{$path}",
                'is_main' => true,
            ]);
        }

        // ✅ Handle Gallery Images Upload
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('listings', 'public');
                $listing->images()->create([
                    'image_path' => "/storage/{$path}",
                    'is_main' => false,
                ]);
            }
        }

        return redirect()->route('listings.index')->with('success', 'Listing created successfully!');
    }


    /**
     * ✅ Show the edit form for a listing
     */
    public function edit(RealEstateListing $listing)
    {
        $user = auth()->user();

        // ✅ Ensure only the owner can edit the listing
        if ($listing->seller_id !== $user->id) {
            abort(403, 'Unauthorized: You do not own this listing.');
        }

        return Inertia::render('RealEstateListings/Edit', [
            'listing' => $listing->load('mainImage', 'images'),
        ]);
    }

    /**
     * ✅ Handle the update request
     */
    public function update(Request $request, RealEstateListing $listing)
    {
        $user = auth()->user();

        // ✅ Ensure only the seller who owns the listing can update it
        if ($listing->seller_id !== $user->id) {
            abort(403, 'Unauthorized: You do not own this listing.');
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
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // ✅ Validate main image
            'gallery_images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // ✅ Validate gallery images
            'remove_images' => 'array',
            'remove_images.*' => 'integer|exists:listing_images,id',

        ]);


        //todo add this parameters
        $property_parameters = [
            'home_type'=>'required|array["condo", "house"]',
            'year_build'=>'required|integer|min:1950|max:today',
            'amenities'=>'nullable|array["pool", "gym", "furnished"]',
            'storeys' =>'required|numeric|min:1|max:50',
            'community_name' => 'nullable|string|max:255',
            'annual_property_taxes' => 'required|numeric|min:1|max:5000',
            'parking_space' => 'required|boolean',
            'storage_space' => 'required|boolean',
            'basement_space' => 'required|boolean',
            'construction_material' => 'nullable|string|max:255',
        ];


        // ✅ Update listing details
        $listing->update($validated);

        // ✅ Handle main image upload (if changed)
        if ($request->hasFile('main_image')) {
            // ✅ Delete old main image if it exists
            if ($listing->mainImage) {
                Storage::delete($listing->mainImage->image_path);
                $listing->mainImage->delete();
            }

            // ✅ Save new main image
            $path = $request->file('main_image')->store('listings');
            ListingImage::create([
                'real_estate_listing_id' => $listing->id,
                'image_path' => $path,
                'is_main' => true,
            ]);
        }

        // ✅ Handle gallery images upload
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('listings');
                ListingImage::create([
                    'real_estate_listing_id' => $listing->id,
                    'image_path' => $path,
                    'is_main' => false,
                ]);
            }
        }

        // ✅ Handle image deletions
        if ($request->has('remove_images')) {
            ListingImage::whereIn('id', $request->remove_images)->delete();
        }

        return redirect()->route('listings.index')->with('success', 'Listing updated successfully!');
    }
}
