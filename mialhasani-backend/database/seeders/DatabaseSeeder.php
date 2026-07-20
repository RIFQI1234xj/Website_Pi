<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Membuat User Admin Default (Opsional, bawaan Laravel)
        User::factory()->create([
            'name' => 'Admin MI Al-Hasani',
            'email' => 'admin@example.com',
        ]);

        // 2. MEMANGGIL SEEDER LAINNYA
        // Inilah bagian terpenting agar data Guru dan Program muncul kembali
        $this->call([
            TeacherSeeder::class, // Mengisi data Guru & Staff
            ProgramSeeder::class, // Mengisi data Program Sekolah
            NewsSeeder::class, // Mengisi data Berita
            GallerySeeder::class, // Mengisi data Galeri
            PrincipalSeeder::class, // Mengisi data Kepala Sekolah
            PpdbSettingSeeder::class, // Mengisi data konfigurasi PPDB
        ]);
       
    }
}
