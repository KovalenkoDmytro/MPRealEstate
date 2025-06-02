<?php

namespace App\Models;

use App\Models\User;
use Spatie\Permission\Traits\HasRoles;

class Seller extends User
{
    use HasRoles;

    protected $table = 'users'; // ✅ Uses the same table as User

    public static function onlySellers(): \App\Models\User {
        return User::whereHas('roles', function ($q) {
            $q->where('name', 'seller');
        });
    }

    public function listings(): Seller|\Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(RealEstateListing::class, 'seller_id');
    }

}



