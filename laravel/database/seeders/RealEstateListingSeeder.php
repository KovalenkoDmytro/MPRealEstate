<?php

namespace Database\Seeders;

use App\Models\ListingImage;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\RealEstateListing;

class RealEstateListingSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::role('seller')->get();

        foreach ($sellers as $seller) {
            RealEstateListing::factory()
                ->count(rand(2, 5))
                ->for($seller, 'seller')  // sets seller_id
                ->create()
                ->each(function ($listing) {
                    // Add images for each listing:
                    $imageLinks = [
                        'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
                        'https://images.unsplash.com/photo-1572120360610-d971b9b63928',
                        'https://images.unsplash.com/photo-1599423300746-b62533397364',
                    ];

                    foreach ($imageLinks as $index => $url) {
                        $listing->images()->create([
                            'image_path' => $url,
                            'is_main' => $index === 0,
                        ]);
                    }
                });
        }
    }
}
