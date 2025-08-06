<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
        'is_broken' => 'boolean',
        'is_confirmed' => 'boolean',//Security Deposit
        'is_made' => 'boolean',  //Security Deposit
        'is_completed' => 'boolean',
        'is_condition_day_confirmed' => 'boolean',
        'is_possession_day_confirmed' => 'boolean',
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
