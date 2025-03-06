<?php

namespace Database\Seeders;

use App\Models\ListingImage;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\RealEstateListing;
use Spatie\Permission\Models\Role;
use Faker\Factory as Faker;

class RealEstateListingSeeder extends Seeder
{
    public function run(): void
    {
        // Define the static images
        $imageLinks = [
            'https://www.next-estate.de/wp-content/uploads/photos/branch_b/19467_d33eb8a2-0c6b-49c3-95de-c7c5bef305ee.jpg',
            'https://www.next-estate.de/wp-content/uploads/photos/branch_b/19467_ae9d0442-a4fc-4361-bbb0-3cd4511d4654.jpg',
            'https://www.next-estate.de/wp-content/uploads/photos/branch_b/19467_304ad366-68a4-4f49-80be-b50aa79061c8.jpg',
        ];

        $faker = Faker::create();

        // ✅ Ensure sellers exist
        $sellers = User::role('seller')->get();

        if ($sellers->isEmpty()) {
            echo "❌ No sellers found. Listings cannot be created.\n";
            return;
        }

        foreach ($sellers as $seller) {
            // Each seller gets 2-5 listings
            foreach (range(1, rand(2, 5)) as $_) {
                $listing = RealEstateListing::create([
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


                foreach ($imageLinks as $index => $imageUrl) {
                    ListingImage::create([
                        'real_estate_listing_id' => $listing->id,
                        'image_path' => $imageUrl,
                        'is_main' => $index === 0, // ✅ First image is main
                    ]);
                }
            }


        }


    }
}
