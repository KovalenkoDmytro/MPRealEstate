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
            $table->string('name');
            $table->decimal('amount', 10, 2);
            $table->decimal('security_deposit', 10, 2)->nullable();
            $table->boolean('is_security_deposit_made')->default(false);
            $table->boolean('is_security_deposit_confirmed')->default(false);
            $table->timestamp('possession_day')->nullable();
            $table->boolean('is_possession_day_confirmed')->default(false);
            $table->timestamp('condition_day')->nullable();
            $table->boolean('is_condition_day_confirmed')->default(false);
            $table->boolean('is_broken')->default(false);
            $table->mediumText('seller_message')->nullable();
            $table->boolean('is_completed')->default(false);
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
