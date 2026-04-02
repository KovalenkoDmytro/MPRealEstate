<?php

namespace App\Http\Controllers;

use App\Models\Buyer;
use App\Models\Lawyer;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();

        if (! $user) {
            abort(403, 'Unauthorized.');
        }

        return response()->json($this->getNotificationSummary($user));
    }

    public function read(string $id): JsonResponse {
        $user = Auth::user();

        if (! $user) {
            abort(403, 'Unauthorized.');
        }

        $notification = $user->notifications()->find($id);

        if (! $notification) {
            abort(404, 'Notification not found.');
        }

        $notification->markAsRead();
        $this->forgetNotificationCache($user->id);

        return response()->json(['status' => 'ok']);
    }

    public function readAll(): JsonResponse {
        $user = Auth::user();

        if (! $user) {
            abort(403, 'Unauthorized.');
        }

        $user->unreadNotifications()->update(['read_at' => now()]);
        $this->forgetNotificationCache($user->id);

        return response()->json(['status' => 'ok']);
    }

    private function getNotificationSummary(User $user): array
    {
        return Cache::remember(
            $this->cacheKey($user->id),
            now()->addSeconds(30),
            function () use ($user): array {
                $types = [
                    get_class($user),
                    User::class,
                    Seller::class,
                    Buyer::class,
                    Lawyer::class,
                ];

                $items = \DB::table('notifications')
                    ->whereIn('notifiable_type', $types)
                    ->where('notifiable_id', $user->id)
                    ->latest()
                    ->take(15)
                    ->get()
                    ->map(static function ($notification) {
                        $data = json_decode($notification->data, true);

                        return [
                            'id' => $notification->id,
                            'title' => $data['title'] ?? '',
                            'body' => $data['body'] ?? '',
                            'url' => $data['url'] ?? null,
                            'read_at' => $notification->read_at,
                            'created_at' => $notification->created_at,
                        ];
                    })
                    ->values()
                    ->all();

                $unreadCount = \DB::table('notifications')
                    ->whereIn('notifiable_type', $types)
                    ->where('notifiable_id', $user->id)
                    ->whereNull('read_at')
                    ->count();

                return [
                    'unread_count' => $unreadCount,
                    'items' => $items,
                ];
            }
        );
    }

    private function forgetNotificationCache(int $userId): void
    {
        Cache::forget($this->cacheKey($userId));
    }

    private function cacheKey(int $userId): string
    {
        return "notifications.summary.{$userId}";
    }
}
