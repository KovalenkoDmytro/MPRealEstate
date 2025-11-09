<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function read(string $id)
    {
        $user = Auth::user();

        if (! $user) {
            abort(403, 'Unauthorized.');
        }

        $notification = $user->notifications()->find($id);

        if (! $notification) {
            abort(404, 'Notification not found.');
        }

        $notification->markAsRead();

        return back();
    }

    public function readAll()
    {
        $user = Auth::user();

        if (! $user) {
            abort(403, 'Unauthorized.');
        }

        $user->unreadNotifications->markAsRead();

        return back();
    }
}
