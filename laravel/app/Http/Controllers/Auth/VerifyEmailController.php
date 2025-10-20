<?php


namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request)
    {
        // 1️⃣ Check if the link is valid
        if (! URL::hasValidSignature($request)) {
            // Link is invalid or expired
            $user = User::find($request->route('id'));

            // If user exists, show the verify email view again
            if ($user) {
                return Inertia::render('Auth/VerifyEmail', [
                    'expired' => true,
                    'email' => $user->email,
                    'message' => 'This verification link has expired. You can request a new one below.'
                ]);
            }

            return redirect()->route('register')->with('error', 'Invalid verification link.');
        }

        // 2️⃣ Find user by ID
        $user = User::find($request->route('id'));
        if (! $user) {
            return redirect()->route('register')->with('error', 'User not found.');
        }

        // 3️⃣ Check hash
        if (! hash_equals(sha1($user->getEmailForVerification()), $request->route('hash'))) {
            return redirect()->route('register')->with('error', 'Invalid verification hash.');
        }

        // 4️⃣ Mark verified
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        // 5️⃣ Redirect success
        return redirect()->route('login')->with('message', 'Your email has been verified. You can now log in.');
    }
}
