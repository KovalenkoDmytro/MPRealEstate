<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealEstateListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id', 'title', 'description', 'price',
        'location', 'bedrooms', 'bathrooms', 'square_feet', 'status'
    ];

    public function seller(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(Seller::class, 'seller_id');
    }
}
