<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Services\DealService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class DealController extends Controller
{
    use AuthorizesRequests;

    private DealService $dealerService;

    public function __construct(DealService $dealerService){
        $this->dealerService = $dealerService;
    }

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

    public function getAllDeals()
    {
        $user = auth()->user();

        return $user->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images']) // eager load related data
            ->get();
    }

    public function setDeposit(Request $request, Deal $deal): JsonResponse {
        return $this->dealerService->setDeposit($request, $deal);
    }

    public function markDepositMade(Request $request, Deal $deal): JsonResponse {
        return $this->dealerService->markDepositMade($request, $deal);
    }

    public function confirmDeposit(Deal $deal): JsonResponse {
        return $this->dealerService->confirmDeposit($deal);
    }

    public function setConditionDay(Request $request, Deal $deal): JsonResponse {
        return $this->dealerService->setConditionDay($request, $deal);
    }

    public function confirmConditionDay(Deal $deal): JsonResponse {
        return $this->dealerService->confirmConditionDay($deal);
    }

    public function setPossessionDay(Request $request, Deal $deal): JsonResponse {
        return $this->dealerService->setPossessionDay($request, $deal);
    }

    public function confirmPossessionDay(Deal $deal): JsonResponse {
        return $this->dealerService->confirmPossessionDay($deal);
    }

    public function inviteLawyer(Request $request, Deal $deal): JsonResponse {
        return $this->dealerService->inviteLawyer($request, $deal);
    }
}
