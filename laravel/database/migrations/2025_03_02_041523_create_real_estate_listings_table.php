<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('real_estate_listings', static function (Blueprint $table) {
            $table->id();

            // Ownership
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');

            // Core Info
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);

            //Google Places Address Fields
            $table->string('address')->nullable();          // Full formatted address
            $table->string('street_number')->nullable();
            $table->string('street_name')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();

            //Coordinates for map
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Property Specs
            $table->enum('property_type', ['house', 'condo', 'townhouse', 'land', 'multi-family', 'farm']);
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('square_feet');
            $table->unsignedInteger('lot_size')->nullable();

            // Additional Details
            $table->year('year_built');
            $table->boolean('has_garage')->default(false);
            $table->unsignedSmallInteger('garage_spaces')->nullable();
            $table->boolean('has_basement')->default(false);

            // Financials
            $table->decimal('hoa_fees', 10, 2)->nullable();
            $table->decimal('property_taxes', 10, 2);

            // Status
            $table->string('status')->default('available');
            $table->boolean('price_reduced')->default(false);

            $table->unsignedBigInteger('views_count')->default(0);
            $table->unsignedBigInteger('unique_viewers_count')->default(0);
            // Search
            $table->json('keywords')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('real_estate_listings');
    }
};
