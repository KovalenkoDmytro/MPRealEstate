<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListingImage extends Model
{
    use HasFactory;

    protected $fillable = ['real_estate_listing_id', 'image_path', 'is_main'];

    public function listing()
    {
        return $this->belongsTo(RealEstateListing::class, 'listing_id');
    }
}
