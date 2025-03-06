<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('real_estate_listing_id')->constrained()->onDelete('cascade'); // ✅ Links to listings
            $table->string('image_path'); // ✅ Stores image path
            $table->boolean('is_main')->default(false); // ✅ Indicates main image
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_images');
    }
};
