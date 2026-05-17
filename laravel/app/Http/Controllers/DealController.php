<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Deals\ConfirmConditionDayAction;
use App\Actions\Deals\ConfirmDepositAction;
use App\Actions\Deals\ConfirmPossessionDayAction;
use App\Actions\Deals\InviteLawyerToDealAction;
use App\Actions\Deals\MarkDepositMadeAction;
use App\Actions\Deals\RequestDealBreakAction;
use App\Actions\Deals\RespondToDealBreakAction;
use App\Actions\Deals\SetConditionDayAction;
use App\Actions\Deals\SetPossessionDayAction;
use App\Actions\Deals\SetSecurityDepositAction;
use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Http\Requests\ConfirmDepositRequest;
use App\Http\Requests\DealBreakRequest;
use App\Http\Requests\InviteLawyerRequest;
use App\Http\Requests\SetConditionDayRequest;
use App\Http\Requests\SetDepositMadeRequest;
use App\Http\Requests\SetDepositRequest;
use App\Http\Requests\SetPossessionDayRequest;
use App\Models\Deal;
use App\Support\RoleViewResolver;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DealController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        return Inertia::render(RoleViewResolver::resolve([
            'lawyer' => 'Users/Lawyer/Deals/Index',
        ]), [
            'deals' => $this->getAllDeals(),
        ]);
    }

    public function show(Deal $deal): Response
    {
        if (! Gate::allows('view-deal', $deal)) {
            abort(403, 'Unauthorized - You are not part of this deal.');
        }

        return Inertia::render(RoleViewResolver::resolve([
            'lawyer' => 'Users/Lawyer/Deals/Show',
            'seller' => 'Users/Seller/Deals/Show',
            'buyer' => 'Users/Buyer/Deals/Show',
        ]), [
            'deal' => $deal->load([
                'realEstateListing.mainImage',
                'realEstateListing.images',
                'users',
                'files',
                'breakRequest',
            ]),
        ]);
    }

    public function getAllDeals(): mixed
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        return $user->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images'])
            ->get();
    }

    public function setDeposit(SetDepositRequest $request, Deal $deal): JsonResponse
    {
        try {
            SetSecurityDepositAction::run((float) $request->security_deposit, $deal);

            return JsonResponder::send(new SuccessResponse(__('deals.success.security_deposit_set')));
        } catch (\RuntimeException $e) {
            return JsonResponder::send(new ErrorResponse($e->getMessage()));
        }
    }

    public function markDepositMade(SetDepositMadeRequest $request, Deal $deal): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        MarkDepositMadeAction::run(
            (bool) $request->is_security_deposit_made,
            (string) $request->security_deposit_made_at,
            $deal,
            $user,
        );

        return JsonResponder::send(new SuccessResponse(__('deals.success.deposit_marked_made')));
    }

    public function confirmDeposit(ConfirmDepositRequest $request, Deal $deal): JsonResponse
    {
        $updatedDeal = ConfirmDepositAction::run(
            (bool) $request->is_security_deposit_confirmed,
            (string) $request->security_deposit_confirmed_at,
            $deal,
        );

        return JsonResponder::send(
            new SuccessResponse(__('deals.success.deposit_confirmed'), $updatedDeal->toArray()),
        );
    }

    public function setConditionDay(SetConditionDayRequest $request, Deal $deal): JsonResponse
    {
        try {
            SetConditionDayAction::run((string) $request->condition_day, $deal);

            return JsonResponder::send(new SuccessResponse(__('deals.success.condition_day_set')));
        } catch (\RuntimeException $e) {
            return JsonResponder::send(new ErrorResponse($e->getMessage()));
        }
    }

    public function confirmConditionDay(Deal $deal): JsonResponse
    {
        ConfirmConditionDayAction::run($deal);

        return JsonResponder::send(new SuccessResponse(__('deals.success.condition_day_confirmed')));
    }

    public function setPossessionDay(SetPossessionDayRequest $request, Deal $deal): JsonResponse
    {
        try {
            SetPossessionDayAction::run((string) $request->possession_day, $deal);

            return JsonResponder::send(new SuccessResponse(__('deals.success.possession_day_set')));
        } catch (\RuntimeException $e) {
            return JsonResponder::send(new ErrorResponse($e->getMessage()));
        }
    }

    public function confirmPossessionDay(Deal $deal): JsonResponse
    {
        ConfirmPossessionDayAction::run($deal);

        return JsonResponder::send(new SuccessResponse(__('deals.success.possession_day_confirmed')));
    }

    public function inviteLawyer(InviteLawyerRequest $request, Deal $deal): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        InviteLawyerToDealAction::run(
            (string) $request->lawyer_code,
            (string) $user->getRoleNames()->first(),
            $deal,
        );

        return JsonResponder::send(new SuccessResponse(__('deals.success.lawyer_invite_sent')));
    }

    public function breakDeal(DealBreakRequest $request, Deal $deal): JsonResponse
    {
        $validated = $request->validated();

        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($validated['action'] === 'request') {
            try {
                RequestDealBreakAction::run($validated['message'], $deal, $user);

                return JsonResponder::send(new SuccessResponse(__('deals.success.break_request_sent')));
            } catch (\RuntimeException $e) {
                return JsonResponder::send(new ErrorResponse($e->getMessage()));
            }
        }

        if ($validated['action'] === 'respond') {
            try {
                RespondToDealBreakAction::run($deal, $user, $validated['response']);

                return JsonResponder::send(new SuccessResponse(__('deals.success.break_responded')));
            } catch (\RuntimeException $e) {
                return JsonResponder::send(new ErrorResponse($e->getMessage()));
            } catch (\InvalidArgumentException $e) {
                return JsonResponder::send(new ErrorResponse($e->getMessage(), [], 400));
            }
        }

        return JsonResponder::send(
            new ErrorResponse('Invalid action specified.', [], 400),
        );
    }
}
