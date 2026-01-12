<?php

namespace Database\Seeders;

use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class RealEstateListingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get ALL sellers
        $sellers = User::role('seller')->get();

        if ($sellers->isEmpty()) {
            $this->command->warn('No sellers found. Skipping Listing Seeder.');
            return;
        }

        // 2. Load JSON
        $json = File::get(database_path('data/properties.json'));
        $properties = json_decode($json, true);

        // 3. Loop and Create
        foreach ($properties as $data) {

            // Extract the ARRAY of images
            // We use specific variable name $imageUrls to be clear it's an array
            $imageUrls = $data['image_url'] ?? [];

            // Remove it from $data so we can pass the rest directly to the listing create method
            unset($data['image_url']);

            $randomSeller = $sellers->random();

            // Create Listing
            // (Make sure your RealEstateListing model casts 'keywords' => 'array' if your DB column is json)
            $listing = RealEstateListing::factory()
                ->for($randomSeller, 'seller')
                ->create($data);

            // 4. Loop through images and save them
            foreach ($imageUrls as $index => $url) {
                $listing->images()->create([
                    'image_path' => $url,
                    'is_main'    => $index === 0, // Returns TRUE for the first item (0), FALSE for others
                ]);
            }
        }
    }
}
