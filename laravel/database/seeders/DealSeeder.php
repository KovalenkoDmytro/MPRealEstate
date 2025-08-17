<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Deal;
use App\Models\User;
use App\Models\RealEstateListing;

class DealSeeder extends Seeder
{
    public function run(): void
    {
        $buyers = User::role('buyer')->get();
        $sellers = User::role('seller')->get();
        $lawyers = User::role('lawyer')->get();

        // Preload listings
        $listings = RealEstateListing::all();

        if ($sellers->isEmpty() || $listings->isEmpty()) {
            return;
        }

        foreach ( range(1, random_int(3, 6)) as $i) {
            $seller = $sellers->random();
            $sellerListing = $listings->where('seller_id', $seller->id)->random();

            $deal = Deal::factory()->create([
                'real_estate_listing_id' => $sellerListing->id,
                'amount'                 => random_int(5000, 50000),
                'seller_message'         => "Sample deal $i",
            ]);

            // Attach participants
            $deal->users()->syncWithoutDetaching([$seller->id]); // Seller always in deal
            if ($buyers->isNotEmpty()) {
                $deal->users()->syncWithoutDetaching([$buyers->random()->id]);
            }
            if ($lawyers->isNotEmpty()) {
                $deal->users()->syncWithoutDetaching([$lawyers->random()->id]);
            }
        }
    }
}
