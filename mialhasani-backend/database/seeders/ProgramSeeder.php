<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            // --- PROGRAM KEAGAMAAN ---
            [
                'title' => 'Shalat Dhuha Rutin',
                'description' => 'Program pembiasaan shalat Dhuha setiap pagi sebelum KBM dimulai untuk menanamkan nilai spiritual, ketenangan jiwa, dan kedisiplinan waktu pada siswa.',
                'image' => 'dhuha.jpg',
                'category' => 'keagamaan'
            ],
            [
                'title' => 'Tahfidz Quran',
                'description' => 'Program unggulan hafalan Juz 30 (Juz Amma) dengan metode talqin dan murajaah rutin untuk mencetak generasi penghafal Al-Quran sejak dini.',
                'image' => 'tahfidz.jpg',
                'category' => 'keagamaan'
            ],
            [
                'title' => 'Shalat Zhuhur Berjamaah',
                'description' => 'Pelaksanaan shalat wajib berjamaah di masjid sekolah untuk melatih kebersamaan, kepemimpinan (adzan/iqomah), dan tata cara ibadah yang benar.',
                'image' => 'zhuhur.jpg',
                'category' => 'keagamaan'
            ],

            // --- PROGRAM AKADEMIK ---
            [
                'title' => 'Kurikulum Terpadu',
                'description' => 'Memadukan kurikulum Kemenag dan Kemendikbud untuk menghasilkan siswa yang seimbang antara IPTEK dan IMTAQ.',
                'image' => null, // Biasanya akademik tidak pakai foto, tapi boleh diisi jika ada
                'category' => 'akademik'
            ],
            [
                'title' => 'Les Tambahan (Bimbel)',
                'description' => 'Fasilitas bimbingan belajar khusus untuk kelas 6 dalam persiapan menghadapi ujian akhir sekolah agar hasil maksimal.',
                'image' => null,
                'category' => 'akademik'
            ],
            [
                'title' => 'Literasi Digital',
                'description' => 'Pengenalan dasar teknologi informasi dan penggunaan komputer secara bijak sejak dini di Lab Komputer MI Al-Hasani.',
                'image' => null,
                'category' => 'akademik'
            ],

            // --- PROGRAM EKSTRAKURIKULER ---
            [
                'title' => 'Pramuka',
                'description' => 'Ekstrakurikuler wajib untuk melatih kemandirian, kedisiplinan, kerjasama tim, dan jiwa kepemimpinan siswa melalui kegiatan alam dan keterampilan.',
                'image' => 'pramuka.jpg',
                'category' => 'ekstrakurikuler'
            ],
            [
                'title' => 'Seni Tari',
                'description' => 'Wadah bagi siswa untuk mengembangkan bakat seni sekaligus melestarikan budaya lokal melalui tarian tradisional maupun kreasi nusantara.',
                'image' => 'tari.jpg',
                'category' => 'ekstrakurikuler'
            ],
            [
                'title' => 'Pencak Silat',
                'description' => 'Beladiri tradisional yang diajarkan untuk menjaga kesehatan fisik, melatih fokus, pertahanan diri, dan menanamkan nilai sportivitas.',
                'image' => 'silat.jpg',
                'category' => 'ekstrakurikuler'
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}