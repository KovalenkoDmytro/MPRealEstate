<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Buyer;
use App\Models\ListingView;
use App\Models\ListingImage;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RealEstateListingService
{
    public function createListing(
        array $data,
        User $seller,
        ?UploadedFile $mainImage = null,
        array $galleryImages = [],
        array $removeImageIds = [],
    ): void {
        $listing = new RealEstateListing($data);
        $listing->seller_id = $seller->getKey();
        $listing->status = 'available';
        $listing->save();

        $this->handleListingImages($listing, $mainImage, $galleryImages, $removeImageIds);
    }

    public function updateListing(
        array $data,
        RealEstateListing $listing,
        ?UploadedFile $mainImage = null,
        array $galleryImages = [],
        array $removeImageIds = [],
    ): void {
        $listing->update($data);
        $this->handleListingImages($listing, $mainImage, $galleryImages, $removeImageIds);
    }

    public function deactivateListing(RealEstateListing $listing): void
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
    }

    private function handleListingImages(
        RealEstateListing $listing,
        ?UploadedFile $mainImage,
        array $galleryImages,
        array $removeImageIds,
    ): void {
        if ($mainImage !== null) {
            if ($listing->mainImage) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $listing->mainImage->image_path));
                $listing->mainImage->delete();
            }

            $mainPath = $mainImage->store('listings', 'public');

            $listing->images()->create([
                'image_path' => "/storage/$mainPath",
                'is_main' => true,
            ]);
        }

        if (count($galleryImages) > 0) {
            foreach ($galleryImages as $file) {
                $path = $file->store('listings', 'public');
                $listing->images()->create([
                    'image_path' => "/storage/$path",
                    'is_main' => false,
                ]);
            }
        }

        if (count($removeImageIds) > 0) {
            $images = ListingImage::whereIn('id', $removeImageIds)->get();

            foreach ($images as $image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_path));
                $image->delete();
            }
        }
    }

    public function getFavoriteListingIds(User $user): Collection {

        $buyer = Buyer::find($user->id);

        if (!$buyer) {
            return collect();
        }

        return $buyer->favoriteListings()->pluck('real_estate_listing_id');

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


    /**
     * HELPER: Calculate total favorites across all seller's listings.
     */
    private function calculateTotalFavorites(int $sellerId): int
    {
        // We use the RealEstateListing model to start the query
        return RealEstateListing::query()
            ->where('seller_id', $sellerId)
            ->join('favorite_listings', 'real_estate_listings.id', '=', 'favorite_listings.real_estate_listing_id')
            ->count();
    }

    /**
     * Helper: Calculate view stats using pure Eloquent (4 queries).
     */
    private function calculateTotalViews(int $sellerId): array
    {
        $now = now();
        $startOfToday = $now->copy()->startOfDay();

        $baseQuery = ListingView::getForSeller($sellerId);

        return [
            'today'       => (clone $baseQuery)->where('viewed_at', '>=', $startOfToday)->count(),
            'last_7_days' => (clone $baseQuery)->where('viewed_at', '>=', now()->subDays(7))->count(),
            'total'       => (clone $baseQuery)->count(),
            'unique'      => (clone $baseQuery)->distinct('user_id')->count('user_id'),
        ];
    }

    public function getLast7DaysViews(int $sellerId): array
    {
        $sevenDaysAgo = now()->subDays(6)->startOfDay();

        // Query the database for counts grouped by date
        $dailyRecords = ListingView::getForSeller($sellerId)
            ->where('viewed_at', '>=', $sevenDaysAgo)
            ->selectRaw('DATE(viewed_at) as date, count(*) as total')
            ->groupBy('date')
            ->pluck('total', 'date');

        $dailyTrend = [];

        // Loop through the last 7 days (including today) to ensure the array is full
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');

            $dailyTrend[] = [
                'date'  => $date,
                'total' => $dailyRecords[$date] ?? 0, // Fill with 0 if no records exist for this date
            ];
        }

        return $dailyTrend;
    }



    public function getSellerListingPerformanceStats(int $sellerId): array {

        $totalFavorites = $this->calculateTotalFavorites($sellerId);
        $viewStats = $this->calculateTotalViews($sellerId);
        $last7DaysViews = $this->getLast7DaysViews($sellerId);

        return [
            'favorites' => [
                'total' => $totalFavorites,
            ],
            'views' => [
                'total'       => $viewStats['total'],
                'unique'      => $viewStats['unique'],
                'today'       => $viewStats['today'],
                'last_7_days' => $viewStats['last_7_days'],
            ],
            'chart_data' =>[
                'last_7_days' => $last7DaysViews,
            ]
        ];
    }

}
