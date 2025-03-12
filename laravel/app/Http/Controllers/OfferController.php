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

    private function showPendingOffers (): \Illuminate\Database\Eloquent\Collection {
        $user = auth()->user();

        // ✅ Fetch all pending offers for listings owned by the seller
        return Offer::with([
            'buyer:id,name,email',
            'listing:id,title'
        ])
            ->whereHas('listing', function ($query) use ($user) {
                $query->where('seller_id', $user->id);
            })
            ->where('status', 'pending')
            ->latest()
            ->get();
    }

    public function index(): \Inertia\Response {
        return Inertia::render('Users/Seller/Dashboard', [
            'pendingOffers' => $this->showPendingOffers()
        ]);

    }


}
