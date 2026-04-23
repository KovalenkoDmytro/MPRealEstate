<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class DealService
{
    /**
     * @return Collection<int, \App\Models\Deal>
     */
    public function getAllDealsForUser(User $user): Collection
    {
        return $user->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images'])
            ->get();
    }

    /**
     * @return array{total: int, broken: int, completed: int, pending: int}
     */
    public function getUserDealStats(User $user): array
    {
        $deals = $user->deals();

        return [
            'total' => (clone $deals)->count(),
            'broken' => (clone $deals)->where('is_broken', true)->count(),
            'completed' => (clone $deals)->where('is_completed', true)->count(),
            'pending' => (clone $deals)->where('is_broken', false)->where('is_completed', false)->count(),
        ];
    }
}
