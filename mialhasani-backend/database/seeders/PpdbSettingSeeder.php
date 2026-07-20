<?php

namespace Database\Seeders;

use App\Models\PpdbSetting;
use Illuminate\Database\Seeder;

// ==============================================
// Seeder: PpdbSettingSeeder
// ==============================================

class PpdbSettingSeeder extends Seeder
{
    public function run(): void
    {
        PpdbSetting::firstOrCreate([], [
            'tahun_ajaran' => '2026/2027',
            'is_open'      => true,
        ]);
    }
}
