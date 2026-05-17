<?php

declare(strict_types=1);

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

class AppointmentService
{
    /**
     * Buyer creates an appointment
     */
    public function create(array $data, User $user): Appointment
    {
        $listing = RealEstateListing::findOrFail($data['listing_id']);
        $seller = $listing->seller;

        $appointment = Appointment::create([
            'buyer_id'               => $user->getKey(),
            'seller_id'              => $seller->getKey(),
            'real_estate_listing_id' => $listing->getKey(),
            'scheduled_at'           => Carbon::parse($data['scheduled_at']),
            'status'                 => 'pending',
        ]);

        $seller->notify(new AppointmentRequestNotification($appointment));

        return $appointment;
    }

    /**
     * Seller approves appointment
     */
    public function approve(Appointment $appointment, ?string $accessCode): void
    {
        $appointment->update([
            'status'      => 'accepted',
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
            'status'           => 'rejected',
            'rejection_reason' => $reason,
        ]);

        $appointment->buyer->notify(new AppointmentRejectedNotification($appointment));
    }

    public function buyerCancel(Appointment $appointment, User $user): void
    {
        if ($user->getKey() !== $appointment->buyer_id) {
            abort(403, __('global.errors.unauthorized'));
        }

        if (in_array($appointment->status, ['rejected', 'cancelled by buyer'])) {
            return;
        }

        $appointment->update([
            'buyer_cancelled_at' => now(),
            'status'             => 'cancelled by buyer',
        ]);

        $appointment->load('seller');

        $appointment->seller->notify(
            new AppointmentCancelledByBuyerNotification($appointment)
        );
    }

    /**
     * Get appointments scheduled specifically for today.
     */
    public function getTodayAppointments(User $user): Collection
    {
        return Appointment::query()
            ->forUser($user)
            ->whereDate('scheduled_at', Carbon::today())
            ->whereNotIn('status', ['rejected', 'cancelled by buyer'])
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Get appointments for the past 7 days (excluding today).
     */
    public function getPastAppointments(User $user, int $days = 7): Collection
    {
        return Appointment::query()
            ->forUser($user)
            ->whereBetween('scheduled_at', [
                Carbon::today()->subDays($days)->startOfDay(),
                Carbon::yesterday()->endOfDay(),
            ])
            ->orderBy('scheduled_at', 'desc')
            ->get();
    }

    /**
     * Get appointments for the upcoming 7 days (excluding today).
     */
    public function getUpcomingAppointments(User $user, int $days = 7): Collection
    {
        return Appointment::query()
            ->forUser($user)
            ->whereBetween('scheduled_at', [
                Carbon::tomorrow()->startOfDay(),
                Carbon::today()->addDays($days)->endOfDay(),
            ])
            ->whereNotIn('status', ['rejected', 'cancelled by buyer'])
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Get all pending appointments.
     */
    public function getPendingAppointments(User $user): Collection
    {
        return Appointment::query()
            ->forUser($user)
            ->where('status', 'pending')
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Get all accepted appointments.
     */
    public function getAcceptedAppointments(User $user): Collection
    {
        return Appointment::query()
            ->with([
                'listing:id,title,unit_number,street_number,street_name,city'
            ])
            ->forUser($user)
            ->where('status', 'accepted')
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Get all rejected appointments (buyers only).
     */
    public function getRejectedAppointments(User $user): Collection
    {
        return Appointment::query()
            ->forUser($user)
            ->where('status', 'rejected')
            ->orderBy('scheduled_at', 'desc')
            ->get();
    }

    /**
     * Get all appointments for the user regardless of status or date.
     */
    public function getAllAppointments(User $user): Collection
    {
        $with = match ($user->role) {
            'seller' => ['buyer', 'listing.mainImage'],
            'buyer'  => ['seller', 'listing.mainImage'],
            default  => [],
        };

        return Appointment::query()
            ->forUser($user)
            ->with($with)
            ->orderBy('scheduled_at', 'desc')
            ->get();
    }

    /**
     * Get canceled by buyers appointments.
     */
    public function getCanceledAppointments(User $user): Collection
    {
        $query = Appointment::query()->forUser($user);

        if ($user->role === 'buyer') {
            $query->with(['seller', 'listing']);
        }

        return $query
            ->where('status', 'cancelled by buyer')
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }
}
