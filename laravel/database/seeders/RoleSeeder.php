<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permissions
        $permissions = [
            'view',
            'manage',
            'create',
            'edit',
            'delete',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define roles and assign permissions
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo($permissions); // Admin has all permissions

        $buyer = Role::firstOrCreate(['name' => 'buyer']);
        $buyer->givePermissionTo(['view']);

        $seller = Role::firstOrCreate(['name' => 'seller']);
        $seller->givePermissionTo(['create', 'edit']);

        $lawyer = Role::firstOrCreate(['name' => 'lawyer']);
        $lawyer->givePermissionTo(['view']);
    }
}
