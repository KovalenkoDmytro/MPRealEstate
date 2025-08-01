<?php

namespace App\Policies;

use App\Models\User;
use App\Models\RealEstateListing;

class RealEstateListingPolicy
{
    public function create(User $user): User|bool {
        return $user->hasRole('seller');
    }

    public function update(User $user, RealEstateListing $listing): bool {
        return $user->id === $listing->seller_id;
    }

    public function delete(User $user, RealEstateListing $listing): bool {
        return $user->id === $listing->seller_id;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['buyer', 'seller', 'admin']);
    }

}
