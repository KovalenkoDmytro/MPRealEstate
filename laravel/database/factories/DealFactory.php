<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deal>
 */
class DealFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Deal ' . $this->faker->unique()->word(),
            'amount' => $this->faker->randomFloat(2, 5000, 50000),
            'deal_message' => $this->faker->sentence(),
        ];
    }
}
