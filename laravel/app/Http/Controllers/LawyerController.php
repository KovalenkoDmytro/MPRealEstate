<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Services\LawyerService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LawyerController extends Controller
{
    private LawyerService $lawyerService;

    public function __construct(LawyerService $lawyerService)
    {
        $this->lawyerService = $lawyerService;
    }

    public function index(): Response
    {
        $user = auth()->user();
        $deals = $this->lawyerService->getAllDealsForLawyer($user);

        return Inertia::render('Users/Lawyer/Dashboard', [
            'deals' => $deals,
        ]);
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
