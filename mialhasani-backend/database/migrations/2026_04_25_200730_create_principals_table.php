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
        Schema::create('principals', function (Blueprint $table) {
            $table->id();
            $table->string('name');       // Nama Kepala Sekolah
            $table->string('role');       // Jabatan (ex: Kepala Sekolah MI Al-Hasani)
            $table->string('image');      // Foto
            $table->text('message');      // Isi Sambutan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('principals');
    }
};
