<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'real_estate_listing_id',
        'buyer_id',
        'offer_price',
        'message',
        'status',
    ];

    // Each offer belongs to one listing
    public function listing()
    {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }

    // Each offer belongs to one buyer (user)
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
