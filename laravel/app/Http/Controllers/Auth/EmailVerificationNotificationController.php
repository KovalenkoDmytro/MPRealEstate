<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request)
    {
        // Logged-in user case
        if ($request->user()) {
            if ($request->user()->hasVerifiedEmail()) {
                return response()->json(['message' => 'Your email is already verified.']);
            }

            $request->user()->sendEmailVerificationNotification();
            return response()->json(['status' => 'verification-link-sent']);
        }

        // Guest case
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json(['message' => 'No user found with that email.'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Your email is already verified. You can log in.']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['status' => 'verification-link-sent']);
    }

}
