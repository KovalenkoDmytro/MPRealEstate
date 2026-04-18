<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Auth;

final class RoleViewResolver
{
    /**
     * Resolve the Inertia view path based on the authenticated user's role.
     *
     * @param  array<string, string>  $roleViewMap  e.g. ['seller' => 'Users/Seller/Deals/Show', ...]
     */
    public static function resolve(array $roleViewMap): string
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $role = $user->getRoleNames()->first();

        return $roleViewMap[$role]
            ?? throw new \RuntimeException("No view configured for role [{$role}].");
    }
}
