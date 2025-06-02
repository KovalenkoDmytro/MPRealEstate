<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LawyerController extends Controller
{
    protected DealController $dealController;

    public function __construct(DealController $dealController) {
        $this->dealController = $dealController;
    }

    /**
     * ✅ Display Lawyer Dashboard
     */
    public function index(): Response
    {

        return Inertia::render('Users/Lawyer/Dashboard',
            [
            'deals' => $this->dealController->getAllDeals(),
        ]
        );
    }

    public function showDealView(Deal $deal): Response {

        if (!Gate::allows('view-deal', $deal)) {
            abort(403, "Unauthorized - You are not part of this deal.");
        }

        return Inertia::render('Users/Lawyer/Deals/Show', [
            'deal' => $deal->load(
                [
                    'realEstateListing.mainImage', // ✅ Load the main image separately
                    'realEstateListing.images', // ✅ Also load all images
                    'users',
                    'files', // all uploaded files
                ]
            ),
        ]);
    }


}
