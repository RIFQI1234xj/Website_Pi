<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $news = [
            [
                'title' => 'Siswa MI Al-Hasani Juara 1 Tahfidz Quran Tingkat Kota',
                'category' => 'Prestasi',
                'image' => 'berita-tahfidz.jpg', // Nanti siapkan gambarnya di folder public/images React
                'excerpt' => 'Alhamdulillah, ananda Ahmad berhasil meraih juara pertama dalam lomba Tahfidz...',
                'content' => 'Isi berita lengkap tentang kemenangan Ahmad dalam lomba tahfidz tingkat kota...',
                'author' => 'Admin',
                'date' => '12 Oktober 2023'
            ],
            [
                'title' => 'Kegiatan Shalat Dhuha Berjamaah Rutin',
                'category' => 'Kegiatan',
                'image' => 'berita-dhuha.jpg',
                'excerpt' => 'Pembiasaan shalat Dhuha setiap pagi sebelum KBM dimulai untuk membentuk karakter...',
                'content' => 'Isi berita lengkap mengenai program shalat dhuha...',
                'author' => 'Admin',
                'date' => '10 Oktober 2023'
            ],
            [
                'title' => 'Penerimaan Peserta Didik Baru (PPDB) 2024',
                'category' => 'Pengumuman',
                'image' => 'berita-ppdb.jpg',
                'excerpt' => 'Telah dibuka pendaftaran siswa baru tahun ajaran 2024/2025. Segera daftar...',
                'content' => 'Informasi lengkap syarat dan cara pendaftaran PPDB MI Al-Hasani...',
                'author' => 'Admin',
                'date' => '01 Oktober 2023'
            ],
        ];

        foreach ($news as $item) {
            News::create($item);
        }
    }
}