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
        // 1. Get ALL sellers as a collection
        $sellers = User::role('seller')->get();

        // Safety check: ensure we actually have sellers
        if ($sellers->isEmpty()) {
            $this->command->warn('No sellers found. Skipping Listing Seeder.');
            return;
        }

        // 2. Load the JSON data
        $json = File::get(database_path('data/properties.json'));
        $properties = json_decode($json, true);

        // 3. Loop through and create
        foreach ($properties as $data) {
            // Extract image_url so it doesn't try to save to the listing table
            $imageUrl = $data['image_url'];
            unset($data['image_url']);

            // Pick a RANDOM seller for this specific property
            $randomSeller = $sellers->random();

            // Create Listing
            $listing = RealEstateListing::factory()
                ->for($randomSeller, 'seller') // Use the single random seller here
                ->create($data);

            // Create Image
            $listing->images()->create([
                'image_path' => $imageUrl,
                'is_main'    => true,
            ]);
        }
    }
}
