<?php

namespace App\Models;

use App\Models\User;
use Spatie\Permission\Traits\HasRoles;

class Seller extends User
{
    use HasRoles;

    protected $table = 'users'; // ✅ Uses the same table as User

    public static function onlySellers()
    {
        return User::whereHas('roles', function ($q) {
            $q->where('name', 'seller');
        });
    }

    public function listings()
    {
        return $this->hasMany(RealEstateListing::class, 'seller_id');
    }
}



