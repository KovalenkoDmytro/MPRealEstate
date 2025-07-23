<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property string $amount
 * @property string|null $security_deposit
 * @property \Illuminate\Support\Carbon|null $possession_day
 * @property int $is_possession_day_confirmed
 * @property \Illuminate\Support\Carbon|null $condition_day
 * @property int $is_condition_day_confirmed
 * @property int $is_confirmed
 * @property int $is_made
 * @property int $is_broken
 * @property string|null $seller_message
 * @property int $is_completed
 * @property int|null $real_estate_listing_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\DealBreakRequest|null $breakRequest
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DealFile> $files
 * @property-read int|null $files_count
 * @property-read \App\Models\RealEstateListing|null $listing
 * @property-read \App\Models\RealEstateListing|null $realEstateListing
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static Builder<static>|Deal newModelQuery()
 * @method static Builder<static>|Deal newQuery()
 * @method static Builder<static>|Deal query()
 * @method static Builder<static>|Deal whereAmount($value)
 * @method static Builder<static>|Deal whereConditionDay($value)
 * @method static Builder<static>|Deal whereCreatedAt($value)
 * @method static Builder<static>|Deal whereId($value)
 * @method static Builder<static>|Deal whereIsBroken($value)
 * @method static Builder<static>|Deal whereIsCompleted($value)
 * @method static Builder<static>|Deal whereIsConditionDayConfirmed($value)
 * @method static Builder<static>|Deal whereIsConfirmed($value)
 * @method static Builder<static>|Deal whereIsMade($value)
 * @method static Builder<static>|Deal whereIsPossessionDayConfirmed($value)
 * @method static Builder<static>|Deal whereName($value)
 * @method static Builder<static>|Deal wherePossessionDay($value)
 * @method static Builder<static>|Deal whereRealEstateListingId($value)
 * @method static Builder<static>|Deal whereSecurityDeposit($value)
 * @method static Builder<static>|Deal whereSellerMessage($value)
 * @method static Builder<static>|Deal whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Deal extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'data' => 'array',
        'condition_day' => 'datetime',
        'possession_day' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationship with users
    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class, 'deal_user');
    }

    // Relationship with RealEstateListing
    public function realEstateListing(): BelongsTo {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }

    public function listing(): BelongsTo {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }

    public function files(): Deal|HasMany {
        return $this->hasMany(DealFile::class);
    }

    public function breakRequest(): HasOne {
        return $this->hasOne(DealBreakRequest::class);
    }

}
