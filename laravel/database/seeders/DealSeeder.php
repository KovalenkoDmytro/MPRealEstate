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
        $steps = [
            'Step1',
            'Financing Formalities',
            'Inspections',
            'Removing Conditions',
            'Lawyer Paperwork',
            'Closing the Deal',
        ];

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
            $deal = Deal::create([
                'name' => "Deal $i",
                'amount' => rand(5000, 50000),
                'data' => json_encode(['description' => "Sample deal $i"]),
                'current_step' => $steps[array_rand($steps)], // ✅ Assign a random step as a string
                'real_estate_listing_id' => $listings->count() ? $listings->pop()->id : null, // ✅ Assign a listing if available
            ]);

            // ✅ Attach one buyer, one seller, and one lawyer
            if ($buyers->isNotEmpty()) {
                $deal->users()->attach($buyers->random()->id);
            }
            if ($sellers->isNotEmpty()) {
                $deal->users()->attach($sellers->random()->id);
            }
            if ($lawyers->isNotEmpty()) {
                $deal->users()->attach($lawyers->random()->id);
            }
        }
    }
}

