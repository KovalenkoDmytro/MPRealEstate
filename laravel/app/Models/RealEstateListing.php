<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class RealEstateListing extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $guarded = [];

    protected $casts = [
      'has_basement' => 'boolean',
      'has_garage' => 'boolean',
      'price_reduced' => 'boolean',
    ];

    // A listing can have multiple offers
    public function offers(): HasMany|RealEstateListing {
        return $this->hasMany(Offer::class, 'real_estate_listing_id');
    }

    // Relationship with a seller
    public function seller(): BelongsTo {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    // Relationship with Listing Images
    public function images(): HasMany {
        return $this->hasMany(ListingImage::class, 'real_estate_listing_id');
    }

    // Relationship with a deal
    public function deal(): HasOne {
        return $this->hasOne(Deal::class, 'real_estate_listing_id');
    }

    // Get the main image
    public function mainImage()
    {
        return $this->hasOne(ListingImage::class)->where('is_main', true);
    }

}
