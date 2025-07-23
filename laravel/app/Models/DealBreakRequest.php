<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $deal_id
 * @property int $initiator_id
 * @property string $status
 * @property string|null $message
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Deal $deal
 * @property-read \App\Models\User $initiator
 * @method static Builder<static>|DealBreakRequest newModelQuery()
 * @method static Builder<static>|DealBreakRequest newQuery()
 * @method static Builder<static>|DealBreakRequest query()
 * @method static Builder<static>|DealBreakRequest whereCreatedAt($value)
 * @method static Builder<static>|DealBreakRequest whereDealId($value)
 * @method static Builder<static>|DealBreakRequest whereId($value)
 * @method static Builder<static>|DealBreakRequest whereInitiatorId($value)
 * @method static Builder<static>|DealBreakRequest whereMessage($value)
 * @method static Builder<static>|DealBreakRequest whereStatus($value)
 * @method static Builder<static>|DealBreakRequest whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class DealBreakRequest extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function deal(): BelongsTo {
        return $this->belongsTo(Deal::class);
    }

    public function initiator(): BelongsTo {
        return $this->belongsTo(User::class, 'initiator_id');
    }
}
