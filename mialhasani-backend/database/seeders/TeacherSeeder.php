<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
{
    $teachers = [
        [
            'name' => 'Eneng Heti Nurhayati, S.Pd.I',
            'role' => 'Kepala Sekolah',
            'description' => 'Manajemen Sekolah',
            'image' => 'eti.jpg',
            'order' => 1
        ],
        [
            'name' => 'Siti Aminah, S.Pd',
            'role' => 'Guru Kelas 1',
            'description' => 'TEMATIK',
            'image' => 'aminah.jpg',
            'order' => 2
        ],
        [
            'name' => 'Budi Santoso, S.Pd',
            'role' => 'Guru PJOK',
            'description' => 'PENDIDIKAN JASMANI',
            'image' => 'budi.jpg',
            'order' => 3
        ],
        [
            'name' => 'Rina Wati, S.Ag',
            'role' => 'Guru PAI',
            'description' => 'PENDIDIKAN AGAMA ISLAM',
            'image' => 'rina.jpg',
            'order' => 4
        ],
        [
            'name' => 'Ahmad Fauzi, S.Pd',
            'role' => 'Guru Matematika',
            'description' => 'MATEMATIKA & SAINS',
            'image' => 'fauzi.jpg',
            'order' => 5
        ],
        [
            'name' => 'Dewi Sartika, S.Pd',
            'role' => 'Guru B. Inggris',
            'description' => 'BAHASA INGGRIS',
            'image' => 'dewi.jpg',
            'order' => 6
        ],
        [
            'name' => 'Ujang Solihin',
            'role' => 'Staff Tata Usaha',
            'description' => 'ADMINISTRASI',
            'image' => 'ujang.jpg',
            'order' => 7
        ],
        [
            'name' => 'Nurul Hidayah, S.Pd',
            'role' => 'Guru Kelas 2',
            'description' => 'TEMATIK',
            'image' => 'nurul.jpg',
            'order' => 8
        ],
    ];

    foreach ($teachers as $teacher) {
        \App\Models\Teacher::create($teacher);
    }
}
}
