<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'buyer', 'seller', 'lawyer'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $users = [
            ['name' => 'Alex Morgan', 'email' => 'admin@example.com', 'role' => 'admin'],
            ['name' => 'Daniel Carter', 'email' => 'buyer@example.com', 'role' => 'buyer'],
            ['name' => 'Emily Wilson', 'email' => 'buyer2@example.com', 'role' => 'buyer'],
            ['name' => 'Michael Bennett', 'email' => 'seller@example.com', 'role' => 'seller'],
            ['name' => 'Sarah Thompson', 'email' => 'seller2@example.com', 'role' => 'seller'],
            ['name' => 'Olivia Parker', 'email' => 'lawyer@example.com', 'role' => 'lawyer'],
        ];

        foreach ($users as $userIndex => $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'phone_number' => '403555'.str_pad((string) (100 + $userIndex), 4, '0', STR_PAD_LEFT),
                    'email_verified_at' => now(),
                    'name' => $userData['name'],
                    'password' => Hash::make('password'),
                    'role' => $userData['role'],
                ]
            );

            if (! $user->hasRole($userData['role'])) {
                $user->assignRole($userData['role']);
            }

            if ($user->hasRole('lawyer')) {

                if (! $user->lawyer_number) {
                    $user->lawyer_number = generateUniqueLawyerNumber();
                }

                $user->is_seller_lawyer = true;
                $user->is_buyer_lawyer = false;

                $user->save();
            }

        }
    }
}
