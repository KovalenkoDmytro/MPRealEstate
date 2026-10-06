<?php

use App\Models\Appointment;
use App\Models\Deal;
use App\Models\DealBreakRequest;
use App\Models\ListingImage;
use App\Models\ListingView;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\PresentationScenarioSeeder;
use Database\Seeders\RealEstateListingSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->travelTo(CarbonImmutable::parse('2026-10-05 09:00:00'));
});

afterEach(function () {
    $this->travelBack();
});

test('presentation calendar covers every day for both sellers and buyers through three calendar months', function (string $date) {
    $this->travelTo(CarbonImmutable::parse($date));
    $this->seed(DatabaseSeeder::class);
    $now = CarbonImmutable::now();
    $end = $now->startOfDay()->addMonthsNoOverflow(3);

    foreach (User::query()->whereIn('role', ['seller', 'buyer'])->get() as $user) {
        $appointments = Appointment::query()->forUser($user)
            ->whereBetween('scheduled_at', [$now, $end->endOfDay()])->get();
        $dates = $appointments->map(fn (Appointment $appointment) => $appointment->scheduled_at->toDateString())->unique();

        for ($day = $now->startOfDay(); $day->lte($end); $day = $day->addDay()) {
            expect($dates->contains($day->toDateString()))->toBeTrue();
        }

        expect($appointments->where('status', 'pending')->count())->toBeGreaterThan(0)
            ->and($appointments->where('status', 'accepted')->count())->toBeGreaterThan(0);
    }

    foreach (Appointment::with('listing')->get() as $appointment) {
        expect($appointment->seller_id)->toBe($appointment->listing->seller_id)
            ->and($appointment->created_at->lte($appointment->scheduled_at))->toBeTrue()
            ->and($appointment->updated_at->lte(now()))->toBeTrue();

        if ($appointment->scheduled_at->isFuture()) {
            expect($appointment->listing->status)->toBe('available');
        }

        if ($appointment->status === 'cancelled by buyer') {
            expect($appointment->buyer_cancelled_at->lt($appointment->scheduled_at))->toBeTrue();
        }
    }

    $future = Appointment::query()->where('scheduled_at', '>=', $now)->get();
    expect($future->groupBy(fn ($appointment) => $appointment->buyer_id.'|'.$appointment->scheduled_at)->filter(fn ($slots) => $slots->count() > 1))->toHaveCount(0)
        ->and($future->groupBy(fn ($appointment) => $appointment->seller_id.'|'.$appointment->scheduled_at)->filter(fn ($slots) => $slots->count() > 1))->toHaveCount(0);
})->with(['2026-10-05 09:00:00', '2026-01-31 09:00:00']);

test('presentation transactions preserve real properties and coherent offer and deal history', function () {
    $this->seed([RoleSeeder::class, UserSeeder::class, RealEstateListingSeeder::class]);
    $properties = RealEstateListing::query()->get()->mapWithKeys(fn ($listing) => [
        $listing->id => [$listing->title, $listing->description, $listing->price],
    ]);
    $this->seed(PresentationScenarioSeeder::class);

    foreach (RealEstateListing::all() as $listing) {
        expect([$listing->title, $listing->description, $listing->price])->toBe($properties[$listing->id]);
    }

    foreach (Deal::with(['listing', 'users'])->get() as $deal) {
        $offer = Offer::query()->where('real_estate_listing_id', $deal->real_estate_listing_id)->where('status', 'accepted')->sole();
        expect((float) $deal->amount)->toBe((float) $offer->amount)
            ->and((float) $deal->amount)->toBeGreaterThan((float) $deal->listing->price * 0.95)
            ->and((float) $deal->amount)->toBeLessThanOrEqual((float) $deal->listing->price)
            ->and($offer->created_at->lt($deal->created_at))->toBeTrue()
            ->and($deal->users->contains('id', $deal->listing->seller_id))->toBeTrue()
            ->and($deal->users->contains('id', $offer->buyer_id))->toBeTrue();

        foreach (['security_deposit_set_at', 'security_deposit_made_at', 'security_deposit_confirmed_at', 'condition_day_selected_at', 'condition_day_confirmed_at', 'possession_day_selected_at', 'possession_day_confirmed_at', 'broken_at', 'completed_at'] as $field) {
            if ($deal->$field) {
                expect($deal->$field->gte($deal->created_at))->toBeTrue()
                    ->and($deal->$field->lte(now()))->toBeTrue();
            }
        }

        if ($deal->is_completed) {
            expect($deal->listing->status)->toBe('sold')
                ->and($deal->completed_at->gte($deal->possession_day))->toBeTrue();
        } elseif ($deal->is_broken) {
            expect($deal->listing->status)->toBe('available')
                ->and($offer->created_at->lt($deal->broken_at))->toBeTrue();
        } else {
            expect($deal->listing->status)->toBe('pending');
        }
    }

    expect(DealBreakRequest::query()->where('status', 'pending')->count())->toBe(1)
        ->and(DealBreakRequest::query()->where('status', 'accepted')->count())->toBe(1)
        ->and(Deal::query()->where('possession_day', '>', now())->count())->toBe(2)
        ->and(Deal::query()->max('possession_day'))->toStartWith('2027-01-05');
});

test('running the full seed twice does not duplicate properties or presentation activity', function () {
    $this->seed(DatabaseSeeder::class);
    $counts = collect([User::class, RealEstateListing::class, ListingImage::class, Appointment::class, Offer::class, Deal::class, DealBreakRequest::class, ListingView::class])
        ->mapWithKeys(fn ($model) => [$model => $model::count()]);
    $this->seed(DatabaseSeeder::class);

    foreach ($counts as $model => $count) {
        expect($model::count())->toBe($count);
    }
});

test('presentation seed skips incomplete prerequisites without writing partial scenarios', function () {
    $this->seed(PresentationScenarioSeeder::class);

    expect(Appointment::count())->toBe(0)->and(Deal::count())->toBe(0);
});
