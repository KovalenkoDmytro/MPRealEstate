<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use function Pest\Laravel\actingAs;


uses(RefreshDatabase::class);

beforeEach(function () {
    Artisan::call('db:seed', ['--class' => RoleSeeder::class]);
});

test('seller user can add a listing', function () {
    $seller = User::factory()->seller()->create();

    $response = $this->actingAs($seller)->post(route('seller.listings.store'), []);

    $response->assertStatus(201); // or adjust based on your controller
});

test('buyer user can not add a listing', function () {
    $buyer = User::factory()->buyer()->create();

    $response = $this->actingAs($buyer)->post(route('seller.listings.store'), []);

    $response->assertForbidden(); // or assertStatus(403)
});
