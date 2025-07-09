<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use function Pest\Laravel\actingAs;


uses(RefreshDatabase::class);

beforeEach(function () {
    Artisan::call('db:seed', ['--class' => RoleSeeder::class]);

    Storage::fake('public');

    $this -> payload = [
        'title' => 'Luxury Villa',
        'description' => '5 bed, 4 bath villa with ocean view.',
        'price' => 1200000,
        'address' => '123 Ocean Drive',
        'city' => 'Vancouver',
        'province' => 'BC',
        'postal_code' => 'V6K1A1',
        'bedrooms' => 5,
        'bathrooms' => 4,
        'square_feet' => 3500,
        'location' => '49.2827,-123.1207',
        'images' => [UploadedFile::fake()->image('villa.jpg')],
    ];
});



test('seller user can add a listing', function () {

    $seller = User::factory()->seller()->create();

    $response = $this->actingAs($seller)->post(route('seller.listings.store'), $this -> payload);

    $response->assertStatus(200); // or adjust based on your controller
});

test('buyer user can not add a listing', function () {
    $buyer = User::factory()->buyer()->create();

    $response = $this->actingAs($buyer)->post(route('seller.listings.store'), []);

    $response->assertForbidden(); // or assertStatus(403)
});
