<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = User::class; // Define the model

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Default User',
            'email' => 'default@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'buyer',
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Assign a role to a user.
     */

    public function seller(): Factory|UserFactory {
        return $this->afterCreating(function (User $user) {
            $user->assignRole('seller');
        });
    }

    public function buyer(): Factory|UserFactory {
        return $this->afterCreating(function (User $user) {
            $user->assignRole('buyer');
        });
    }

    public function admin(): Factory|UserFactory {
        return $this->afterCreating(function (User $user) {
            $user->assignRole('admin');
        });
    }

    public function lawyer(): Factory|UserFactory {
        return $this->afterCreating(function (User $user) {
            $user->assignRole('lawyer');
        });
    }

}
