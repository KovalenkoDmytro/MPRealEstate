<?php

namespace App\Models;


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

    protected array $dates = ['scheduled_at'];

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
