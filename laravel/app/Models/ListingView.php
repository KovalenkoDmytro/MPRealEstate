<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingView extends Model
{

    protected $guarded = [];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getForSeller(int $sellerId)
    {
        // We return the Query Builder so it's still chainable
        return self::whereHas('listing', function ($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        });
    }
}
