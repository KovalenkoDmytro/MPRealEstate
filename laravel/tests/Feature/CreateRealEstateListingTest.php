<?php

declare(strict_types=1);

use App\Models\RealEstateListing;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

describe('Create Real Estate Listing', function (): void {
    beforeEach(function (): void {
        Artisan::call('db:seed', ['--class' => RoleSeeder::class]);

        $this->withoutMiddleware(ValidateCsrfToken::class);

        Storage::fake('public');

        $this->jsonHeaders = ['Accept' => 'application/json'];

        $this->payload = [
            'title' => 'Luxury Villa',
            'description' => '5 bed, 4 bath villa with ocean view.',
            'price' => 1_200_000,
            'street_number' => '123',
            'street_name' => 'Ocean Drive',
            'city' => 'Vancouver',
            'province' => 'BC',
            'postal_code' => 'V6K1A1',
            'country' => 'Canada',
            'latitude' => 49.2827,
            'longitude' => -123.1207,
            'property_type' => 'house',
            'bedrooms' => 5,
            'bathrooms' => 4,
            'square_feet' => 3500,
            'year_built' => 2015,
            'property_taxes' => 1200,
            'main_image' => UploadedFile::fake()->image('villa.jpg'),
        ];
    });

    it('allows a seller with valid payload to create a listing', function (): void {
        $seller = User::factory()->create([
            'phone_number' => '4035550101',
            'email' => 'seller@example.com',
            'role' => 'seller',
        ]);
        $seller->assignRole('seller');

        $response = $this
            ->actingAs($seller)
            ->post(route('listings.store'), $this->payload, $this->jsonHeaders);

        $response
            ->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseHas('real_estate_listings', [
            'title' => 'Luxury Villa',
            'city' => 'Vancouver',
            'seller_id' => $seller->getKey(),
            'status' => 'available',
        ]);
    });

    it('persists the listing with the authenticated seller user id', function (): void {
        $seller = User::factory()->create([
            'phone_number' => '4035550102',
            'email' => 'owner@example.com',
            'role' => 'seller',
        ]);
        $seller->assignRole('seller');

        $this
            ->actingAs($seller)
            ->post(route('listings.store'), $this->payload, $this->jsonHeaders)
            ->assertStatus(200);

        $listing = RealEstateListing::query()->where('title', 'Luxury Villa')->firstOrFail();

        expect($listing->seller_id)
            ->toBe($seller->getKey())
            ->and($listing->status)
            ->toBe('available');
    });

    it('saves the listing with status available by default', function (): void {
        $seller = User::factory()->create([
            'phone_number' => '4035550103',
            'email' => 'status-check@example.com',
            'role' => 'seller',
        ]);
        $seller->assignRole('seller');

        $this
            ->actingAs($seller)
            ->post(route('listings.store'), $this->payload, $this->jsonHeaders)
            ->assertStatus(200);

        $this->assertDatabaseHas('real_estate_listings', [
            'title' => 'Luxury Villa',
            'status' => 'available',
        ]);
    });

    it('redirects an unauthenticated guest to the login page', function (): void {
        $response = $this->post(route('listings.store'), $this->payload);

        $response->assertStatus(302);
        $this->assertDatabaseMissing('real_estate_listings', [
            'title' => 'Luxury Villa',
        ]);
    });

    it('forbids a buyer from creating a listing', function (): void {
        $buyer = User::factory()->create([
            'phone_number' => '4035550104',
            'email' => 'buyer@example.com',
            'role' => 'buyer',
        ]);
        $buyer->assignRole('buyer');

        $response = $this
            ->actingAs($buyer)
            ->post(route('listings.store'), $this->payload, $this->jsonHeaders);

        $response->assertForbidden();
        $this->assertDatabaseMissing('real_estate_listings', [
            'title' => 'Luxury Villa',
        ]);
    });

    it('fails validation when required fields are missing', function (): void {
        $seller = User::factory()->create([
            'phone_number' => '4035550105',
            'email' => 'missing-fields@example.com',
            'role' => 'seller',
        ]);
        $seller->assignRole('seller');

        $response = $this
            ->actingAs($seller)
            ->post(route('listings.store'), [], $this->jsonHeaders);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title',
                'description',
                'price',
                'street_number',
                'street_name',
                'city',
                'province',
                'postal_code',
                'country',
                'latitude',
                'longitude',
                'property_type',
                'bedrooms',
                'bathrooms',
                'square_feet',
                'year_built',
                'property_taxes',
                'main_image',
            ]);
    });

    it('fails validation when price is below the 5000 minimum', function (): void {
        $seller = User::factory()->create([
            'phone_number' => '4035550106',
            'email' => 'low-price@example.com',
            'role' => 'seller',
        ]);
        $seller->assignRole('seller');

        $payload = array_merge($this->payload, ['price' => 100]);

        $response = $this
            ->actingAs($seller)
            ->post(route('listings.store'), $payload, $this->jsonHeaders);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['price']);
    });

    it('fails validation when property_type is not an allowed enum value', function (): void {
        $seller = User::factory()->create([
            'phone_number' => '4035550107',
            'email' => 'bad-type@example.com',
            'role' => 'seller',
        ]);
        $seller->assignRole('seller');

        $payload = array_merge($this->payload, ['property_type' => 'castle']);

        $response = $this
            ->actingAs($seller)
            ->post(route('listings.store'), $payload, $this->jsonHeaders);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['property_type']);
    });

    it('fails validation when year_built is before 1800', function (): void {
        $seller = User::factory()->create([
            'phone_number' => '4035550108',
            'email' => 'old-year@example.com',
            'role' => 'seller',
        ]);
        $seller->assignRole('seller');

        $payload = array_merge($this->payload, ['year_built' => 1700]);

        $response = $this
            ->actingAs($seller)
            ->post(route('listings.store'), $payload, $this->jsonHeaders);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['year_built']);
    });

    it('fails validation when gallery_images contain more than 5 files', function (): void {
        $seller = User::factory()->create([
            'phone_number' => '4035550109',
            'email' => 'too-many-images@example.com',
            'role' => 'seller',
        ]);
        $seller->assignRole('seller');

        $payload = array_merge($this->payload, [
            'gallery_images' => [
                UploadedFile::fake()->image('g1.jpg'),
                UploadedFile::fake()->image('g2.jpg'),
                UploadedFile::fake()->image('g3.jpg'),
                UploadedFile::fake()->image('g4.jpg'),
                UploadedFile::fake()->image('g5.jpg'),
                UploadedFile::fake()->image('g6.jpg'),
            ],
        ]);

        $response = $this
            ->actingAs($seller)
            ->post(route('listings.store'), $payload, $this->jsonHeaders);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['gallery_images']);
    });
});
