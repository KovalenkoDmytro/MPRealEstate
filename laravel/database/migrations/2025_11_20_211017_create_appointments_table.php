<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    public function up(): void {
        Schema::create('appointments', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('real_estate_listing_id')->constrained('real_estate_listings')->onDelete('cascade');
            $table->timestamp('scheduled_at');
            $table->string('status')->default('pending'); // pending | accepted | rejected
            $table->string('access_code')->nullable();     // only for accepted
            $table->text('rejection_reason')->nullable();   // only for rejected
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('appointments');
    }
}
