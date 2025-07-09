<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealEstateListing extends Model
{
    use HasFactory;

    protected $guarded = [];

    // A listing can have multiple offers
    public function offers(): \Illuminate\Database\Eloquent\Relations\HasMany|RealEstateListing {
        return $this->hasMany(Offer::class, 'real_estate_listing_id');
    }

    // Relationship with seller
    public function seller(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    // Relationship with Listing Images
    public function images(): \Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(ListingImage::class, 'real_estate_listing_id');
    }

    // Relationship with deal
    public function deal(): \Illuminate\Database\Eloquent\Relations\HasOne {
        return $this->hasOne(Deal::class, 'real_estate_listing_id');
    }

    // Get the main image
    public function mainImage()
    {
        return $this->hasOne(ListingImage::class)->where('is_main', true);
    }

}
