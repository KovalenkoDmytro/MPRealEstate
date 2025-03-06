<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'amount', 'data'];

    protected $casts = [
        'data' => 'array', // Cast JSON data
    ];

    // Define the fixed steps
    public static $steps = [
        'Making or Considering an Offer',
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

    public function steps(): \Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(DealStep::class);
    }

    public function moveToNextStep(): void {
        $currentIndex = array_search($this->current_step, self::$steps);

        if ($currentIndex !== false && isset(self::$steps[$currentIndex + 1])) {
            $this->update(['current_step' => self::$steps[$currentIndex + 1]]);
        }
    }

}
