<?php

namespace App\Http\Controllers;

use App\Helpers\Responses\JsonResponder;
use App\Notifications\PossessionDayConfirmed;
use App\Notifications\PossessionDaySet;
use App\Notifications\LawyerInvitedToDeal;
use App\Notifications\DepositMarkedAsMade;
use App\Notifications\DepositConfirmed;
use App\Notifications\ConditionDaySet;
use App\Notifications\ConditionDayConfirmed;
use App\Notifications\SecurityDepositSet;

use App\Models\User;
use App\Models\Deal;
use App\Models\RealEstateListing;

use Exception;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use App\Helpers\Responses\SuccessResponse;
use App\Helpers\Responses\ErrorResponse;

use Illuminate\Validation\ValidationException;
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

        try{
            // ✅ Check if already set
            if (!is_null($deal->security_deposit)) {
                return JsonResponder::send(
                    new ErrorResponse('Security deposit has already been set and cannot be changed.', [], 400)
                );
            }
            // ✅ Validate input
            $validated = $request->validate([
                'security_deposit' => 'required|numeric|min:100',
            ]);

            // ✅ Set once
            $deal->security_deposit = $validated['security_deposit'];
            $deal->save();

            // ✅ Notify the buyer
            $buyer = $deal->users()->where('role', 'buyer')->first();
            if ($buyer) {
                $deal->load('listing');
                $buyer->notify(new SecurityDepositSet($deal));
            }

            return JsonResponder::send(
              new SuccessResponse('Security deposit has been set successfully.', $deal)
            );

        }
        catch(\Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage())
            );
        }


    }


    public function markDepositMade(Request $request, Deal $deal): JsonResponse {
        try {
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

            return JsonResponder::send(
                new SuccessResponse('Deposit marked as made.', $deal),
            );
        } catch (Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage(), [], 500)
            );
        }
    }


    public function confirmDeposit(Deal $deal) : JsonResponse
    {
        try {
            if ($deal->is_made) {
                $deal->is_confirmed = true;
                $deal->save();

                $buyer = $deal->users()->where('role', 'buyer')->first();
                if ($buyer) {
                    $deal->load('listing');
                    $buyer->notify(new DepositConfirmed($deal));
                }

                return JsonResponder::send(
                    new SuccessResponse('Deposit confirmed.', $deal),
                );
            }

            return JsonResponder::send(
                new ErrorResponse('Security deposit has not been marked as made.', [], 400),
            );
        } catch (Exception $e) {
            // Optional: log error or add specific checks for certain exception types
            return JsonResponder::send(
                new ErrorResponse($e->getMessage(), [], 500),
            );
        }
    }

    public function setConditionDay(Request $request, Deal $deal): JsonResponse {

        try {
            // ✅ Check if already set
            if (!is_null($deal->condition_day)) {
                return JsonResponder::send(
                    new ErrorResponse('Condition day has already been set and cannot be changed.', [], 400),
                );
            }

            // ✅ Validate input
            $validated = $request->validate([
                'condition_day' => 'required|date|after_or_equal:today',
            ]);

            // ✅ Set once
            $deal->condition_day = $validated['condition_day'];
            $deal->save();

            // ✅ Notify the seller
            $seller = $deal->users()->where('role', 'seller')->first();
            if ($seller) {
                $deal->load('listing');
                $seller->notify(new ConditionDaySet($deal));
            }

            return JsonResponder::send(
                new SuccessResponse('Condition day has been set successfully.', $deal),
            );

        } catch (Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage(), [], 500),
            );
        }
    }

    public function confirmConditionDay(Deal $deal): JsonResponse {

        try{
            $deal->is_condition_day_confirmed = true;
            $deal->save();

            // Notify the buyer
            $buyer = $deal->users()->where('role', 'buyer')->first();
            if ($buyer) {
                $deal->load('listing');
                $buyer->notify(new ConditionDayConfirmed($deal));
            }

            return JsonResponder::send(
                new SuccessResponse('Condition day has confirmed.', $deal),
            );
        }
        catch(Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage(), [], 500),
            );
        }
    }

    public function setPossessionDay(Request $request, Deal $deal): JsonResponse {
        try {
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

            return JsonResponder::send(
                new SuccessResponse('Possession day has been set successfully.', $deal),
            );
        }catch (Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage(), [], 500),
            );
        }
    }

    public function confirmPossessionDay(Deal $deal): JsonResponse {

        try{
            $deal->is_possession_day_confirmed = true;
            $deal->save();

            // ✅ Notify the buyer
            $buyer = $deal->users()->where('role', 'buyer')->first();
            if ($buyer) {
                $deal->load('listing');
                $buyer->notify(new PossessionDayConfirmed($deal));
            }

            return JsonResponder::send(
                new SuccessResponse('Possession day has confirmed.', $deal),
            );
        }
        catch(Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage(), [], 500),
            );
        }
    }

    public function inviteLawyer(Request $request, Deal $deal): JsonResponse
    {
        try {
            // ✅ Validate input
            $validated = $request->validate([
                'lawyer_code' => 'required|string|size:9',
            ]);

            // ✅ Find lawyer by code & role
            $lawyer = User::where('lawyer_number', $validated['lawyer_code'])
                ->whereHas('roles', fn ($q) => $q->where('name', 'lawyer'))
                ->first();

            if (!$lawyer) {
                return JsonResponder::send(
                    new ErrorResponse('No lawyer found with this code.', 404)
                );
            }

            // ✅ Check if lawyer is already part of the deal
            if ($deal->users->contains($lawyer->id)) {
                return JsonResponder::send(
                    new ErrorResponse('This lawyer is already part of this deal.', 422)
                );
            }

            // ✅ Mark lawyer's origin role
            if ($request->user()->role === 'buyer') {
                $lawyer->is_buyer_lawyer = true;
            } elseif ($request->user()->role === 'seller') {
                $lawyer->is_seller_lawyer = true;
            }

            $lawyer->save();

            // ✅ Attach lawyer to deal
            $deal->users()->attach($lawyer->id);

            // ✅ Notify lawyer
            $lawyer->notify(new LawyerInvitedToDeal($deal));

            return JsonResponder::send(
                new SuccessResponse('Lawyer invited successfully.', $lawyer)
            );

        } catch (ValidationException $e) {
            return JsonResponder::send(
                new ErrorResponse('Validation failed.', 422, $e->errors())
            );
        } catch (Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage(), 500)
            );
        }
    }
}
