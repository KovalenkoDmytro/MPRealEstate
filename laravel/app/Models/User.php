<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{

    use HasFactory, Notifiable, HasRoles;

    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationship with Deals
    public function deals(): BelongsToMany {
        return $this->belongsToMany(Deal::class, 'deal_user');
    }

    // Relationship with RealEstateListing
    public function favoriteListings(): BelongsToMany {
        return $this->belongsToMany(RealEstateListing::class, 'favorite_listings')->withTimestamps();
    }

}
