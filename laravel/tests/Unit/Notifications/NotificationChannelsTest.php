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

/**
 * Verify that each notification routes delivery through the correct channels
 * as declared in its via() method.
 *
 * These are unit-level checks: we instantiate the notification with a minimal
 * stub notifiable and call via() directly — no DB, no queue, no mail sending.
 */
describe('Notification channels (via)', function (): void {

    // Minimal notifiable stub — just enough for via() to be called
    beforeEach(function (): void {
        $this->notifiable = new class {
            public string $email = 'test@example.com';
        };
    });

    afterEach(function (): void {
        Mockery::close();
    });

    // --- Deal-based notifications (mail + database) ---

    it('ConditionDayConfirmed sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new ConditionDayConfirmed($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('ConditionDaySet sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new ConditionDaySet($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('DealBreakRequested sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new DealBreakRequested($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('DealBreakRequestedApproved sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new DealBreakRequestedApproved($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('DealBreakRequestedRejected sends via mail only', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new DealBreakRequestedRejected($deal);

        expect($notification->via($this->notifiable))->toBe(['mail']);
    });

    it('DepositConfirmed sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new DepositConfirmed($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('DepositMarkedAsMade sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new DepositMarkedAsMade($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('LawyerInvitedToDeal sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new LawyerInvitedToDeal($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('PossessionDayConfirmed sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new PossessionDayConfirmed($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('PossessionDaySet sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new PossessionDaySet($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('SecurityDepositSet sends via mail and database', function (): void {
        $deal = Mockery::mock(Deal::class);
        $notification = new SecurityDepositSet($deal);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    // --- Listing/Offer-based notifications (mail + database) ---

    it('OfferSubmitted sends via mail and database', function (): void {
        $listing = Mockery::mock(RealEstateListing::class);
        $buyer = Mockery::mock(User::class);
        $offer = Mockery::mock(Offer::class);
        $notification = new OfferSubmitted($listing, $buyer, $offer);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('OfferConfirmation sends via mail and database', function (): void {
        $listing = Mockery::mock(RealEstateListing::class);
        $offer = Mockery::mock(Offer::class);
        $notification = new OfferConfirmation($listing, $offer);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('OfferStatusUpdated sends via mail and database', function (): void {
        $listing = Mockery::mock(RealEstateListing::class);
        $notification = new OfferStatusUpdated($listing, 'accepted');

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    // --- Appointment notifications (mail + database) ---

    it('AppointmentRequestNotification sends via mail and database', function (): void {
        $appointment = Mockery::mock(Appointment::class);
        $notification = new AppointmentRequestNotification($appointment);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('AppointmentAcceptedNotification sends via mail and database', function (): void {
        $appointment = Mockery::mock(Appointment::class);
        $notification = new AppointmentAcceptedNotification($appointment);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('AppointmentRejectedNotification sends via mail and database', function (): void {
        $appointment = Mockery::mock(Appointment::class);
        $notification = new AppointmentRejectedNotification($appointment);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

    it('AppointmentCancelledByBuyerNotification sends via mail and database', function (): void {
        $appointment = Mockery::mock(Appointment::class);
        $notification = new AppointmentCancelledByBuyerNotification($appointment);

        expect($notification->via($this->notifiable))->toBe(['mail', 'database']);
    });

});
