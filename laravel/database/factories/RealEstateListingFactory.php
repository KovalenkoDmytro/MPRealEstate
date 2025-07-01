<?php

namespace Database\Factories;

use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RealEstateListingFactory extends Factory
{
    protected $model = RealEstateListing::class;

    public function definition(): array
    {
        return [
            'seller_id' => User::role('seller')->inRandomOrder()->first()->id ?? User::factory(), // ensures sellers exist or creates one
            'title' => ucfirst($this->faker->word()) . ' ' . ucfirst($this->faker->word()),
            'description' => $this->faker->realText(300),
            'price' => $this->faker->randomFloat(2, 100000, 2500000),
            'location' => 'Calgary, AB',
            'property_type' => $this->faker->randomElement(['house', 'condo', 'townhouse', 'land', 'multi-family', 'farm']),
            'bedrooms' => $this->faker->numberBetween(1, 6),
            'bathrooms' => $this->faker->numberBetween(1, 4),
            'square_feet' => $this->faker->numberBetween(500, 5000),
            'lot_size' => $this->faker->optional()->numberBetween(1000, 20000),
            'year_built' => $this->faker->optional()->year(),
            'has_garage' => $this->faker->boolean(70),
            'garage_spaces' => $this->faker->boolean(70) ? $this->faker->numberBetween(1, 3) : null,
            'has_basement' => $this->faker->boolean(40),
            'hoa_fees' => $this->faker->optional()->randomFloat(2, 100, 500),
            'property_taxes' => $this->faker->optional()->randomFloat(2, 1000, 10000),
            'status' => $this->faker->randomElement(['available', 'sold', 'pending']),
            'price_reduced' => $this->faker->boolean(10),
            'keywords' => $this->faker->words(10, true),
        ];
    }
}
