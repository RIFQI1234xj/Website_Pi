<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $galleries = [
            [
                'title' => 'Peringatan Maulid Nabi',
                'category' => 'Religi',
                'image' => 'galeri-maulid.jpg',
                'photos' => [
                    'https://picsum.photos/seed/maulid1/800/600',
                    'https://picsum.photos/seed/maulid2/800/600',
                    'https://picsum.photos/seed/maulid3/800/600',
                    'https://picsum.photos/seed/maulid4/800/600',
                ],
                'description' => 'Kegiatan peringatan Maulid Nabi Muhammad SAW yang diisi dengan pembacaan shalawat, tausiyah, dan makan bersama seluruh siswa dan guru di lapangan utama sekolah.'
            ],
            [
                'title' => 'Juara Umum Porseni',
                'category' => 'Prestasi',
                'image' => 'galeri-prestasi.jpg',
                'photos' => [
                    'https://picsum.photos/seed/porseni1/800/600',
                    'https://picsum.photos/seed/porseni2/800/600',
                    'https://picsum.photos/seed/porseni3/800/600',
                    'https://picsum.photos/seed/porseni4/800/600',
                    'https://picsum.photos/seed/porseni5/800/600',
                ],
                'description' => 'Momen kebanggaan saat kontingen MI Al-Hasani berhasil meraih Juara Umum pada ajang Pekan Olahraga dan Seni (Porseni) tingkat kecamatan.'
            ],
            [
                'title' => 'Kunjungan Edukatif Museum',
                'category' => 'Acara',
                'image' => 'galeri-museum.jpg',
                'photos' => [
                    'https://picsum.photos/seed/museum1/800/600',
                    'https://picsum.photos/seed/museum2/800/600',
                    'https://picsum.photos/seed/museum3/800/600',
                ],
                'description' => 'Siswa kelas 6 melakukan *field trip* ke Museum Nasional untuk mengenal lebih dekat sejarah perjuangan bangsa dan melengkapi tugas akhir semester.'
            ],
            [
                'title' => 'Kegiatan Pramuka Berkemah',
                'category' => 'Ekskul',
                'image' => 'galeri-pramuka.jpg',
                'photos' => [
                    'https://picsum.photos/seed/pramuka1/800/600',
                    'https://picsum.photos/seed/pramuka2/800/600',
                    'https://picsum.photos/seed/pramuka3/800/600',
                    'https://picsum.photos/seed/pramuka4/800/600',
                ],
                'description' => 'Kegiatan Perkemahan Jumat Sabtu (Perjusa) untuk melatih kemandirian, kedisiplinan, dan kekompakan tim anggota Pramuka Penggalang MI Al-Hasani.'
            ],
            [
                'title' => 'Praktek Shalat Berjamaah',
                'category' => 'Kegiatan',
                'image' => 'galeri-shalat.jpg',
                'photos' => [
                    'https://picsum.photos/seed/shalat1/800/600',
                    'https://picsum.photos/seed/shalat2/800/600',
                    'https://picsum.photos/seed/shalat3/800/600',
                ],
                'description' => 'Evaluasi praktek ibadah shalat berjamaah untuk kelas 3 sebagai bagian dari penilaian praktik mata pelajaran Fiqih.'
            ],
        ];

        foreach ($galleries as $item) {
            Gallery::create($item);
        }
    }
}