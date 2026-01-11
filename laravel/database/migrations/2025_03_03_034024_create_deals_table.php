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
        Schema::create('deals', static function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('amount', 10, 2);
            $table->decimal('security_deposit', 10, 2)->nullable();
            $table->timestamp('security_deposit_set_at')->nullable();

            // Security deposit workflow
            $table->boolean('is_security_deposit_made')->default(false);
            $table->timestamp('security_deposit_made_at')->nullable();
            $table->boolean('is_security_deposit_confirmed')->default(false);
            $table->timestamp('security_deposit_confirmed_at')->nullable();

            // Condition day workflow
            $table->timestamp('condition_day')->nullable();
            $table->timestamp('condition_day_selected_at')->nullable();
            $table->boolean('is_condition_day_confirmed')->default(false);
            $table->timestamp('condition_day_confirmed_at')->nullable();

            // Possession day workflow
            $table->timestamp('possession_day')->nullable();
            $table->timestamp('possession_day_selected_at')->nullable();
            $table->boolean('is_possession_day_confirmed')->default(false);
            $table->timestamp('possession_day_confirmed_at')->nullable();

            // Deal status
            $table->boolean('is_broken')->default(false);
            $table->timestamp('broken_at')->nullable();
            $table->mediumText('deal_message')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();

            // Relation to real estate listing
            $table->foreignId('real_estate_listing_id')
                ->nullable()
                ->constrained('real_estate_listings')
                ->cascadeOnDelete();

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
