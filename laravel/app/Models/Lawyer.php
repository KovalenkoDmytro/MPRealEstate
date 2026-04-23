<?php

namespace App\Models;

use Illuminate\Support\Collection;
use Spatie\Permission\Traits\HasRoles;

class Lawyer extends User
{
    use HasRoles;

    protected $table = 'users';
    public function getClosedDeals(): Collection
    {
        return $this->deals()
            ->where(static function ($q) {
                $q->where('is_completed', true)
                    ->orWhere('is_broken', true);
            })
            ->get();
    }

    public function getPendingDeals(): Collection
    {
        return $this->deals()
            ->where('is_completed', false)
            ->where('is_broken', false)
            ->get();
    }


    public function getAllDeals(): Collection
    {
        return $this->deals()
            ->with(['users', 'realEstateListing.mainImage', 'realEstateListing.images', 'files'])
            ->get();
    }
}
