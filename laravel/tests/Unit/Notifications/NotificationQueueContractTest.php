<?php

declare(strict_types=1);

use App\Notifications\Appointments\AppointmentAcceptedNotification;
use App\Notifications\Appointments\AppointmentCancelledByBuyerNotification;
use App\Notifications\Appointments\AppointmentRejectedNotification;
use App\Notifications\Appointments\AppointmentRequestNotification;
use App\Notifications\ConditionDayConfirmed;
use App\Notifications\ConditionDaySet;
use App\Notifications\DealBreakRequested;
use App\Notifications\DealBreakRequestedApproved;
use App\Notifications\DealBreakRequestedRejected;
use App\Notifications\DepositConfirmed;
use App\Notifications\DepositMarkedAsMade;
use App\Notifications\LawyerInvitedToDeal;
use App\Notifications\OfferConfirmation;
use App\Notifications\OfferStatusUpdated;
use App\Notifications\OfferSubmitted;
use App\Notifications\PossessionDayConfirmed;
use App\Notifications\PossessionDaySet;
use App\Notifications\SecurityDepositSet;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * All 18 notification classes must implement ShouldQueue, use Queueable,
 * and declare $queue = 'notifications' for async delivery on the correct queue.
 */
describe('Notification queue contracts', function (): void {

    $notificationClasses = [
        // Root notifications (14)
        ConditionDayConfirmed::class,
        ConditionDaySet::class,
        DealBreakRequested::class,
        DealBreakRequestedApproved::class,
        DealBreakRequestedRejected::class,
        DepositConfirmed::class,
        DepositMarkedAsMade::class,
        LawyerInvitedToDeal::class,
        OfferConfirmation::class,
        OfferStatusUpdated::class,
        OfferSubmitted::class,
        PossessionDayConfirmed::class,
        PossessionDaySet::class,
        SecurityDepositSet::class,
        // Appointment notifications (4)
        AppointmentAcceptedNotification::class,
        AppointmentCancelledByBuyerNotification::class,
        AppointmentRejectedNotification::class,
        AppointmentRequestNotification::class,
    ];

    it('all notifications implement ShouldQueue', function () use ($notificationClasses): void {
        foreach ($notificationClasses as $class) {
            expect(is_a($class, ShouldQueue::class, true))
                ->toBeTrue("Expected {$class} to implement ShouldQueue");
        }
    });

    it('all notifications use the Queueable trait', function () use ($notificationClasses): void {
        foreach ($notificationClasses as $class) {
            $traits = class_uses_recursive($class);

            expect(in_array(\Illuminate\Bus\Queueable::class, $traits, true))
                ->toBeTrue("Expected {$class} to use Queueable trait");
        }
    });

    it('all notifications declare the notifications queue', function () use ($notificationClasses): void {
        foreach ($notificationClasses as $class) {
            $reflection = new ReflectionClass($class);
            $defaults = $reflection->getDefaultProperties();

            expect($reflection->hasProperty('queue'))
                ->toBeTrue("Expected {$class} to have a \$queue property");

            expect($defaults['queue'] ?? null)
                ->toBe('notifications', "Expected {$class}::\$queue to equal 'notifications'");
        }
    });
});
