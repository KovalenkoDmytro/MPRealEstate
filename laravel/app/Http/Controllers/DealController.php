<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use App\Models\Deal;
use Inertia\Inertia;
use Inertia\Response;

class DealController extends Controller
{
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
                    'users'
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

}
