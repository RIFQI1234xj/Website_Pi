<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Principal;

class PrincipalSeeder extends Seeder
{
    public function run(): void
    {
        Principal::create([
            'name' => 'Eneng Heti Nurhayati, S.Pd.I',
            'role' => 'Kepala Sekolah MI Al-Hasani',
            'image' => 'kepsek.jpg',
            'message' => "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nDi era digital saat ini, penyampaian informasi tidak terbatas hanya pada surat, namun media sosial dan website juga sangat berpengaruh. Oleh karena itu, MI Al-Hasani merilis website resmi ini sebagai sarana publikasi dan komunikasi.\n\nDengan adanya website ini, semoga informasi-informasi mengenai sekolah dapat diakses dengan mudah oleh masyarakat luas. Kami juga berharap platform ini dapat menjadi wadah untuk menampilkan prestasi dan kreativitas peserta didik.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh."
        ]);
    }
}