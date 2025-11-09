<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User; // 1. Import the User model

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // This authenticates the email and password.
        // It will throw an error if credentials are bad.
        $request->authenticate();

        // 2. --- START: ADDED VERIFICATION LOGIC ---

        // Get the user who is trying to log in.
        $user = User::where('email', $request->email)->first();

        // Check if the user's email is NOT verified.
        if ($user && ! $user->hasVerifiedEmail()) {
            // Log the user out immediately.
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Redirect back to the login page with a specific error message.
            return redirect()->route('login')->withErrors([
                'email' => 'You must verify your email address before you can log in.
                            <a href="' . route('verification.notice', ['resendVerificationEmail' => $user->email]) . '"
                               class="underline text-blue-600 hover:text-blue-800">
                               Resend verification link
                            </a>',
            ]);
        }

        // --- END: ADDED VERIFICATION LOGIC ---

        // If the email is verified, proceed with a normal login.
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
