<?php

namespace Database\Seeders;

use App\Models\Seller;
use Illuminate\Database\Seeder;
use App\Models\RealEstateListing;
use Faker\Factory as Faker;

class RealEstateListingSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();


        // Get all users with the seller role
        $sellers = Seller::whereHas('roles', function ($query) {
            $query->where('name', 'seller');
        })->get();

        if ($sellers->isEmpty()) {
            echo "❌ No sellers found. Listings cannot be created.\n";
            return;
        }

        foreach ($sellers as $seller) {
            // Each seller gets 2-5 listings
            foreach (range(1, rand(2, 5)) as $_) {
                RealEstateListing::create([
                    'seller_id' => $seller->id,
                    'title' => $faker->sentence(4),
                    'description' => $faker->paragraph(),
                    'price' => $faker->randomFloat(2, 50000, 1000000),
                    'location' => $faker->city,
                    'bedrooms' => rand(1, 6),
                    'bathrooms' => rand(1, 4),
                    'square_feet' => rand(500, 5000),
                    'status' => $faker->randomElement(['available', 'sold', 'pending']),
                ]);
            }
        }
    }
}

