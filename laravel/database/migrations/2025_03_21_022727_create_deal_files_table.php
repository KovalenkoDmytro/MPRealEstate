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
        Schema::create('deal_files', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('deal_id')->constrained()->onDelete('cascade'); // Link file to deal
            $table->string('file_name'); // Original filename
            $table->string('file_path'); // Path in storage
            $table->string('author_email');
            $table->string('author_name');
            $table->string('file_type')->nullable(); // e.g., PDF, DOCX, Image
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deal_files');
    }
};
