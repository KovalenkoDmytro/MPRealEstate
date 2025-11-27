<?php

namespace App\Services;

use App\Models\ListingView;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ListingViewService
{
    public function recordView(User $user, RealEstateListing $listing): void
    {
        DB::transaction(static function () use ($user, $listing): void {
            $hasViewedBefore = ListingView::query()
                ->where('real_estate_listing_id', $listing->id)
                ->where('user_id', $user->id)
                ->exists();

            ListingView::query()->create([
                'real_estate_listing_id' => $listing->id,
                'user_id' => $user->id,
                'viewed_at' => now(),
            ]);

            // Always increment total views
            $listing->newQuery()->whereKey($listing->id)->increment('views_count');

            // Increment unique viewers only on first-ever view by this user
            if (! $hasViewedBefore) {
                $listing->newQuery()->whereKey($listing->id)->increment('unique_viewers_count');
            }
        });
    }
}
