<?php

namespace Database\Factories;

use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Offer>
 */
class OfferFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'real_estate_listing_id' => RealEstateListing::factory(),
            'buyer_id' => User::factory()->buyer(),
            'amount' => $this->faker->randomFloat(2, 50000, 2000000),
            'message' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected']),
        ];
    }
}
