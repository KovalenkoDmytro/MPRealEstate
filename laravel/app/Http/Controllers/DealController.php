<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Models\RealEstateListing;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use App\Models\Deal;
use Inertia\Inertia;
use Inertia\Response;

class DealController extends Controller
{
    use AuthorizesRequests;

    /**
     * Show all deals in Inertia React view.
     */
    public function index(): Response
    {
        $deals = Deal::with(['users', 'realEstateListing'])->get();

        return Inertia::render('Deals/Index', [
            'deals' => $deals,
        ]);
    }

    /**
     * ✅ Store a new Deal
     */
    public function createDeal($offer) {

        $listing = RealEstateListing::findOrFail($offer->real_estate_listing_id);

        // ✅ Ensure buyer cannot create a deal on their own listing
        if ($listing->seller_id === $offer->buyer_id) {
            abort(403, 'You cannot create a deal on your own listing.');
        }

        // ✅ Create a new deal
        $deal = Deal::create([
            'name' => "Deal for " . $listing->title,
            'amount' => $offer->offer_price,
            'data' => json_encode(['description' => $offer->message]),
            'real_estate_listing_id' => $listing->id,
            'current_step' => 'Step1', // Set initial step
        ]);

        // ✅ Attach buyer and seller to the deal
        $deal->users()->attach([$offer->buyer_id, $listing->seller_id]);

    }

    /**
     * Show a single deal with users and step details.
     */
    public function show(Deal $deal): Response
    {
        if (!Gate::allows('view-deal', $deal)) {
            abort(403, "Unauthorized - You are not part of this deal.");
        }




//        if (!auth()->user()) {
//            abort(403, "Unauthorized - No user found.");
//        }
//
//        $userRoles = auth()->user()->getRoleNames(); // Get roles
//        if (!$userRoles->intersect(['admin', 'buyer', 'seller', 'lawyer'])->count()) {
//            abort(403, "Unauthorized - User has roles: " . json_encode($userRoles) . " but needs 'admin', 'buyer', 'seller', or 'lawyer'.");
//        }

        return Inertia::render('Deals/Show', [
            'deal' => $deal->load(
                [
                    'realEstateListing.mainImage', // ✅ Load the main image separately
                    'realEstateListing.images', // ✅ Also load all images
                    'users',
                ]
            ),
        ]);
    }

    /**
     * Move deal to the next step.
     */
    public function moveToNextStep(Deal $deal): \Illuminate\Http\RedirectResponse {
        $deal->moveToNextStep();

        return redirect()->route('deals.show', $deal->id);
    }

    public function getAllDeals()
    {
        $user = auth()->user();

        if (!$user->hasRole('seller')) {
            abort(403, 'Unauthorized');
        }

        return $user->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images']) // eager load related data
            ->get();



    }

    public function setDeposit(Request $request, Deal $deal)
    {
        $this->authorize('update', $deal); // Optional: Add authorization if needed

        // ✅ Check if already set
        if (!is_null($deal->security_deposit)) {
            return back()->with('error', 'Security deposit has already been set and cannot be changed.');
        }

        // ✅ Validate input
        $validated = $request->validate([
            'security_deposit' => 'required|numeric|min:100', // adjust min as needed
        ]);

        // ✅ Set once
        $deal->security_deposit = $validated['security_deposit'];
        $deal->save();

        return back()->with('success', 'Security deposit has been set successfully.');
    }


    public function markDepositMade(Request $request, Deal $deal)
    {
        $user = auth()->user();

        // Optional: prevent others from updating
        if (!$deal->users->contains($user)) {
            abort(403, 'Unauthorized');
        }

        if (!$deal->is_made) {
            $deal->is_made = true;
            $deal->save();
        }

        return back()->with('success', 'Deposit marked as made.');
    }




}
