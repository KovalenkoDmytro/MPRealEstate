<?php

namespace App\Http\Controllers;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Models\ListingImage;
use Illuminate\Http\Request;
use App\Models\RealEstateListing;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\RealEstateListingRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

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

    public function create(): Response {
        return Inertia::render('Users/Seller/Listings/Create');
    }

    public function store(RealEstateListingRequest $request): JsonResponse {
        /** @var \App\Models\User $user */
        try{
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

            $this->handleListingImages($listing, $request);

            return JsonResponder::send(
                new SuccessResponse('Listing created successfully!', [])
            );
        }
        catch(\Exception $e){
            return JsonResponder::send(
                new ErrorResponse($e->getMessage())
            );
        }




    }
    /**
     * ✅ Show the edit form for a listing
     */
    public function edit(RealEstateListing $listing): Response {
        /** @var \App\Models\User $user */
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
    public function update(RealEstateListingRequest $request, RealEstateListing $listing):JsonResponse {
        /** @var \App\Models\User $user */
        try {
            $user = auth()->user();
            if ($listing->seller_id !== $user->id) {
                abort(403, 'Unauthorized: You do not own this listing.');
            }

            $listing->update($request->validated());

            $this->handleListingImages($listing, $request);
            return JsonResponder::send(
                new SuccessResponse('Listing updated successfully!', [])
            );
        }
        catch (\Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage())
            );
        }
    }

    public function softDelete(RealEstateListing $listing): \Illuminate\Http\RedirectResponse {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // 1. 🔒 Check ownership
        if ($listing->seller_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // 2. ❌ Check if any deal exists and is not completed
        $hasActiveDeal = $listing->deal()->where('is_completed', false)->exists();
        if ($hasActiveDeal) {
            return redirect()->back()->withErrors([
                'error' => 'Cannot delete listing with an active/incomplete deal.',
            ]);
        }

        // 3. 🔄 Soft-delete logic: set status to inactive
        $listing->update(['status' => 'inactive']);

        // 4. 📦 Clean up: delete all gallery images (keep only main)
        $galleryImages = $listing->images()->where('is_main', false)->get();
        foreach ($galleryImages as $image) {
            Storage::delete(str_replace('/storage/', '', $image->image_path)); // clean path
            $image->delete();
        }

        return redirect()->route('seller.listings.index')->with(
            'success',
            'Listing deactivated and gallery images removed.'
        );
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
