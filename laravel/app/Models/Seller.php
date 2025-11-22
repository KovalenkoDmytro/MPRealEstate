<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;

class Seller extends User
{
    use HasRoles;

    protected $table = 'users';

    public static function onlySellers(): User {
        return User::whereHas('roles', static function ($q) {
            $q->where('name', 'seller');
        });
    }

    public function listings(): Seller|HasMany {
        return $this->hasMany(RealEstateListing::class, 'seller_id');
    }

    public function appointments(): Seller|HasMany {
        return $this->hasMany(Appointment::class, 'seller_id');
    }
}



