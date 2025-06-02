<?php

namespace App\Http\Controllers;

use App\Models\RealEstateListing;
use App\Notifications\OfferConfirmation;
use App\Notifications\OfferStatusUpdated;
use App\Notifications\OfferSubmitted;
use Illuminate\Http\Request;
use App\Models\Offer;
use Illuminate\Support\Facades\DB;


class OfferController extends Controller
{
    protected $dealController;

    public function __construct(DealController $dealController)
    {
        $this->dealController = $dealController;
    }
    public function store(Request $request, $listing_id)
    {
        $request->validate([
            'offer_price' => 'required|numeric|min:1',
            'message' => 'required|string|max:500',
        ]);

        $listing = RealEstateListing::with('seller')->findOrFail($listing_id);

        $offer = Offer::create([
            'real_estate_listing_id' => $listing_id,
            'buyer_id' => auth()->id(),
            'offer_price' => $request->offer_price,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        $buyer = $request->user();
        $seller = $listing->seller;

        // Notify the seller
        $seller->notify(new OfferSubmitted($listing, $request->user(), $offer));

        // Notify buyer (confirmation)
        $buyer->notify(new OfferConfirmation($listing, $offer));

        return back()->with('success', 'Offer submitted successfully.');
    }

    private function acceptOffer($offer): void {


        // ✅ Create a deal using DealController function
        $this->dealController->createDeal($offer);

        // Change listing status to
        DB::table('real_estate_listings')->where('id',$offer->listing->id)->update(['status' => 'pending']);

    }

    public function updateStatus(Request $request, Offer $offer)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        // Ensure only the listing owner can accept/reject offers
        if ($offer->listing->seller_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $offer->update(['status' => $request->status]);

        // If accepted, create deal and set listing status
        if ($request->status === 'accepted') {
            $this->acceptOffer($offer);
        }

        // ✅ Notify the buyer

        $buyer = $offer->buyer;
        $buyer->notify(new OfferStatusUpdated($offer->listing, $request->status));

        return response()->json([
            'success' => true,
            'message' => 'Offer status updated.',
            'status' => $offer->status,
        ], 200);
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
