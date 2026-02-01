<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\RealEstateListing;
use App\Models\User;
use App\Notifications\Appointments\AppointmentAcceptedNotification;
use App\Notifications\Appointments\AppointmentCancelledByBuyerNotification;
use App\Notifications\Appointments\AppointmentRejectedNotification;
use App\Notifications\Appointments\AppointmentRequestNotification;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AppointmentService {

    /**
     * Buyer creates an appointment
     */
    public function create(array $data): Appointment {
        $listing = RealEstateListing::findOrFail($data['listing_id']);
        $seller = $listing->seller;

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
    public function approve(Appointment $appointment, string|null $accessCode): void {
        $appointment->update([
            'status'      => 'accepted',
            'access_code' => $accessCode,
        ]);

        $appointment->buyer->notify(new AppointmentAcceptedNotification($appointment));
    }

    /**
     * Seller rejects appointment
     */
    public function reject(Appointment $appointment, string $reason): void {
        $appointment->update([
            'status'           => 'rejected',
            'rejection_reason' => $reason,
        ]);

        $appointment->buyer->notify(new AppointmentRejectedNotification($appointment));
    }

    public function buyerCancel(Appointment $appointment): void {
        // Make sure buyer owns this appointment
        if ( auth()->id() !== $appointment->buyer_id ) {
            abort(403, __('global.errors.unauthorized'));
        }

        // Prevent canceling already finished appointments
        if ( in_array($appointment->status, ['rejected', 'cancelled by buyer']) ) {
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

    public function getSellerStatistics(int $sellerId): array {
        // Define time windows
        $thirtyDaysAgo = now()->subDays(30)->startOfDay();
        $sevenDaysAgo = now()->subDays(6)->startOfDay(); // Today + past 6 days

        // --- 1. Summary Stats (Single Query Optimization) ---
        // We query the widest range (30 days) to get the Total.
        // We use "SUM(CASE...)" to filter specific counts for the 7-day Breakdown.
        $stats = Appointment::where('seller_id', $sellerId)
            ->where('scheduled_at', '>=', $thirtyDaysAgo)
            ->selectRaw(
                "
            status,
            count(*) as count_30,
            sum(case when scheduled_at >= ? then 1 else 0 end) as count_7
        ",
                [$sevenDaysAgo]
            )
            ->groupBy('status')
            ->get();

        // Initialize Breakdown for 7 Days
        $breakdown7Days = [
            'pending'   => 0,
            'completed' => 0,
            'cancelled' => 0,
        ];

        $totalLast30Days = 0;

        foreach ( $stats as $row ) {
            $count30 = (int) $row->count_30;
            $count7 = (int) $row->count_7;

            // Requirement 1: Total Last 30 Days (Sum of all statuses over 30 days)
            $totalLast30Days += $count30;

            // Requirement 2: Breakdown for Last 7 Days ONLY
            switch ( $row->status ) {
                case 'pending':
                    $breakdown7Days['pending'] += $count7;
                    break;
                case 'accepted':
                    $breakdown7Days['completed'] += $count7;
                    break;
                case 'rejected':
                case 'cancelled by buyer':
                    $breakdown7Days['cancelled'] += $count7;
                    break;
            }
        }

        // Calculate Total for 7 Days (useful for UI percentages if needed)
        $totalLast7Days = array_sum($breakdown7Days);

        // --- 2. Daily Chart Data (Last 7 Days) ---
        $dailyRecords = Appointment::where('seller_id', $sellerId)
            ->where('scheduled_at', '>=', $sevenDaysAgo)
            ->selectRaw('DATE(scheduled_at) as date, count(*) as total')
            ->groupBy('date')
            ->pluck('total', 'date');

        $dailyTrend = [];
        for ( $i = 6; $i >= 0; $i-- ) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dailyTrend[] = [
                'date'  => $date,
                'total' => $dailyRecords[$date] ?? 0,
            ];
        }

        return [
            'summary'    => [
                'total_last_30_days' => $totalLast30Days, // 30 Day Total
                'total_last_7_days'  => $totalLast7Days,  // 7 Day Total
                'breakdown'          => $breakdown7Days,   // 7 Day Breakdown
            ],
            'chart_data' => [
                'last_7_days' => $dailyTrend,
            ],
        ];
    }

    public function getBayerStatistics(User $user): array {
        $now = now();

        $upcomingQuery = Appointment::where('buyer_id', $user->id)
            ->where('scheduled_at', '>', $now)
            ->whereIn('status', ['pending', 'accepted']);

        $nearestAppointment = $upcomingQuery
            ->where('status', 'accepted')
            ->orderBy('scheduled_at', 'asc')
            ->first();

        $nextAppointmentDate = $nearestAppointment
            ? $nearestAppointment->scheduled_at->format('Y-m-d h:i:A')
            : NULL;

        $acceptedCount = $upcomingQuery->where('status', 'accepted')->count();
        $pendingCount = $upcomingQuery->where('status', 'pending')->count();

        return [
            'pendingCount'        => $pendingCount,
            'acceptedCount'       => $acceptedCount,
            'nextAppointmentDate' => $nextAppointmentDate,
        ];
    }


    /**
     * Get appointments scheduled specifically for today.
     */
    public function getTodayAppointments(): Collection
    {
        $user = Auth::user();
        $query = Appointment::query();

        // Filter by Role
        if ($user->role === 'seller') {
            $query->where('seller_id', $user->id);
        } elseif ($user->role === 'buyer') {
            $query->where('buyer_id', $user->id);
        } else {
            return new Collection();
        }

        // Use whereDate to match any time on "Today"
        return $query->whereDate('scheduled_at', Carbon::today())
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Get appointments for the past 7 days (excluding today).
     */
    public function getPastAppointments($days = 7): Collection
    {
        $user = Auth::user();

        // Start: 7 days ago at 00:00:00
        $startDate = Carbon::today()->subDays($days)->startOfDay();

        // End: Yesterday at 23:59:59
        $endDate = Carbon::yesterday()->endOfDay();

        $query = Appointment::query();

        // Filter by Role
        if ($user->role === 'seller') {
            $query->where('seller_id', $user->id);
        } elseif ($user->role === 'buyer') {
            $query->where('buyer_id', $user->id);
        } else {
            return new Collection();
        }

        // Apply Date Range and Sort (Most recent past first)
        return $query->whereBetween('scheduled_at', [$startDate, $endDate])
            ->orderBy('scheduled_at', 'desc')
            ->get();
    }

    /**
     * Get appointments for the upcoming 7 days (excluding today).
     */
    public function getUpcomingAppointments($days = 7): Collection
    {
        $user = Auth::user();

        // Start: Tomorrow at 00:00:00
        $startDate = Carbon::tomorrow()->startOfDay();

        // End: 7 days from now at 23:59:59
        $endDate = Carbon::today()->addDays($days)->endOfDay();

        $query = Appointment::query();

        // Filter by Role
        if ($user->role === 'seller') {
            $query->where('seller_id', $user->id);
        } elseif ($user->role === 'buyer') {
            $query->where('buyer_id', $user->id);
        } else {
            return new Collection();
        }

        // Apply Date Range and Sort (Soonest upcoming first)
        return $query->whereBetween('scheduled_at', [$startDate, $endDate])
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Get all pending appointments.
     */
    public function getPendingAppointments(): Collection
    {
        $user = Auth::user();
        $query = Appointment::query();

        if ($user->role === 'seller') {
            $query->where('seller_id', $user->id);
        } elseif ($user->role === 'buyer') {
            $query->where('buyer_id', $user->id);
        } else {
            return new Collection();
        }

        return $query->where('status', 'pending')
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Get all accepted appointments.
     */
    public function getAcceptedAppointments(): Collection
    {
        $user = Auth::user();
        $query = Appointment::query();

        if ($user->role === 'seller') {
            $query->where('seller_id', $user->id);
        } elseif ($user->role === 'buyer') {
            $query->where('buyer_id', $user->id);
        } else {
            return new Collection();
        }

        return $query->where('status', 'accepted')
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Get all rejected appointments.
     */
    public function getRejectedAppointments(): Collection
    {
        $user = Auth::user();

        // This is only available for buyers
        if ($user->role !== 'buyer') {
            return new Collection();
        }

        return Appointment::query()
            ->where('buyer_id', $user->id)
            ->where('status', 'rejected')
            ->orderBy('scheduled_at', 'desc')
            ->get();
    }


    /**
     * Get all appointments for the user regardless of status or date.
     */
    public function getAllAppointments(): Collection
    {
        $user = Auth::user();
        $query = Appointment::query();

        if ($user->role === 'seller') {
            $query->where('seller_id', $user->id)
                ->with(['buyer', 'listing.mainImage']);
        } elseif ($user->role === 'buyer') {
            $query->where('buyer_id', $user->id)
                ->with(['seller', 'listing.mainImage']);
        } else {
            return new Collection();
        }

        return $query->orderBy('scheduled_at', 'desc')->get();
    }

    /**
     * Get canceled by buyers appointments.
     */
    public function getCanceledAppointments(): Collection
    {
        $user = Auth::user();
        $query = Appointment::query();

        if ($user->role === 'seller') {
            $query->where('seller_id', $user->id);
        } elseif ($user->role === 'buyer') {
            $query->where('buyer_id', $user->id)
                ->with(['seller', 'listing']);
        } else {
            return new Collection();
        }

        return $query->where('status', 'cancelled by buyer')
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }


}
