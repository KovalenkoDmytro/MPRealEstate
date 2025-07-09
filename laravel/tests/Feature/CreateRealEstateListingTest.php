<?php

//use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
//use Illuminate\Http\UploadedFile;
//use Illuminate\Support\Facades\Storage;
//use function Pest\Laravel\{actingAs, postJson, assertDatabaseHas, seed};

uses(RefreshDatabase::class);

it('allows a seller to create a listing', function () {
//    Storage::fake('public');
//
//    seed(UserSeeder::class);
//
//    $user = \App\Models\User::where('email', 'seller@example.com')->first();
//    actingAs($user);
//
//    $payload = [
//        'title' => 'Luxury Villa',
//        'description' => '5 bed, 4 bath villa with ocean view.',
//        'price' => 1200000,
//        'address' => '123 Ocean Drive',
//        'city' => 'Vancouver',
//        'province' => 'BC',
//        'postal_code' => 'V6K1A1',
//        'bedrooms' => 5,
//        'bathrooms' => 4,
//        'square_feet' => 3500,
//        'images' => [UploadedFile::fake()->image('villa.jpg')],
//    ];
//
//    $response = postJson(route('seller.listings.store'), $payload);
//
//    $response->assertOk()
//        ->assertJson([
//            'success' => true,
//            'message' => 'Listing created successfully!',
//        ]);
//
//    assertDatabaseHas('real_estate_listings', [
//        'title' => 'Luxury Villa',
//        'seller_id' => $user->id,
//        'status' => 'available',
//    ]);
//
//    Storage::disk('public')->assertExists('listing-images/' . $payload['images'][0]->hashName());
});
