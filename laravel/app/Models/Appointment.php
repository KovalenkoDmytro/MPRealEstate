<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{

    protected $fillable = [
        'buyer_id',
        'seller_id',
        'scheduled_at',
        'status',
        'confirmation_token',
        'access_code',
        'real_estate_listing_id',
        'rejection_reason',
        'buyer_cancelled_at',
    ];

//    protected array $dates = ['scheduled_at'];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'buyer_cancelled_at' => 'datetime',
    ];

    public function scopeForUser(Builder $query, \App\Models\User $user): Builder
    {
        return match ($user->role) {
            'seller' => $query->where('seller_id', $user->id),
            'buyer'  => $query->where('buyer_id', $user->id),
            default  => $query->whereRaw('1 = 0'),
        };
    }

    public function buyer(): BelongsTo {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function listing(): BelongsTo {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }
}
