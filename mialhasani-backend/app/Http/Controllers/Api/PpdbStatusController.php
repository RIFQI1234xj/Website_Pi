<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PpdbSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ==============================================
// Controller: PpdbStatusController
// ==============================================

class PpdbStatusController extends Controller
{
    private function getCurrentAcademicYear(): string
    {
        $month = (int) date('n');
        $year = (int) date('Y');
        $startYear = $month >= 7 ? $year : $year - 1;

        return $startYear . '/' . ($startYear + 1);
    }

    public function getStatus(): JsonResponse
    {
        $setting = PpdbSetting::query()->firstOrCreate([], [
            'tahun_ajaran' => $this->getCurrentAcademicYear(),
            'is_open'      => true,
        ]);

        if ($setting->tahun_ajaran !== $this->getCurrentAcademicYear()) {
            $setting->tahun_ajaran = $this->getCurrentAcademicYear();
            $setting->save();
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'tahun_ajaran' => $this->getCurrentAcademicYear(),
                'is_open'      => $setting->is_open,
            ],
        ], 200);
    }

    public function updateStatus(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tahun_ajaran' => 'sometimes|required|string|max:20',
            'is_open'      => 'sometimes|required|boolean',
        ]);

        $setting = PpdbSetting::query()->firstOrCreate([], [
            'tahun_ajaran' => $this->getCurrentAcademicYear(),
            'is_open'      => true,
        ]);

        $setting->fill($validated);

        $setting->tahun_ajaran = $this->getCurrentAcademicYear();
        $setting->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Pengaturan PPDB berhasil diperbarui.',
            'data'    => [
                'tahun_ajaran' => $this->getCurrentAcademicYear(),
                'is_open'      => $setting->is_open,
            ],
        ], 200);
    }
}
