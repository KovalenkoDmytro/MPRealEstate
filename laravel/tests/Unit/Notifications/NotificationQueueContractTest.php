<?php

declare(strict_types=1);

use App\Models\Appointment;
use App\Models\Deal;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
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
 * and target the `notifications` queue for async delivery.
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

    $notificationFactories = [
        ConditionDayConfirmed::class => fn () => new ConditionDayConfirmed(\Mockery::mock(Deal::class)),
        ConditionDaySet::class => fn () => new ConditionDaySet(\Mockery::mock(Deal::class)),
        DealBreakRequested::class => fn () => new DealBreakRequested(\Mockery::mock(Deal::class)),
        DealBreakRequestedApproved::class => fn () => new DealBreakRequestedApproved(\Mockery::mock(Deal::class)),
        DealBreakRequestedRejected::class => fn () => new DealBreakRequestedRejected(\Mockery::mock(Deal::class)),
        DepositConfirmed::class => fn () => new DepositConfirmed(\Mockery::mock(Deal::class)),
        DepositMarkedAsMade::class => fn () => new DepositMarkedAsMade(\Mockery::mock(Deal::class)),
        LawyerInvitedToDeal::class => fn () => new LawyerInvitedToDeal(\Mockery::mock(Deal::class)),
        OfferConfirmation::class => fn () => new OfferConfirmation(
            \Mockery::mock(RealEstateListing::class),
            \Mockery::mock(Offer::class),
        ),
        OfferStatusUpdated::class => fn () => new OfferStatusUpdated(
            \Mockery::mock(RealEstateListing::class),
            'accepted',
        ),
        OfferSubmitted::class => fn () => new OfferSubmitted(
            \Mockery::mock(RealEstateListing::class),
            \Mockery::mock(User::class),
            \Mockery::mock(Offer::class),
        ),
        PossessionDayConfirmed::class => fn () => new PossessionDayConfirmed(\Mockery::mock(Deal::class)),
        PossessionDaySet::class => fn () => new PossessionDaySet(\Mockery::mock(Deal::class)),
        SecurityDepositSet::class => fn () => new SecurityDepositSet(\Mockery::mock(Deal::class)),
        AppointmentAcceptedNotification::class => fn () => new AppointmentAcceptedNotification(\Mockery::mock(Appointment::class)),
        AppointmentCancelledByBuyerNotification::class => fn () => new AppointmentCancelledByBuyerNotification(\Mockery::mock(Appointment::class)),
        AppointmentRejectedNotification::class => fn () => new AppointmentRejectedNotification(\Mockery::mock(Appointment::class)),
        AppointmentRequestNotification::class => fn () => new AppointmentRequestNotification(\Mockery::mock(Appointment::class)),
    ];

    afterEach(function (): void {
        \Mockery::close();
    });

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

    it('all notifications target the notifications queue', function () use ($notificationFactories): void {
        foreach ($notificationFactories as $class => $factory) {
            $notification = $factory();

            expect($notification->queue ?? null)
                ->toBe('notifications', "Expected {$class} to target the 'notifications' queue");
        }
    });
});
