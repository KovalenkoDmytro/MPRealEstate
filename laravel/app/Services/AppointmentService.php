<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\RealEstateListing;
use App\Notifications\Appointments\AppointmentAcceptedNotification;
use App\Notifications\Appointments\AppointmentCancelledByBuyerNotification;
use App\Notifications\Appointments\AppointmentRejectedNotification;
use App\Notifications\Appointments\AppointmentRequestNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AppointmentService
{
    /**
     * Buyer creates an appointment
     */
    public function create(array $data): Appointment
    {
        $listing = RealEstateListing::findOrFail($data['listing_id']);
        $seller  = $listing->seller;

        $appointment = Appointment::create([
            'buyer_id'               => Auth::id(),
            'seller_id'              => $seller->id,
            'real_estate_listing_id' => $listing->id,
            'scheduled_at'           => Carbon::parse($data['scheduled_at']),
            'status'                 => 'pending',
        ]);

        // Notify seller
        $seller->notify(new AppointmentRequestNotification($appointment));

        return $appointment;
    }

    /**
     * Seller approves appointment
     */
    public function approve(Appointment $appointment, string|null $accessCode): void
    {
        $appointment->update([
            'status'       => 'accepted',
            'access_code' => $accessCode,
        ]);

        $appointment->buyer->notify(new AppointmentAcceptedNotification($appointment));
    }

    /**
     * Seller rejects appointment
     */
    public function reject(Appointment $appointment, string $reason): void
    {

        $appointment->update([
            'status'            => 'rejected',
            'rejection_reason'  => $reason,
        ]);

        $appointment->buyer->notify(new AppointmentRejectedNotification($appointment));
    }

    public function buyerCancel(Appointment $appointment): void
    {

        // Make sure buyer owns this appointment
        if (auth()->id() !== $appointment->buyer_id) {
            abort(403, __('global.errors.unauthorized'));
        }

        // Prevent canceling already finished appointments
        if (in_array($appointment->status, ['rejected', 'cancelled by buyer'])) {
            return;
        }

        $appointment->update([
            'buyer_cancelled_at' => now(),
            'status'             => 'cancelled by buyer',
        ]);

        // Load seller relation
        $appointment->load('seller');

        // Notify seller
        $appointment->seller->notify(
            new AppointmentCancelledByBuyerNotification($appointment)
        );
    }

    /**
     * Get Appointment Statistics specifically for a Seller.
     * * @param int $sellerId The user ID of the seller
     * @return array
     */
    // App\Services\AppointmentService.php

    public function getSellerStatistics(int $sellerId): array
    {
        $thirtyDaysAgo = now()->subDays(30)->startOfDay();
        $sevenDaysAgo  = now()->subDays(6)->startOfDay();

        // --- 1. Summary (Cards) ---
        $statusCounts = Appointment::where('seller_id', $sellerId)
            ->where('scheduled_at', '>=', $thirtyDaysAgo)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        // Create the breakdown with specific UI keys
        $breakdown = [
            'pending'   => $statusCounts['pending'] ?? 0,
            'completed' => $statusCounts['accepted'] ?? 0,
            'cancelled' => ($statusCounts['rejected'] ?? 0) + ($statusCounts['cancelled by buyer'] ?? 0),
        ];

        // Calculate the Total based on the breakdown
        $totalLast30Days = array_sum($breakdown);

        // --- 2. Daily Chart Data (Total Only) ---
        $dailyRecords = Appointment::where('seller_id', $sellerId)
            ->where('scheduled_at', '>=', $sevenDaysAgo)
            ->selectRaw('DATE(scheduled_at) as date, count(*) as total')
            ->groupBy('date')
            ->pluck('total', 'date');

        $dailyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dailyTrend[] = [
                'date'  => $date,
                'total' => $dailyRecords[$date] ?? 0,
            ];
        }

        return [
            'summary' => [
                'total_last_30_days' => $totalLast30Days, // <--- Added back
                'breakdown'          => $breakdown
            ],
            'chart_data' => [
                'last_7_days' => $dailyTrend
            ]
        ];
    }
}
