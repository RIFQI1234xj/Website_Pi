<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ==============================================
// Migration: ppdb_settings
// Menyimpan konfigurasi status pendaftaran PPDB
// dan tahun ajaran yang sedang aktif.
// ==============================================

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('ppdb_settings')) {
            Schema::create('ppdb_settings', function (Blueprint $table) {
                $table->id();
                $table->string('tahun_ajaran')->default('2026/2027');
                $table->boolean('is_open')->default(false);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppdb_settings');
    }
};
