<?php

namespace App\Http\Controllers;


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
        $deals = Deal::with('users')->get();

        return Inertia::render('Deals/Index', [
            'deals' => $deals,
        ]);
    }

    /**
     * Show a single deal with users and step details.
     */
    public function show(Deal $deal): Response
    {
        return Inertia::render('Deals/Show', [
            'deal' => $deal,
            'current_step' => $deal->current_step,
            'users' => $deal->users->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->roles->first()->name ?? 'unknown',
            ]),
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
