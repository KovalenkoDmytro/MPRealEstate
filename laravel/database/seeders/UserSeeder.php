<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Deal;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin User', 'email' => 'admin@example.com', 'role' => 'admin'],
            ['name' => 'Buyer User', 'email' => 'buyer@example.com', 'role' => 'buyer'],
            ['name' => 'Seller User', 'email' => 'seller@example.com', 'role' => 'seller'],
            ['name' => 'Lawyer User', 'email' => 'lawyer@example.com', 'role' => 'lawyer'],
        ];

        foreach ($users as $userData) {
            $user = User::factory()
                ->withRole($userData['role'], $userData['name'], $userData['email'])
                ->create();

            // Attach buyers & sellers to deals
            if (in_array($userData['role'], ['buyer', 'seller'])) {
                $this->attachUserToDeals($user);
            }
        }
    }

    private function attachUserToDeals(User $user): void {
        $deals = Deal::inRandomOrder()->take(2)->get(); // Attach user to up to 2 deals

        if ($deals->isNotEmpty()) {
            $user->deals()->attach($deals->pluck('id'));
        }
    }
}
