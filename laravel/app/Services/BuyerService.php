<?php

namespace App\Services;

use App\Models\RealEstateListing;
use App\Models\User;
use App\Http\Requests\ListingFilterRequest;
use App\Filters\ListingFilter;

class BuyerService
{
    public function getFilteredListings(User $user, ListingFilterRequest $request)
    {
        $query = RealEstateListing::query()
            ->where('status', '!=', 'inactive')
            ->with(['seller', 'mainImage']);
        $query = ListingFilter::apply($query, $request->validated(), $user);

        return $query->latest()->paginate(9)->withQueryString();
    }

    public function getListingWithUserOffer(int $listingId, User $user): array {
        $listing = RealEstateListing::with('seller', 'images', 'mainImage', 'deal:id,real_estate_listing_id')
            ->findOrFail($listingId);

        $userOffer = $listing->offers()
            ->where('buyer_id', $user->id)
            ->latest()
            ->first();

        return compact('listing', 'userOffer');
    }
}
