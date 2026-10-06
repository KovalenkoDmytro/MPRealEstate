<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        $buyers = User::role('buyer')->orderBy('id')->get();

        if ($buyers->isEmpty()) {
            return;
        }

        foreach (RealEstateListing::query()->where('status', 'available')->get() as $listing) {
            foreach ($buyers->take(2) as $index => $buyer) {
                Offer::query()->firstOrCreate([
                    'real_estate_listing_id' => $listing->id,
                    'buyer_id' => $buyer->id,
                ], [
                    'amount' => round((float) $listing->price * ($index === 0 ? 0.98 : 0.94) / 500) * 500,
                    'status' => $index === 0 ? 'pending' : 'rejected',
                    'message' => 'Pre-approved buyer. Offer subject to financing and a satisfactory home inspection.',
                    'created_at' => now()->subDays($index + 1),
                    'updated_at' => now()->subDay(),
                ]);
            }
        }
    }
}
