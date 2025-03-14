<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Offer;
use App\Models\Listing;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function store(Request $request, $listing_id)
    {
        $request->validate([
            'offer_price' => 'required|numeric|min:1',
            'message' => 'required|string|max:500',
        ]);

//        $listing = RealEs::findOrFail($listing_id);

        Offer::create([
            'real_estate_listing_id' => $listing_id,
            'buyer_id' => auth()->id(),
            'offer_price' => $request->offer_price,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Offer submitted successfully.');
    }

    public function updateStatus(Request $request, Offer $offer)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        // Ensure only the listing owner can accept/reject offers
        if ($offer->listing->seller_id !== auth()->id()) {
            return back()->with('error', 'Unauthorized');
        }

        $offer->update(['status' => $request->status]);

        return back()->with('success', 'Offer status updated.');
    }

    /**
     * ✅ Fetch all offers for listings owned by the seller
     */
    public function showAllOffers(int $sellerId): \Illuminate\Database\Eloquent\Collection
    {

        return Offer::with([
            'buyer:id,name,email',
            'listing:id,title'
        ])
            ->whereHas('listing', function ($query) use ($sellerId) {
                $query->where('seller_id', $sellerId);
            })
            ->latest()
            ->get();
    }

    /**
     * ✅ Fetch all offers that the buyer has submitted
     */
    public function showBuyerOffers(int $buyerId): \Illuminate\Database\Eloquent\Collection
    {

        return Offer::with([
            'listing:id,title,price,seller_id',
            'listing.seller:id,name'
        ])
            ->where('buyer_id', $buyerId)
            ->latest()
            ->get();
    }




}
