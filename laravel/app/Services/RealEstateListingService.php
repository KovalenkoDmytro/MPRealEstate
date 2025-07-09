<?php

namespace App\Services;

use App\Http\Requests\RealEstateListingRequest;
use App\Models\RealEstateListing;
use App\Models\ListingImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RealEstateListingService
{
    public function createListing(RealEstateListingRequest $request, $user): RealEstateListing
    {
        $listing = new RealEstateListing($request->validated());
        $listing->seller_id = $user->id;
        $listing->status = 'available';
        $listing->save();

        $this->handleListingImages($listing, $request);

        return $listing;
    }

    public function updateListing(RealEstateListingRequest $request, RealEstateListing $listing ): void
    {
        $listing->update($request->validated());
        $this->handleListingImages($listing, $request);
    }

    public function deactivateListing(RealEstateListing $listing): void
    {
        $listing->update(['status' => 'inactive']);

        $galleryImages = $listing->images()->where('is_main', false)->get();
        foreach ($galleryImages as $image) {
            Storage::delete(str_replace('/storage/', '', $image->image_path));
            $image->delete();
        }
    }

    //Shared logic for storing/updating images
    private function handleListingImages(RealEstateListing $listing, Request $request): void
    {
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

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('listings', 'public');
                $listing->images()->create([
                    'image_path' => "/storage/{$path}",
                    'is_main' => false,
                ]);
            }
        }

        if ($request->filled('remove_images')) {
            $images = ListingImage::whereIn('id', $request->remove_images)->get();

            foreach ($images as $image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_path));
                $image->delete();
            }
        }
    }
}
