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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('name');         // Untuk Nama (Eneng Heti Nurhayati, dll)
            $table->string('role');         // Untuk Jabatan (Kepala Sekolah, dll)
            $table->string('description');  // Untuk Deskripsi (Manajemen Sekolah, dll)
            $table->string('image');        // Untuk menyimpan nama file foto
            $table->integer('order')->default(0); // Untuk mengatur urutan tampil
            $table->timestamps();
        });
    }
};
