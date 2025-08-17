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
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade'); // Only sellers can own listings

            // Core Info
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);

            // Location
            $table->string('location');

            // Property Specs
            $table->enum('property_type', ['house', 'condo', 'townhouse', 'land', 'multi-family', 'farm']);
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('square_feet');
            $table->unsignedInteger('lot_size')->nullable(); // in sqft or meters

            // Additional Details
            $table->year('year_built');
            $table->boolean('has_garage')->default(false);
            $table->unsignedSmallInteger('garage_spaces')->nullable();
            $table->boolean('has_basement')->default(false);

            // Financials
            $table->decimal('hoa_fees', 10, 2);        // Monthly or yearly
            $table->decimal('property_taxes', 10, 2);  // Annual estimate

            // Status
            $table->string('status')->default('available'); // available, sold, pending
            $table->boolean('price_reduced')->default(false);

            // Search
            $table->text('keywords')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('real_estate_listings');
    }
};
