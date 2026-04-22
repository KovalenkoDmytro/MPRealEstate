<?php

use App\Models\Deal;
use App\Models\RealEstateListing;
use App\Models\User;

test('deal still resolves listing relation after listing is soft deleted', function () {
    $seller = User::factory()->create([
        'phone_number' => '4035550199',
    ]);

    $listing = RealEstateListing::factory()->create([
        'seller_id' => $seller->id,
        'property_taxes' => 1200,
    ]);

    $deal = Deal::factory()->create([
        'real_estate_listing_id' => $listing->id,
    ]);

    $listing->delete();

    $reloadedDeal = Deal::query()->with('realEstateListing')->findOrFail($deal->id);

    expect($reloadedDeal->realEstateListing)->not->toBeNull()
        ->and($reloadedDeal->realEstateListing->id)->toBe($listing->id)
        ->and($reloadedDeal->realEstateListing->trashed())->toBeTrue();
});
