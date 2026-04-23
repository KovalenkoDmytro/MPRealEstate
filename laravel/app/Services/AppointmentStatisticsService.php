<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Appointment;
use App\Models\User;

class AppointmentStatisticsService
{
    public function getSellerStatistics(int $sellerId): array
    {
        // Define time windows
        $thirtyDaysAgo = now()->subDays(30)->startOfDay();
        $sevenDaysAgo = now()->subDays(6)->startOfDay(); // Today + past 6 days

        // --- 1. Summary Stats (Single Query Optimization) ---
        // We query the widest range (30 days) to get the Total.
        // We use "SUM(CASE...)" to filter specific counts for the 7-day Breakdown.
        $stats = Appointment::query()
            ->where('seller_id', $sellerId)
            ->where('scheduled_at', '>=', $thirtyDaysAgo)
            ->selectRaw(
                '
            status,
            count(*) as count_30,
            sum(case when scheduled_at >= ? then 1 else 0 end) as count_7
        ',
                [$sevenDaysAgo]
            )
            ->groupBy('status')
            ->get();

        // Initialize Breakdown for 7 Days
        $breakdown7Days = [
            'pending' => 0,
            'completed' => 0,
            'cancelled' => 0,
        ];

        $totalLast30Days = 0;

        foreach ($stats as $row) {
            $count30 = (int) $row->count_30;
            $count7 = (int) $row->count_7;

            // Requirement 1: Total Last 30 Days (Sum of all statuses over 30 days)
            $totalLast30Days += $count30;

            // Requirement 2: Breakdown for Last 7 Days ONLY
            switch ($row->status) {
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
        $dailyRecords = Appointment::query()
            ->where('seller_id', $sellerId)
            ->where('scheduled_at', '>=', $sevenDaysAgo)
            ->selectRaw('DATE(scheduled_at) as date, count(*) as total')
            ->groupBy('date')
            ->pluck('total', 'date');

        $dailyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dailyTrend[] = [
                'date' => $date,
                'total' => $dailyRecords[$date] ?? 0,
            ];
        }

        return [
            'summary' => [
                'total_last_30_days' => $totalLast30Days, // 30 Day Total
                'total_last_7_days' => $totalLast7Days,  // 7 Day Total
                'breakdown' => $breakdown7Days,   // 7 Day Breakdown
            ],
            'chart_data' => [
                'last_7_days' => $dailyTrend,
            ],
        ];
    }

    public function getBuyerStatistics(User $user): array
    {
        $now = now();

        $upcomingQuery = Appointment::query()
            ->where('buyer_id', $user->getKey())
            ->where('scheduled_at', '>', $now)
            ->whereIn('status', ['pending', 'accepted']);

        $nearestAppointment = (clone $upcomingQuery)
            ->where('status', 'accepted')
            ->orderBy('scheduled_at', 'asc')
            ->first();

        $nextAppointmentDate = $nearestAppointment
            ? $nearestAppointment->scheduled_at->format('Y-m-d h:i:A')
            : null;

        $acceptedCount = (clone $upcomingQuery)->where('status', 'accepted')->count();
        $pendingCount = (clone $upcomingQuery)->where('status', 'pending')->count();

        return [
            'pendingCount' => $pendingCount,
            'acceptedCount' => $acceptedCount,
            'nextAppointmentDate' => $nextAppointmentDate,
        ];
    }
}
