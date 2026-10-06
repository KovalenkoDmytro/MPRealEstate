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
        $sellers = User::role('seller')->orderBy('email')->get();

        if ($sellers->isEmpty()) {
            $this->command?->warn('No sellers found. Skipping Listing Seeder.');

            return;
        }

        $json = File::get(database_path('data/properties.json'));
        $properties = json_decode($json, true, flags: JSON_THROW_ON_ERROR);

        foreach ($properties as $propertyIndex => $data) {
            $imageUrls = $data['image_url'] ?? [];

            unset($data['image_url']);

            $seller = $sellers[$propertyIndex % $sellers->count()];

            $listing = RealEstateListing::query()->updateOrCreate(
                [
                    'street_number' => $data['street_number'],
                    'street_name' => $data['street_name'],
                    'unit_number' => $data['unit_number'] ?? null,
                    'postal_code' => $data['postal_code'],
                ],
                array_merge($data, ['seller_id' => $seller->id]),
            );

            $listing->images()->update(['is_main' => false]);

            foreach ($imageUrls as $index => $url) {
                $listing->images()->updateOrCreate(['image_path' => $url], [
                    'is_main' => $index === 0,
                ]);
            }
        }
    }
}
