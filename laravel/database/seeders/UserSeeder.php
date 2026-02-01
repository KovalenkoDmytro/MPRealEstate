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
            ['name' => 'Buyer2 User', 'email' => 'buyer2@example.com', 'role' => 'buyer'],
            ['name' => 'Seller User', 'email' => 'seller@example.com', 'role' => 'seller'],
            ['name' => 'Seller2 User', 'email' => 'seller2@example.com', 'role' => 'seller'],
            ['name' => 'Lawyer User', 'email' => 'lawyer@example.com', 'role' => 'lawyer'],
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'phone_number' => fake('phone_number'),
                    'email_verified_at'=> now(),
                    'name' => $userData['name'],
                    'password' => Hash::make('password'),
                    'role' => $userData['role'],
                ]
            );

            // Assign a role using Spatie
            if (!$user->hasRole($userData['role'])) {
                $user->assignRole($userData['role']);
            }

            // If the user has the 'lawyer' role, assign lawyer-specific fields
            if ($user->hasRole('lawyer')) {

                // Generate a unique lawyer number if it's not already set
                if (!$user->lawyer_number) {
                    $user->lawyer_number = generateUniqueLawyerNumber();
                }

                // Randomly assign the lawyer as either a seller's or buyer's lawyer (but not both)
                $isSellerLawyer = random_int(0, 1) === 1;
                $user->is_seller_lawyer = $isSellerLawyer;
                $user->is_buyer_lawyer  = !$isSellerLawyer;

                $user->save();
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

