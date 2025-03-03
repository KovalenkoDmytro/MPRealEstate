<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('deals', function (Blueprint $table) {

            // Add current_step column instead of active_step_id
            $table->enum('current_step', [
                'Making or Considering an Offer',
                'Financing Formalities',
                'Inspections',
                'Removing Conditions',
                'Lawyer Paperwork',
                'Closing the Deal',
            ])->default('Making or Considering an Offer');
        });
    }

    public function down(): void
    {
        Schema::table('deals', function (Blueprint $table) {
            // Drop current_step if we need to roll back
            $table->dropColumn('current_step');
        });
    }
};
