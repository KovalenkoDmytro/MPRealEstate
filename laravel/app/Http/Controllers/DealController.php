<?php

namespace App\Http\Controllers;

use App\Notifications\PossessionDayConfirmed;
use App\Notifications\PossessionDaySet;
use App\Notifications\SecurityDepositSet;
use App\Notifications\DepositMarkedAsMade;
use App\Notifications\DepositConfirmed;
use App\Notifications\ConditionDaySet;
use App\Notifications\ConditionDayConfirmed;

use App\Models\User;
use App\Models\Deal;
use App\Models\RealEstateListing;

use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

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

        if (!$user->hasRole(['seller', 'lawyer'])) {
            abort(403, 'Unauthorized');
        }

        return $user->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images']) // eager load related data
            ->get();



    }

    /**
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function setDeposit(Request $request, Deal $deal): \Illuminate\Http\RedirectResponse {
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

        // ✅ Notify the buyer
        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing'); // ensure listing relationship is available
            $buyer->notify(new SecurityDepositSet($deal));
        }

        return back()->with('success', 'Security deposit has been set successfully.');
    }


    public function markDepositMade(Request $request, Deal $deal): \Illuminate\Http\RedirectResponse {
        $user = auth()->user();

        // Optional: prevent others from updating
        if (!$deal->users->contains($user)) {
            abort(403, 'Unauthorized');
        }

        if (!$deal->is_made) {
            $deal->is_made = true;
            $deal->save();

            // ✅ Notify the seller
            $seller = $deal->users()->where('role', 'seller')->first();
            if ($seller) {
                $deal->load('listing'); // Ensure deal.listing is available
                $seller->notify(new DepositMarkedAsMade($deal));
            }
        }

        return back()->with('success', 'Deposit marked as made.');
    }


    public function confirmDeposit(Deal $deal)
    {

        if ($deal->is_made) {
            $deal->is_confirmed = true;
            $deal->save();

            // ✅ Notify the buyer
            $buyer = $deal->users()->where('role', 'buyer')->first();
            if ($buyer) {
                $deal->load('listing'); // Ensure 'listing' relation is loaded
                $buyer->notify(new DepositConfirmed($deal));
            }

            return ['status' => 'success', 'message' => 'Security deposit confirmed.'];
        }

    }

    public function setConditionDay(Request $request, Deal $deal): array {
//        $this->authorize('update', $deal); // Optional: Add authorization if needed

        // ✅ Check if already set
        if (!is_null($deal->condition_day)) {
            return ['status' => 'success', 'message' => 'Condition day has already been set and cannot be changed.'];
        }

        // ✅ Validate input
        $validated = $request->validate([
            'condition_day' => 'required|date|after_or_equal:today', // adjust min as needed
        ]);

        // ✅ Set once
        $deal->condition_day = $validated['condition_day'];
        $deal->save();

        // Notify the seller
        $seller = $deal->users()->where('role', 'seller')->first();
        if ($seller) {
            $deal->load('listing');
            $seller->notify(new ConditionDaySet($deal));
        }


        return ['status' => 'success', 'message' => 'Condition day has been set successfully.'];
    }

    public function confirmConditionDay(Deal $deal): array {

        $deal->is_condition_day_confirmed = true;
        $deal->save();

        // Notify the buyer
        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new ConditionDayConfirmed($deal));
        }


        return ['status' => 'success', 'message' => 'Condition day has confirmed.'];

    }

    public function setPossessionDay(Request $request, Deal $deal): array {

        // ✅ Check if already set
        if (!is_null($deal->possession_day)) {
            return ['status' => 'success', 'message' => 'Possession day has already been set and cannot be changed.'];
        }

        // ✅ Validate input
        $validated = $request->validate([
            'possession_day' => 'required|date|after_or_equal:today', // adjust min as needed
        ]);

        // ✅ Set once
        $deal->possession_day = $validated['possession_day'];
        $deal->save();

        // ✅ Notify seller
        $seller = $deal->users()->where('role', 'seller')->first();
        if ($seller) {
            $deal->load('listing');
            $seller->notify(new PossessionDaySet($deal));
        }


        return ['status' => 'success', 'message' => 'Possession day has been set successfully.'];
    }

    public function confirmPossessionDay(Deal $deal): array {

        $deal->is_possession_day_confirmed = true;
        $deal->save();

        // ✅ Notify the buyer
        $buyer = $deal->users()->where('role', 'buyer')->first();
        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new PossessionDayConfirmed($deal));
        }

        return ['status' => 'success', 'message' => 'Possession day has confirmed.'];

    }


    public function inviteLawyer(Request $request, Deal $deal)
    {
        $request->validate([
            'lawyer_code' => 'required|string|size:9',
        ]);

        $lawyer = User::where('lawyer_number', $request->lawyer_code)
            ->whereHas('roles', fn ($q) => $q->where('name', 'lawyer'))
            ->first();

        if (!$lawyer) {
            return response()->json(['message' => 'No lawyer found with this code.'], 404);
        }


        if ($deal->users->contains($lawyer->id)) {
            return response()->json(['message' => 'This lawyer is already part of this deal.'], 422);
        }

        // Mark the lawyer role origin
        if ($request->user()->role === 'buyer') {
            $lawyer->is_buyer_lawyer = TRUE;
        }

        if ($request->user()->role === 'seller') {
            $lawyer->is_seller_lawyer = TRUE;
        }

        $lawyer->save();

        //make db/models  relations
        $deal->users()->attach($lawyer->id);

        return response()->json([
            'message' => 'Lawyer invited successfully.',
            'lawyer' => $lawyer
        ]);
    }




}
