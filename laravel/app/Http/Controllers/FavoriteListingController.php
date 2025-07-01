<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RealEstateListing;

class FavoriteListingController extends Controller
{
    public function store(Request $request): \Illuminate\Http\RedirectResponse {

        $user = $request->user();
        $listingId = $request->input('listing_id');

        $user->favoriteListings()->syncWithoutDetaching([$listingId]);

        return back();
    }

    public function destroy(Request $request, RealEstateListing $listing): \Illuminate\Http\RedirectResponse {
        $request->user()->favoriteListings()->detach($listing->id);

        return back();
    }
}
