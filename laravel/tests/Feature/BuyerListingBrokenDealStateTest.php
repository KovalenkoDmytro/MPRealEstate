<?php

use App\Models\Appointment;
use App\Models\Deal;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use App\Services\BuyerService;

function createListingUser(string $role, string $email, string $phoneNumber): User
{
    return User::factory()->create([
        'email' => $email,
        'phone_number' => $phoneNumber,
        'role' => $role,
    ]);
}

test('buyer listing data hides stale accepted offer and pending appointment after broken deal', function () {
    $seller = createListingUser('seller', 'seller@example.com', '4035551101');
    $buyer = createListingUser('buyer', 'buyer@example.com', '4035551102');

    $listing = RealEstateListing::factory()->create([
        'seller_id' => $seller->id,
        'property_taxes' => 1200,
        'status' => 'available',
    ]);

    $beforeBreak = now()->subDay();
    $brokenAt = now()->subHour();

    Offer::factory()->create([
        'real_estate_listing_id' => $listing->id,
        'buyer_id' => $buyer->id,
        'status' => 'accepted',
        'created_at' => $beforeBreak,
        'updated_at' => $beforeBreak,
    ]);

    $staleAppointment = Appointment::query()->create([
        'buyer_id' => $buyer->id,
        'seller_id' => $seller->id,
        'real_estate_listing_id' => $listing->id,
        'scheduled_at' => now()->addDay(),
        'status' => 'pending',
    ]);
    $staleAppointment->forceFill([
        'created_at' => $beforeBreak,
        'updated_at' => $beforeBreak,
    ])->saveQuietly();

    Deal::factory()->create([
        'real_estate_listing_id' => $listing->id,
        'is_broken' => true,
        'broken_at' => $brokenAt,
    ]);

    ['listing' => $resolvedListing, 'userOffer' => $userOffer] = app(BuyerService::class)
        ->getListingWithUserOffer($listing->id, $buyer);

    expect($userOffer)->toBeNull()
        ->and($resolvedListing->appointments)->toHaveCount(0);
});

test('buyer listing data keeps only post-break offer and appointment state', function () {
    $seller = createListingUser('seller', 'seller2@example.com', '4035551201');
    $buyer = createListingUser('buyer', 'buyer2@example.com', '4035551202');
    $otherBuyer = createListingUser('buyer', 'buyer3@example.com', '4035551203');

    $listing = RealEstateListing::factory()->create([
        'seller_id' => $seller->id,
        'property_taxes' => 1200,
        'status' => 'available',
    ]);

    $beforeBreak = now()->subDays(2);
    $brokenAt = now()->subDay();
    $afterBreak = now()->subHours(12);

    Offer::factory()->create([
        'real_estate_listing_id' => $listing->id,
        'buyer_id' => $buyer->id,
        'status' => 'accepted',
        'created_at' => $beforeBreak,
        'updated_at' => $beforeBreak,
    ]);

    $freshOffer = Offer::factory()->create([
        'real_estate_listing_id' => $listing->id,
        'buyer_id' => $buyer->id,
        'status' => 'pending',
        'created_at' => $afterBreak,
        'updated_at' => $afterBreak,
    ]);

    $staleAppointment = Appointment::query()->create([
        'buyer_id' => $buyer->id,
        'seller_id' => $seller->id,
        'real_estate_listing_id' => $listing->id,
        'scheduled_at' => now()->addDay(),
        'status' => 'pending',
    ]);
    $staleAppointment->forceFill([
        'created_at' => $beforeBreak,
        'updated_at' => $beforeBreak,
    ])->saveQuietly();

    $freshAppointment = Appointment::query()->create([
        'buyer_id' => $buyer->id,
        'seller_id' => $seller->id,
        'real_estate_listing_id' => $listing->id,
        'scheduled_at' => now()->addDays(2),
        'status' => 'pending',
    ]);
    $freshAppointment->forceFill([
        'created_at' => $afterBreak,
        'updated_at' => $afterBreak,
    ])->saveQuietly();

    $otherBuyerAppointment = Appointment::query()->create([
        'buyer_id' => $otherBuyer->id,
        'seller_id' => $seller->id,
        'real_estate_listing_id' => $listing->id,
        'scheduled_at' => now()->addDays(3),
        'status' => 'pending',
    ]);
    $otherBuyerAppointment->forceFill([
        'created_at' => now(),
        'updated_at' => now(),
    ])->saveQuietly();

    Deal::factory()->create([
        'real_estate_listing_id' => $listing->id,
        'is_broken' => true,
        'broken_at' => $brokenAt,
    ]);

    ['listing' => $resolvedListing, 'userOffer' => $userOffer] = app(BuyerService::class)
        ->getListingWithUserOffer($listing->id, $buyer);

    expect($userOffer?->id)->toBe($freshOffer->id)
        ->and($resolvedListing->appointments)->toHaveCount(1)
        ->and($resolvedListing->appointments->first()?->id)->toBe($freshAppointment->id);
});
