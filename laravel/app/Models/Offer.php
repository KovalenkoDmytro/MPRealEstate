<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $real_estate_listing_id
 * @property int $buyer_id
 * @property string $offer_price
 * @property string $message
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $buyer
 * @property-read \App\Models\RealEstateListing $listing
 * @method static Builder<static>|Offer newModelQuery()
 * @method static Builder<static>|Offer newQuery()
 * @method static Builder<static>|Offer query()
 * @method static Builder<static>|Offer whereBuyerId($value)
 * @method static Builder<static>|Offer whereCreatedAt($value)
 * @method static Builder<static>|Offer whereId($value)
 * @method static Builder<static>|Offer whereMessage($value)
 * @method static Builder<static>|Offer whereOfferPrice($value)
 * @method static Builder<static>|Offer whereRealEstateListingId($value)
 * @method static Builder<static>|Offer whereStatus($value)
 * @method static Builder<static>|Offer whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
    public function listing(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }

    // Each offer belongs to one buyer (user)
    public function buyer(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
