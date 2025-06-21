<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'amount',
        'data',
        'real_estate_listing_id',
        'security_deposit',
        'possession_day',
        'condition_day',
        'security_deposit',
    ];

    protected $casts = [
        'data' => 'array',
        'condition_day' => 'datetime',
        'possession_day' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Define the fixed steps
    public static $steps = [
        'Step1',
        'Financing Formalities',
        'Inspections',
        'Removing Conditions',
        'Lawyer Paperwork',
        'Closing the Deal',
    ];

    // Relationship with users
    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany {
        return $this->belongsToMany(User::class, 'deal_user');
    }


    // Relationship with RealEstateListing
    public function realEstateListing(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(RealEstateListing::class, 'real_estate_listing_id');
    }

    public function listing(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(\App\Models\RealEstateListing::class, 'real_estate_listing_id');
    }

    public function files(): Deal|\Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(DealFile::class);
    }

}
