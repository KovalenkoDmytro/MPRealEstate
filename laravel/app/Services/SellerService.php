<?php

namespace App\Services;

use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class SellerService
{
    /**
     * Get all listings for a seller (excluding inactive).
     */
    public function getSellerListings(int $perPage = 9): LengthAwarePaginator
    {
        return RealEstateListing::where('seller_id',  auth()->user()->id)
            ->where('status', '!=', 'inactive')
            ->with(['mainImage'])
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Get a single listing with relationships (ensures ownership).
     */
    public function getSellerListingDetails(User $seller, RealEstateListing $listing): RealEstateListing
    {
        if ($listing->seller_id !== $seller->id) {
            abort(403, __('global.errors.unauthorized'));
        }

        return RealEstateListing::with([
            'offers' => fn($query) => $query->with(['buyer:id,name,email']),
            'images',
            'mainImage',
        ])->findOrFail($listing->id);
    }
}
