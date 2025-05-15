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
        Schema::create('deals',function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Name of the deal
            $table->decimal('amount', 10, 2); // Deal amount
            $table->decimal('security_deposit', 10, 2)->nullable(); // Security Deposit field
            $table->timestamp('possession_day')->nullable(); //Possession day
            $table->boolean('is_possession_day_confirmed')->default(false);;  //Confirmation Condition day
            $table->timestamp('condition_day')->nullable(); //Condition day
            $table->boolean('is_condition_day_confirmed')->default(false);;  //Confirmation Condition day
            $table->boolean('is_confirmed')->default(false); // ✅ Confirmation status
            $table->boolean('is_made')->default(false); // ✅ Completion status
            $table->json('data')->nullable(); // Additional data as JSON
            $table->string('current_step')->nullable();
            $table->foreignId('real_estate_listing_id')->nullable()->constrained('real_estate_listings')->cascadeOnDelete(); //Ensures foreign key integrity
            $table->timestamps();
        }, 'deals');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
