<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan kolom 'photos' bertipe JSON untuk menyimpan array foto per album galeri.
     */
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->json('photos')->nullable()->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->dropColumn('photos');
        });
    }
};
