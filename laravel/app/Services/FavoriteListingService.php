<?php

namespace App\Services;

use App\Models\Buyer;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class FavoriteListingService {

    public function getFavorites(User $user,  int $perPage = 12): LengthAwarePaginator {
        $buyer = Buyer::findOrFail($user->id);

        return $buyer->favoriteListings()
            ->with('mainImage')
            ->latest('pivot_created_at')
            ->paginate($perPage);
    }

    public function addToFavorites(User $user, int $listingId): void
    {
        $buyer = Buyer::findOrFail($user->id);
        $buyer->favoriteListings()->syncWithoutDetaching([$listingId]);
    }

    public function removeFromFavorites(User $user, RealEstateListing $listing): void
    {
        $buyer = Buyer::findOrFail($user->id);
        $buyer->favoriteListings()->detach($listing->id);
    }
}
