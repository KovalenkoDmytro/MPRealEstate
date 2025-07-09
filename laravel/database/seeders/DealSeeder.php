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

        $buyers = User::whereHas('roles', function ($query) {
            $query->where('name', 'buyer');
        })->get();

        $sellers = User::whereHas('roles', function ($query) {
            $query->where('name', 'seller');
        })->get();

        $lawyers = User::whereHas('roles', function ($query) {
            $query->where('name', 'lawyer');
        })->get();

        $listings = RealEstateListing::inRandomOrder()->get(); // ✅ Get all available listings

        foreach (range(1, 3) as $i) {
            if ($sellers->isEmpty()) {
                continue;
            }

            $seller = $sellers->random();
            $sellerListing = RealEstateListing::where('seller_id', $seller->id)->inRandomOrder()->first();

            if (!$sellerListing) {
                continue; // Skip if seller has no listing
            }

            $deal = Deal::create([
                'name' => "Deal $i",
                'amount' => rand(5000, 50000),
                'seller_message' => "Sample deal $i",
                'real_estate_listing_id' => $sellerListing->id,
            ]);

            // Attach users
            $deal->users()->attach($seller->id); // ✅ seller is owner of listing

            if ($buyers->isNotEmpty()) {
                $deal->users()->attach($buyers->random()->id);
            }
            if ($lawyers->isNotEmpty()) {
                $deal->users()->attach($lawyers->random()->id);
            }
        }
    }
}

