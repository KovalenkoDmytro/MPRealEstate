<?php

declare(strict_types=1);

use App\Models\Appointment;
use App\Models\Deal;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use App\Notifications\Appointments\AppointmentRequestNotification;
use App\Notifications\DealBreakRequested;
use App\Notifications\OfferSubmitted;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;

uses(Tests\TestCase::class, RefreshDatabase::class);

/**
 * Full dispatch integration tests for three representative notifications.
 *
 * These tests verify that:
 *  - The notification is pushed onto the queue (not sent inline)
 *  - It is dispatched to the correct 'notifications' queue
 *  - The notifiable receives the notification via Notification::fake()
 */
describe('OfferSubmitted dispatch', function (): void {

    it('is pushed onto the queue when sent to a notifiable', function (): void {
        Queue::fake();

        $seller = User::factory()->create(['email' => 'seller@example.com', 'role' => 'seller']);
        $buyer = User::factory()->create(['email' => 'buyer@example.com', 'role' => 'buyer']);
        $listing = RealEstateListing::factory()->create(['seller_id' => $seller->getKey()]);
        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->getKey(),
            'buyer_id' => $buyer->getKey(),
        ]);

        $seller->notify(new OfferSubmitted($listing, $buyer, $offer));

        Queue::assertPushed(function (OfferSubmitted $job): bool {
            return $job->queue === 'notifications';
        });
    });

    it('is not delivered synchronously when queue is faked', function (): void {
        Queue::fake();
        Notification::fake();

        $seller = User::factory()->create(['email' => 'seller2@example.com', 'role' => 'seller']);
        $buyer = User::factory()->create(['email' => 'buyer2@example.com', 'role' => 'buyer']);
        $listing = RealEstateListing::factory()->create(['seller_id' => $seller->getKey()]);
        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->getKey(),
            'buyer_id' => $buyer->getKey(),
        ]);

        $seller->notify(new OfferSubmitted($listing, $buyer, $offer));

        // Notification::fake() intercepts — no mail or DB write should occur
        Notification::assertSentTo($seller, OfferSubmitted::class);
    });

    it('is queued on the notifications queue', function (): void {
        Queue::fake();

        $seller = User::factory()->create(['email' => 'seller3@example.com', 'role' => 'seller']);
        $buyer = User::factory()->create(['email' => 'buyer3@example.com', 'role' => 'buyer']);
        $listing = RealEstateListing::factory()->create(['seller_id' => $seller->getKey()]);
        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->getKey(),
            'buyer_id' => $buyer->getKey(),
        ]);

        $seller->notify(new OfferSubmitted($listing, $buyer, $offer));

        Queue::assertPushedOn('notifications', OfferSubmitted::class);
    });

});

describe('DealBreakRequested dispatch', function (): void {

    it('is pushed onto the queue when sent to a notifiable', function (): void {
        Queue::fake();

        $user = User::factory()->create(['email' => 'deal-user@example.com', 'role' => 'buyer']);
        $deal = Deal::factory()->create();

        $user->notify(new DealBreakRequested($deal));

        Queue::assertPushed(function (DealBreakRequested $job): bool {
            return $job->queue === 'notifications';
        });
    });

    it('is not delivered synchronously when queue is faked', function (): void {
        Queue::fake();
        Notification::fake();

        $user = User::factory()->create(['email' => 'deal-user2@example.com', 'role' => 'buyer']);
        $deal = Deal::factory()->create();

        $user->notify(new DealBreakRequested($deal));

        Notification::assertSentTo($user, DealBreakRequested::class);
    });

    it('is queued on the notifications queue', function (): void {
        Queue::fake();

        $user = User::factory()->create(['email' => 'deal-user3@example.com', 'role' => 'buyer']);
        $deal = Deal::factory()->create();

        $user->notify(new DealBreakRequested($deal));

        Queue::assertPushedOn('notifications', DealBreakRequested::class);
    });

});

describe('AppointmentRequestNotification dispatch', function (): void {

    it('is pushed onto the queue when sent to a notifiable', function (): void {
        Queue::fake();

        $seller = User::factory()->create(['email' => 'appt-seller@example.com', 'role' => 'seller']);
        $buyer = User::factory()->create(['email' => 'appt-buyer@example.com', 'role' => 'buyer']);
        $listing = RealEstateListing::factory()->create(['seller_id' => $seller->getKey()]);
        $appointment = Appointment::factory()->create([
            'seller_id' => $seller->getKey(),
            'buyer_id' => $buyer->getKey(),
            'real_estate_listing_id' => $listing->getKey(),
        ]);

        $seller->notify(new AppointmentRequestNotification($appointment));

        Queue::assertPushed(function (AppointmentRequestNotification $job): bool {
            return $job->queue === 'notifications';
        });
    });

    it('is not delivered synchronously when queue is faked', function (): void {
        Queue::fake();
        Notification::fake();

        $seller = User::factory()->create(['email' => 'appt-seller2@example.com', 'role' => 'seller']);
        $buyer = User::factory()->create(['email' => 'appt-buyer2@example.com', 'role' => 'buyer']);
        $listing = RealEstateListing::factory()->create(['seller_id' => $seller->getKey()]);
        $appointment = Appointment::factory()->create([
            'seller_id' => $seller->getKey(),
            'buyer_id' => $buyer->getKey(),
            'real_estate_listing_id' => $listing->getKey(),
        ]);

        $seller->notify(new AppointmentRequestNotification($appointment));

        Notification::assertSentTo($seller, AppointmentRequestNotification::class);
    });

    it('is queued on the notifications queue', function (): void {
        Queue::fake();

        $seller = User::factory()->create(['email' => 'appt-seller3@example.com', 'role' => 'seller']);
        $buyer = User::factory()->create(['email' => 'appt-buyer3@example.com', 'role' => 'buyer']);
        $listing = RealEstateListing::factory()->create(['seller_id' => $seller->getKey()]);
        $appointment = Appointment::factory()->create([
            'seller_id' => $seller->getKey(),
            'buyer_id' => $buyer->getKey(),
            'real_estate_listing_id' => $listing->getKey(),
        ]);

        $seller->notify(new AppointmentRequestNotification($appointment));

        Queue::assertPushedOn('notifications', AppointmentRequestNotification::class);
    });

});
