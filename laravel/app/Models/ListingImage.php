<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $real_estate_listing_id
 * @property string $image_path
 * @property int $is_main
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\RealEstateListing $listing
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage whereIsMain($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage whereRealEstateListingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ListingImage whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ListingImage extends Model
{
    use HasFactory;

    protected $fillable = ['real_estate_listing_id', 'image_path', 'is_main'];

    public function listing(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }
}
