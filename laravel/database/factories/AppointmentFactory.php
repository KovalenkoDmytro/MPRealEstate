<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'buyer_id' => User::factory()->buyer(),
            'seller_id' => User::factory()->seller(),
            'real_estate_listing_id' => RealEstateListing::factory(),
            'scheduled_at' => now()->addDays(fake()->numberBetween(1, 10)),
            'status' => 'pending',
            'access_code' => null,
            'rejection_reason' => null,
            'buyer_cancelled_at' => null,
        ];
    }

    public function pending(): self
    {
        return $this->state(fn (): array => [
            'status' => 'pending',
            'access_code' => null,
            'rejection_reason' => null,
            'buyer_cancelled_at' => null,
        ]);
    }

    public function accepted(): self
    {
        return $this->state(fn (): array => [
            'status' => 'accepted',
            'access_code' => strtoupper(fake()->bothify('EST-####')),
            'rejection_reason' => null,
            'buyer_cancelled_at' => null,
        ]);
    }

    public function rejected(): self
    {
        return $this->state(fn (): array => [
            'status' => 'rejected',
            'access_code' => null,
            'rejection_reason' => fake()->sentence(),
            'buyer_cancelled_at' => null,
        ]);
    }

    public function cancelledByBuyer(): self
    {
        return $this->state(fn (): array => [
            'status' => 'cancelled by buyer',
            'access_code' => null,
            'rejection_reason' => null,
            'buyer_cancelled_at' => now()->subHours(2),
        ]);
    }
}
