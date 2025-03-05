<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Deal;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure roles exist before assigning them
        $roles = ['admin', 'buyer', 'seller', 'lawyer'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $users = [
            ['name' => 'Admin User', 'email' => 'admin@example.com', 'role' => 'admin'],
            ['name' => 'Buyer User', 'email' => 'buyer@example.com', 'role' => 'buyer'],
            ['name' => 'Seller User', 'email' => 'seller@example.com', 'role' => 'seller'],
            ['name' => 'Lawyer User', 'email' => 'lawyer@example.com', 'role' => 'lawyer'],
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']], // Ensure uniqueness
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('password'),
                ]
            );

            // Assign role properly using Spatie
            $role = Role::where('name', $userData['role'])->first();
            if ($role && !$user->hasRole($role->name)) {
                $user->assignRole($role->name);
            }

            // Attach buyers & sellers to deals
            if (in_array($userData['role'], ['buyer', 'seller'])) {
                $this->attachUserToDeals($user);
            }
        }
    }

    private function attachUserToDeals(User $user): void
    {
        $deals = Deal::inRandomOrder()->take(2)->get(); // Attach user to up to 2 deals

        if ($deals->isNotEmpty()) {
            $user->deals()->attach($deals->pluck('id'));
        }
    }
}

