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
        $hasGarage = $this->faker->boolean(70);
        $tags = [
            'garage', 'finished basement', 'corner lot', 'near LRT',
            'renovated kitchen', 'fenced yard'
        ];

        return [
            'seller_id'      => User::factory()->seller(),
            'title'          => ucfirst($this->faker->word()) . ' ' . ucfirst($this->faker->word()),
            'description'    => $this->faker->realText(300),
            'price'          => $this->faker->randomFloat(2, 100000, 2500000),
            'property_type'  => $this->faker->randomElement(['house', 'condo', 'townhouse']),
            'bedrooms'       => $this->faker->numberBetween(1, 6),
            'bathrooms'      => $this->faker->numberBetween(1, 4),
            'square_feet'    => $this->faker->numberBetween(500, 5000),
            'year_built'     => $this->faker->year(),
            'status'         => 'available',
            'keywords'       => $this->faker->randomElements($tags, 3),

            // DEFAULT GENERIC DATA (Fallback if no address is passed)
            'street_number' => $this->faker->buildingNumber(),
            'unit_number'   => null,
            'street_name'   => $this->faker->streetName(),
            'city'          => $this->faker->city(),
            'province'      => $this->faker->state(),
            'postal_code'   => $this->faker->postcode(),
            'country'       => $this->faker->country(),
            'latitude'      => $this->faker->latitude(),
            'longitude'     => $this->faker->longitude(),
        ];
    }
}
