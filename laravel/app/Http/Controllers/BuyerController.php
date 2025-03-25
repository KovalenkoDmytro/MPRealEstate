<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Deal;
class BuyerController extends Controller
{
    protected OfferController $offerController;

    public function __construct(OfferController $offerController)
    {
        $this->offerController = $offerController;
    }

    /**
     * ✅ Display Buyer Dashboard with their Offers
     */
    public function index(): Response
    {
        $user = auth()->user();

        return Inertia::render('Users/Buyer/Dashboard', [
            'offers' => $this->offerController->showBuyerOffers($user->id),
        ]);
    }

    public function showDealView(Deal $deal): Response {


        if (!Gate::allows('view-deal', $deal)) {
            abort(403, "Unauthorized - You are not part of this deal.");
        }

        return Inertia::render('Users/Buyer/Deals/Show', [
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
