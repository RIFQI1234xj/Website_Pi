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
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title');       // Judul berita
            $table->string('category');    // Kategori (Prestasi, Kegiatan, Pengumuman)
            $table->string('image');       // Nama file gambar sampul
            $table->text('excerpt');       // Cuplikan singkat berita (untuk di halaman depan)
            $table->text('content')->nullable(); // Isi lengkap berita (untuk nanti jika diklik)
            $table->string('author')->default('Admin'); // Penulis
            $table->string('date');        // Tanggal publikasi (format teks agar sesuai desainmu)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
