<?php

namespace App\Services;

use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class FavoriteListingService {

    public function getFavorites(User $user, int $perPage = 12): LengthAwarePaginator {

        return $user->favoriteListings()
            ->with('mainImage')             // Eager load images
            ->latest('pivot_created_at') // Sort by the newest favorite
            ->paginate($perPage);        // Returns the Paginator object
    }

    public function addToFavorites(User $user, int $listingId): void
    {
        $user->favoriteListings()->syncWithoutDetaching([$listingId]);
    }

    public function removeFromFavorites(User $user, RealEstateListing $listing): void
    {
        $user->favoriteListings()->detach($listing->id);
    }
}
