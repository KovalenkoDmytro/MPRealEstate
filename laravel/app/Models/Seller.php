<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;

class Seller extends User
{
    use HasRoles;

    protected $table = 'users';

    public static function querySellers(): Builder {
        return User::whereHas('roles', static function ($q) {
            $q->where('name', 'seller');
        });
    }

    public function listings(): HasMany {
        return $this->hasMany(RealEstateListing::class, 'seller_id');
    }

    public function appointments(): HasMany {
        return $this->hasMany(Appointment::class, 'seller_id');
    }
}



