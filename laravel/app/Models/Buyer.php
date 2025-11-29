<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;

class Buyer extends User
{
    use HasRoles;

    protected $table = 'users';

    public function appointments(): Buyer|HasMany {
        return $this->hasMany(Appointment::class, 'buyer_id');
    }


    public function favoriteListings(): BelongsToMany {
        return $this->belongsToMany(RealEstateListing::class,
            'favorite_listings',
            'user_id', 
            'real_estate_listing_id')
            ->withTimestamps();
    }
}
