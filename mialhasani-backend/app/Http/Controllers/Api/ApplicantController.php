<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PpdbApplicant;
use App\Models\PpdbSetting;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\DB;

class ApplicantController extends Controller
{
    /**
     * Tampilkan semua data pendaftar untuk Admin
     */
    public function index()
    {
        $applicants = PpdbApplicant::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $applicants
        ]);
    }

    /**
     * Simpan data pendaftar baru dari Frontend (Public)
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'studentName' => 'required|string|max:255',
            'birthPlace' => 'required|string|max:255',
            'birthDate' => 'required|date',
            'gender' => 'required|in:Laki-laki,Perempuan',
            'address' => 'required|string',
            'parentName' => 'required|string|max:255',
            'whatsappNumber' => 'required|string|max:20',
            // Validasi string panjang (Base64 file maksimal ~5MB atau sekitar 7.500.000 karakter)
            'kkFileName' => 'nullable|string|max:255',
            'kkFileData' => 'nullable|string|max:7500000',
            'aktaFileName' => 'nullable|string|max:255',
            'aktaFileData' => 'nullable|string|max:7500000',
            'ktpFileName' => 'nullable|string|max:255',
            'ktpFileData' => 'nullable|string|max:7500000',
            'ijazahFileName' => 'nullable|string|max:255',
            'ijazahFileData' => 'nullable|string|max:7500000',
        ]);

        // Ambil tahun ajaran yang aktif
        $setting = PpdbSetting::first();
        if (!$setting || !$setting->is_open) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pendaftaran PPDB saat ini sedang ditutup.'
            ], 403);
        }
        $tahunAjaran = $setting->tahun_ajaran;

        // Auto-generate Registration ID: PPDB-2026-001
        $yearStr = substr($tahunAjaran, 0, 4); // Ambil tahun awal dari 2026/2027
        if (empty($yearStr)) {
            $yearStr = date('Y');
        }

        // Cari nomor urut terakhir di tahun yang sama menggunakan Lock untuk concurrency
        $lastApplicant = PpdbApplicant::where('tahun_ajaran', $tahunAjaran)
                                      ->orderBy('id', 'desc')
                                      ->first();
        
        $nextNumber = 1;
        if ($lastApplicant) {
            // Ambil 3 digit terakhir dari registration_id
            $lastId = $lastApplicant->registration_id;
            $parts = explode('-', $lastId);
            if (count($parts) === 3) {
                $lastNumber = (int) $parts[2];
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = $lastApplicant->id + 1; // Fallback
            }
        }
        
        $registrationId = 'PPDB-' . $yearStr . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        // Helper function untuk upload base64 ke Cloudinary
        $saveBase64 = function($base64Data, $type) use ($registrationId) {
            if (!$base64Data) return null;
            if (strpos($base64Data, 'data:') !== 0) return $base64Data; // Bukan base64, mungkin sudah URL

            try {
                $uploadedFileUrl = Cloudinary::upload($base64Data, [
                    'folder' => 'applicants'
                ])->getSecurePath();
                return $uploadedFileUrl;
            } catch (\Exception $e) {
                return null;
            }
        };

        $applicant = PpdbApplicant::create([
            'registration_id' => $registrationId,
            'tahun_ajaran' => $tahunAjaran,
            'student_name' => $validated['studentName'],
            'birth_place' => $validated['birthPlace'],
            'birth_date' => $validated['birthDate'],
            'gender' => $validated['gender'],
            'address' => $validated['address'],
            'parent_name' => $validated['parentName'],
            'whatsapp_number' => $validated['whatsappNumber'],
            'kk_file_name' => $validated['kkFileName'] ?? null,
            'kk_file_data' => $saveBase64($validated['kkFileData'] ?? null, 'kk'),
            'akta_file_name' => $validated['aktaFileName'] ?? null,
            'akta_file_data' => $saveBase64($validated['aktaFileData'] ?? null, 'akta'),
            'ktp_file_name' => $validated['ktpFileName'] ?? null,
            'ktp_file_data' => $saveBase64($validated['ktpFileData'] ?? null, 'ktp'),
            'ijazah_file_name' => $validated['ijazahFileName'] ?? null,
            'ijazah_file_data' => $saveBase64($validated['ijazahFileData'] ?? null, 'ijazah'),
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pendaftaran berhasil dikirim.',
            'data' => $applicant
        ], 201);
    }

    /**
     * Update status pendaftar
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $applicant = PpdbApplicant::findOrFail($id);
        $applicant->update(['status' => $validated['status']]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status pendaftar berhasil diperbarui.',
            'data' => $applicant
        ]);
    }

    /**
     * Hapus pendaftar beserta file-filenya
     */
    public function destroy($id)
    {
        $applicant = PpdbApplicant::findOrFail($id);

        // Helper untuk menghapus file Cloudinary/fisik berdasarkan URL yang tersimpan
        $deleteFile = function($fileUrl) {
            if ($fileUrl) {
                if (strpos($fileUrl, 'res.cloudinary.com') !== false) {
                    preg_match('/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/', $fileUrl, $matches);
                    if (isset($matches[1])) {
                        try {
                            cloudinary()->uploadApi()->destroy($matches[1]);
                        } catch (\Exception $e) {}
                    }
                } else if (strpos($fileUrl, '/api/media/applicants/') !== false) {
                    $filename = str_replace('/api/media/', '', $fileUrl);
                    $filePath = public_path('images/' . $filename);
                    if (file_exists($filePath)) {
                        @unlink($filePath);
                    }
                }
            }
        };

        // Hapus file fisik gambar yang diunggah
        $deleteFile($applicant->kk_file_data);
        $deleteFile($applicant->akta_file_data);
        $deleteFile($applicant->ktp_file_data);
        $deleteFile($applicant->ijazah_file_data);

        // Hapus data dari database
        $applicant->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data pendaftar beserta file dokumen berhasil dihapus.'
        ]);
    }
}
