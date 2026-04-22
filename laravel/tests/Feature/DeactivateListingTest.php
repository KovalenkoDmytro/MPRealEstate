<?php

use App\Models\Deal;
use App\Models\RealEstateListing;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Artisan;

beforeEach(function () {
    Artisan::call('db:seed', ['--class' => RoleSeeder::class]);
    $this->withoutMiddleware(ValidateCsrfToken::class);
});

function createSellerUser(): User
{
    $seller = User::factory()->create([
        'phone_number' => '4035550101',
        'role' => 'seller',
    ]);

    $seller->assignRole('seller');

    return $seller;
}

test('seller can deactivate listing when linked deal is broken', function () {
    $seller = createSellerUser();
    $listing = RealEstateListing::factory()->create([
        'seller_id' => $seller->id,
        'property_taxes' => 1200,
    ]);

    Deal::factory()->create([
        'real_estate_listing_id' => $listing->id,
        'is_completed' => false,
        'is_broken' => true,
    ]);

    $response = $this
        ->actingAs($seller)
        ->delete(route('seller.listings.deactivate', $listing));

    $response
        ->assertStatus(200)
        ->assertJsonPath('status', 'success');

    $this->assertSoftDeleted('real_estate_listings', ['id' => $listing->id]);

    expect(RealEstateListing::withTrashed()->find($listing->id)?->status)->toBe('inactive');
});

test('seller cannot deactivate listing when linked deal is active and incomplete', function () {
    $seller = createSellerUser();
    $listing = RealEstateListing::factory()->create([
        'seller_id' => $seller->id,
        'property_taxes' => 1200,
    ]);

    Deal::factory()->create([
        'real_estate_listing_id' => $listing->id,
        'is_completed' => false,
        'is_broken' => false,
    ]);

    $response = $this
        ->actingAs($seller)
        ->delete(route('seller.listings.deactivate', $listing));

    $response
        ->assertStatus(422)
        ->assertJsonPath('status', 'error')
        ->assertJsonPath('message', __('listings.errors.delete_failed'));

    $this->assertDatabaseHas('real_estate_listings', ['id' => $listing->id, 'deleted_at' => null]);
});
