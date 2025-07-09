<?php

namespace App\Services;

use App\Models\RealEstateListing;
use App\Models\User;

class FavoriteListingService
{
    public function addToFavorites(User $user, int $listingId): void
    {
        $user->favoriteListings()->syncWithoutDetaching([$listingId]);
    }

    public function removeFromFavorites(User $user, RealEstateListing $listing): void
    {
        $user->favoriteListings()->detach($listing->id);
    }
}
