<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $seller_id
 * @property string $title
 * @property string $description
 * @property string $price
 * @property string $location
 * @property string|null $property_type
 * @property int $bedrooms
 * @property int $bathrooms
 * @property int $square_feet
 * @property int|null $lot_size
 * @property string|null $year_built
 * @property int $has_garage
 * @property int|null $garage_spaces
 * @property int $has_basement
 * @property string|null $hoa_fees
 * @property string|null $property_taxes
 * @property string $status
 * @property int $price_reduced
 * @property string|null $keywords
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Deal|null $deal
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ListingImage> $images
 * @property-read int|null $images_count
 * @property-read \App\Models\ListingImage|null $mainImage
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Offer> $offers
 * @property-read int|null $offers_count
 * @property-read \App\Models\Seller $seller
 * @method static \Database\Factories\RealEstateListingFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereBathrooms($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereBedrooms($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereGarageSpaces($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereHasBasement($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereHasGarage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereHoaFees($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereKeywords($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereLotSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing wherePriceReduced($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing wherePropertyTaxes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing wherePropertyType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereSellerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereSquareFeet($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RealEstateListing whereYearBuilt($value)
 * @mixin \Eloquent
 */
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
