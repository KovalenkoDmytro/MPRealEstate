<?php

namespace App\Http\Controllers;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Http\Requests\ConfirmDepositRequest;
use App\Http\Requests\DealBreakRequest;
use App\Http\Requests\InviteLawyerRequest;
use App\Http\Requests\SetConditionDayRequest;
use App\Http\Requests\SetDepositRequest;
use App\Http\Requests\SetPossessionDayRequest;
use App\Models\Deal;
use App\Services\DealService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

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
//    public function index(): Response
//    {
//        $deals = Deal::with(['users', 'realEstateListing'])->get();
//
//        return Inertia::render('Deals/Index', [
//            'deals' => $deals,
//        ]);
//    }

    /**
     * Show a single deal with users and step details.
     */
    public function show(Deal $deal): Response
    {
        /** @var \App\Models\User $user */
            $user = auth()->user();

        if (!Gate::allows('view-deal', $deal)) {
            abort(403, "Unauthorized - You are not part of this deal.");
        }

        $role = $user->getRoleNames()->first(); // Spatie: gets the user's primary role

        $viewPath = match ($role) {
            'lawyer' => 'Users/Lawyer/Deals/Show',
            'seller' => 'Users/Seller/Deals/Show',
            'buyer'  => 'Users/Buyer/Deals/Show',
            default => throw new \Exception('Unexpected match value'),
        };

        return Inertia::render($viewPath, [
            'deal' => $deal->load([
                'realEstateListing.mainImage',
                'realEstateListing.images',
                'users',
                'files',
                'breakRequest'
            ]),
        ]);

    }

    public function getAllDeals()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        return $user->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images']) // eager load related data
            ->get();
    }

    public function setDeposit(SetDepositRequest $request, Deal $deal): JsonResponse {
        return $this->dealerService->setDeposit($request, $deal);
    }

    public function markDepositMade(Request $request, Deal $deal): JsonResponse {
        dd('markDepositMade');
        return $this->dealerService->markDepositMade($request, $deal);
    }

    public function confirmDeposit(ConfirmDepositRequest $request, Deal $deal): JsonResponse {
        return $this->dealerService->confirmDeposit($request , $deal);
    }

    public function setConditionDay(SetConditionDayRequest $request, Deal $deal): JsonResponse {
        return $this->dealerService->setConditionDay($request, $deal);
    }

    public function confirmConditionDay(Deal $deal): JsonResponse {
        return $this->dealerService->confirmConditionDay($deal);
    }

    public function setPossessionDay(SetPossessionDayRequest $request, Deal $deal): JsonResponse {
        return $this->dealerService->setPossessionDay($request, $deal);
    }

    public function confirmPossessionDay(Deal $deal): JsonResponse {
        return $this->dealerService->confirmPossessionDay($deal);
    }

    public function inviteLawyer(InviteLawyerRequest $request, Deal $deal): JsonResponse {
        return $this->dealerService->inviteLawyer($request, $deal);
    }

    public function breakDeal(DealBreakRequest $request ,Deal $deal): JsonResponse {
        /** @var \App\Models\User $user */

        $validated = $request->validated();
        $user = auth()->user();

        if ($validated['action'] === 'request') {
            return $this->dealerService->breakDeal($validated, $deal);
        }

        if ($validated['action'] === 'respond') {
            return $this->dealerService->respondBreak($deal,  $user, $validated['response']);
        }

        return JsonResponder::send(
            new ErrorResponse('Invalid action specified.', [], 400)
        );
    }


}
