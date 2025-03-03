<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use Spatie\Permission\Models\Role;
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
            'role' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Assign a role to a user.
     */
    public function withRole(string $role, string $name, string $email): static
    {
        return $this->state([
            'name' => $name,
            'email' => $email,
            'role' => $role,
        ])->afterCreating(function (User $user) use ($role) {
            $roleInstance = Role::firstOrCreate(['name' => $role]);
            $user->assignRole($roleInstance);
        });
    }
}
