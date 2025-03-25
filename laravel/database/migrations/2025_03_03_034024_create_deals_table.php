<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Name of the deal
            $table->decimal('amount', 10, 2); // Deal amount
            $table->decimal('security_deposit', 10, 2)->nullable(); // Security Deposit field
            $table->json('data')->nullable(); // Additional data as JSON
            $table->string('current_step')->nullable();
            $table->foreignId('real_estate_listing_id')->nullable()->constrained('real_estate_listings')->cascadeOnDelete(); //Ensures foreign key integrity
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
