<?php

use App\Models\User;
use App\Models\RealEstateListing;
use App\Filters\ListingFilter;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('filters by min price', static function () {
    RealEstateListing::factory()->create(['price' => 100000]);
    RealEstateListing::factory()->create(['price' => 500000]);

    $query = RealEstateListing::query();
    $filtered = ListingFilter::apply($query, ['min_price' => 200000])->get();

    expect($filtered)->toHaveCount(1)
        ->and($filtered->first()->price)->toBe(500000);
});

it('filters by has_garage boolean', static function () {
    RealEstateListing::factory()->create(['has_garage' => true]);
    RealEstateListing::factory()->create(['has_garage' => false]);

    $query = RealEstateListing::query();
    $filtered = ListingFilter::apply($query, ['has_garage' => 'true'])->get();

    expect($filtered)->toHaveCount(1)
        ->and($filtered->first()->has_garage)->toBeTrue();
});

it('filters by keyword in title or description', static function () {
    RealEstateListing::factory()->create(['title' => 'Oceanfront villa', 'description' => '']);
    RealEstateListing::factory()->create(['title' => 'Cottage', 'description' => 'Hidden near the ocean']);
    RealEstateListing::factory()->create(['title' => 'Mountain cabin']);

    $query = RealEstateListing::query();
    $filtered = ListingFilter::apply($query, ['keywords' => 'ocean'])->get();

    expect($filtered)->toHaveCount(2);
});

it('filters by favorites_only for the user', static function () {
    $user = User::factory()->create();

    $favListing = RealEstateListing::factory()->create();
    $otherListing = RealEstateListing::factory()->create();

    $user->favoriteListings()->attach($favListing->id);

    $query = RealEstateListing::query();

    $filtered = ListingFilter::apply($query, ['favorites_only' => true], $user)->get();

    expect($filtered)->toHaveCount(1)
        ->and($filtered->first()->id)->toBe($favListing->id);
});
