<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Offer extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Each offer belongs to one listing
    public function listing(): BelongsTo {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }

    // Each offer belongs to one buyer (user)
    public function buyer(): BelongsTo {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
