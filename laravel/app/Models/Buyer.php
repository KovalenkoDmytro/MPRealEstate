<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;

class Buyer extends User
{
    use HasRoles;

    public function appointments(): Buyer|HasMany {
        return $this->hasMany(Appointment::class, 'buyer_id');
    }
}
