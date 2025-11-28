<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Http\Requests\RealEstateListingRequest;
use App\Models\RealEstateListing;
use App\Models\ListingImage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class RealEstateListingService
{
    public function createListing(RealEstateListingRequest $request): void {
        $user = auth()->user();

        // Exclude image fields from the data we use for main model
        $data = $request->safe()->except(['main_image', 'gallery_images', 'remove_images', 'remove_main_image']);

        // Create listing
        $listing = new RealEstateListing($data);
        $listing->seller_id = $user->id;
        $listing->status = 'available';
        $listing->save();

        // Handle images separately
        $this->handleListingImages($listing, $request);
    }

    public function updateListing(RealEstateListingRequest $request, RealEstateListing $listing ): JsonResponse
    {
        $data = $request->safe()->except(['main_image', 'gallery_images', 'remove_images', 'remove_main_image']);

        $listing->update($data);
        $this->handleListingImages($listing, $request);

        return JsonResponder::send(
            new SuccessResponse(__('listings.success.updated'))
        );
    }

    public function deactivateListing(RealEstateListing $listing): JsonResponse
    {
        DB::transaction(static function () use ($listing) {
            // 1) Mark as inactive
            $listing->update(['status' => 'inactive']);

            // 2) Soft delete (sets deleted_at)
            $listing->delete();

            // 3) Delete gallery images (not main)
            $listing->images()
                ->where('is_main', false)
                ->get()
                ->each(function ($image) {
                    Storage::delete(str_replace('/storage/', '', $image->image_path));
                    $image->delete(); // soft deletes if model uses SoftDeletes
                });
        });

        return JsonResponder::send(
            new SuccessResponse(__('listings.success.deactivated'))
        );
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
                'image_path' => "/storage/$mainPath",
                'is_main' => true,
            ]);


        }

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('listings', 'public');
                $listing->images()->create([
                    'image_path' => "/storage/$path",
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

    public function getFavoriteListingIds(User $user): Collection {
        // Only return favorites for roles that support it
        if ($user->hasAnyRole(['buyer', 'admin'])) {
            return $user->favoriteListings()->pluck('real_estate_listing_id');
        }

        return collect(); // empty collection for others
    }



    public function getRecentlyViewed(User $user, int $limit = 6): array
    {
        $userId = $user->id;

        $viewedIds = DB::table('listing_views')
            ->where('user_id', $userId)
            ->orderBy('viewed_at', 'desc')
            ->pluck('real_estate_listing_id');

        $uniqueIds = $viewedIds->unique()->take($limit);

        if ($uniqueIds->isEmpty()) {
            return [];
        }

        $listings = RealEstateListing::whereIn('id', $uniqueIds)
            ->with(['mainImage'])
            ->get();

        return $uniqueIds->map(function ($id) use ($listings) {
            return $listings->firstWhere('id', $id);
        })
            ->filter()
            ->values()
            ->all();
    }



}
