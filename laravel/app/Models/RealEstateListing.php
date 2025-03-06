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

    // Relationship with seller
    public function seller(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    // Relationship with Listing Images
    public function images(): \Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(ListingImage::class, 'real_estate_listing_id');
    }

    // Get the main image
    public function mainImage()
    {
        return $this->hasOne(ListingImage::class)->where('is_main', true);
    }
}
