<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        $buyers = User::role('buyer')->get();
        $listings = RealEstateListing::all();

        if ($buyers->isEmpty() || $listings->isEmpty()) {
            return;
        }

        foreach ($listings as $listing) {
            Offer::factory()
                ->count(rand(1, 3))
                ->create([
                    'real_estate_listing_id' => $listing->id,
                    'buyer_id' => $buyers->random()->id,
                ]);
        }
    }
}
