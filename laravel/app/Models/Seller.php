<?php

namespace App\Models;

use App\Models\User;

class Seller extends User
{
    protected $table = 'users'; // Ensures it still uses the `users` table

    protected static function boot()
    {
        parent::boot();

        // Automatically filter only sellers
        static::addGlobalScope('sellerOnly', function ($query) {
            $query->whereHas('roles', function ($q) {
                $q->where('name', 'seller');
            });
        });
    }

    public function listings(): \Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(RealEstateListing::class, 'seller_id');
    }
}


