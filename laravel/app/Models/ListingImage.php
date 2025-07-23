<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $real_estate_listing_id
 * @property string $image_path
 * @property int $is_main
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\RealEstateListing $listing
 * @method static Builder<static>|ListingImage newModelQuery()
 * @method static Builder<static>|ListingImage newQuery()
 * @method static Builder<static>|ListingImage query()
 * @method static Builder<static>|ListingImage whereCreatedAt($value)
 * @method static Builder<static>|ListingImage whereId($value)
 * @method static Builder<static>|ListingImage whereImagePath($value)
 * @method static Builder<static>|ListingImage whereIsMain($value)
 * @method static Builder<static>|ListingImage whereRealEstateListingId($value)
 * @method static Builder<static>|ListingImage whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ListingImage extends Model
{
    use HasFactory;

    protected $fillable = ['real_estate_listing_id', 'image_path', 'is_main'];

    public function listing(): BelongsTo {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }
}
