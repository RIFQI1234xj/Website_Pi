<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PpdbApplicant;
use App\Models\PpdbSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
            'previousSchool' => 'nullable|string|max:255',
            'nisn' => 'nullable|string|max:50',
            'fatherName' => 'nullable|string|max:255',
            'fatherNik' => 'nullable|string|max:20',
            'fatherOccupation' => 'nullable|string|max:255',
            'fatherEducation' => 'nullable|string|max:255',
            'fatherIncome' => 'nullable|string|max:255',
            'motherName' => 'nullable|string|max:255',
            'motherNik' => 'nullable|string|max:20',
            'motherOccupation' => 'nullable|string|max:255',
            'motherEducation' => 'nullable|string|max:255',
            'motherIncome' => 'nullable|string|max:255',
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

        // Validasi Ekstensi dan MIME Type dari file Base64
        $fileFields = ['kkFileData', 'aktaFileData', 'ktpFileData', 'ijazahFileData'];
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

        foreach ($fileFields as $field) {
            $base64Data = $validated[$field] ?? null;
            if ($base64Data && strpos($base64Data, 'data:') === 0) {
                preg_match('/^data:([a-zA-Z0-9\/\-\+]+);base64,/', $base64Data, $matches);
                if (isset($matches[1])) {
                    $mimeType = strtolower($matches[1]);
                    if (!in_array($mimeType, $allowedMimeTypes)) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Format file tidak diizinkan. Sistem hanya menerima JPG, PNG, atau PDF.'
                        ], 422);
                    }
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Format data unggahan tidak valid.'
                    ], 422);
                }
            }
        }

        // Ambil tahun ajaran yang aktif
        $setting = PpdbSetting::first();
        if (!$setting || !$setting->is_open) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pendaftaran PPDB saat ini sedang ditutup.'
            ], 403);
        }
        $tahunAjaran = $setting->tahun_ajaran;

        // Validasi pendaftaran ganda (1 user hanya boleh 1 kali mendaftar per tahun ajaran)
        $user = $request->user();
        if ($user) {
            $existingApplicant = PpdbApplicant::where('user_id', $user->id)
                                              ->where('tahun_ajaran', $tahunAjaran)
                                              ->exists();
            if ($existingApplicant) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Akun Anda sudah terdaftar untuk tahun ajaran ' . $tahunAjaran . '.'
                ], 400);
            }
        }

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
                $uploadedFileUrl = cloudinary()->uploadApi()->upload($base64Data, [
                    'folder' => 'applicants'
                ])['secure_url'];
                return $uploadedFileUrl;
            } catch (\Exception $e) {
                return $base64Data; // Fallback ke base64 jika gagal upload (local dev)
            }
        };

        $applicant = PpdbApplicant::create([
            'user_id'         => $request->user()?->id ?? null,
            'registration_id' => $registrationId,
            'tahun_ajaran' => $tahunAjaran,
            'student_name' => $validated['studentName'],
            'birth_place' => $validated['birthPlace'],
            'birth_date' => $validated['birthDate'],
            'gender' => $validated['gender'],
            'address' => $validated['address'],
            'parent_name' => $validated['parentName'],
            'whatsapp_number' => $validated['whatsappNumber'],
            'previous_school' => $validated['previousSchool'] ?? null,
            'nisn' => $validated['nisn'] ?? null,
            'father_name' => $validated['fatherName'] ?? null,
            'father_nik' => $validated['fatherNik'] ?? null,
            'father_occupation' => $validated['fatherOccupation'] ?? null,
            'father_education' => $validated['fatherEducation'] ?? null,
            'father_income' => $validated['fatherIncome'] ?? null,
            'mother_name' => $validated['motherName'] ?? null,
            'mother_nik' => $validated['motherNik'] ?? null,
            'mother_occupation' => $validated['motherOccupation'] ?? null,
            'mother_education' => $validated['motherEducation'] ?? null,
            'mother_income' => $validated['motherIncome'] ?? null,
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

    /**
     * Ambil data pendaftaran milik user yang sedang login
     */
    public function myApplication(Request $request)
    {
        $user = $request->user();

        $applicant = PpdbApplicant::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'status' => 'success',
            'data'   => $applicant // null jika belum pernah mendaftar
        ]);
    }

    /**
     * Update data pendaftaran milik user yang sedang login (hanya jika status pending)
     */
    public function updateMyApplication(Request $request)
    {
        $user = $request->user();

        $applicant = PpdbApplicant::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$applicant) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data pendaftaran tidak ditemukan.'
            ], 404);
        }

        if ($applicant->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak dapat diubah karena status sudah diverifikasi.'
            ], 403);
        }

        // Validasi input
        $validated = $request->validate([
            'studentName' => 'required|string|max:255',
            'birthPlace' => 'required|string|max:255',
            'birthDate' => 'required|date',
            'gender' => 'required|in:Laki-laki,Perempuan',
            'address' => 'required|string',
            'parentName' => 'required|string|max:255',
            'whatsappNumber' => 'required|string|max:20',
            'previousSchool' => 'nullable|string|max:255',
            'nisn' => 'nullable|string|max:50',
            'fatherName' => 'nullable|string|max:255',
            'fatherNik' => 'nullable|string|max:20',
            'fatherOccupation' => 'nullable|string|max:255',
            'fatherEducation' => 'nullable|string|max:255',
            'fatherIncome' => 'nullable|string|max:255',
            'motherName' => 'nullable|string|max:255',
            'motherNik' => 'nullable|string|max:20',
            'motherOccupation' => 'nullable|string|max:255',
            'motherEducation' => 'nullable|string|max:255',
            'motherIncome' => 'nullable|string|max:255',
            // File adalah opsional saat update. Jika ada dikirim string panjang, berarti gambar baru.
            'kkFileName' => 'nullable|string|max:255',
            'kkFileData' => 'nullable|string|max:7500000',
            'aktaFileName' => 'nullable|string|max:255',
            'aktaFileData' => 'nullable|string|max:7500000',
            'ktpFileName' => 'nullable|string|max:255',
            'ktpFileData' => 'nullable|string|max:7500000',
            'ijazahFileName' => 'nullable|string|max:255',
            'ijazahFileData' => 'nullable|string|max:7500000',
        ]);

        // Validasi Ekstensi dan MIME Type dari file Base64
        $fileFields = ['kkFileData', 'aktaFileData', 'ktpFileData', 'ijazahFileData'];
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

        foreach ($fileFields as $field) {
            $base64Data = $validated[$field] ?? null;
            if ($base64Data && strpos($base64Data, 'data:') === 0) {
                preg_match('/^data:([a-zA-Z0-9\/\-\+]+);base64,/', $base64Data, $matches);
                if (isset($matches[1])) {
                    $mimeType = strtolower($matches[1]);
                    if (!in_array($mimeType, $allowedMimeTypes)) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Format file tidak diizinkan. Sistem hanya menerima JPG, PNG, atau PDF.'
                        ], 422);
                    }
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Format data unggahan tidak valid.'
                    ], 422);
                }
            }
        }

        $saveBase64 = function($base64Data, $type) {
            if (!$base64Data) return null;
            if (strpos($base64Data, 'data:') !== 0) return $base64Data; // Bukan base64, mungkin sudah URL

            try {
                $uploadedFileUrl = cloudinary()->uploadApi()->upload($base64Data, [
                    'folder' => 'applicants'
                ])['secure_url'];
                return $uploadedFileUrl;
            } catch (\Exception $e) {
                return $base64Data; // Fallback ke base64 jika gagal upload (local dev)
            }
        };

        // Helper untuk menghapus file Cloudinary lama
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

        // Update basic data
        $applicant->student_name = $validated['studentName'];
        $applicant->birth_place = $validated['birthPlace'];
        $applicant->birth_date = $validated['birthDate'];
        $applicant->gender = $validated['gender'];
        $applicant->address = $validated['address'];
        $applicant->parent_name = $validated['parentName'];
        $applicant->whatsapp_number = $validated['whatsappNumber'];
        $applicant->previous_school = $validated['previousSchool'] ?? $applicant->previous_school;
        $applicant->nisn = $validated['nisn'] ?? $applicant->nisn;
        $applicant->father_name = $validated['fatherName'] ?? $applicant->father_name;
        $applicant->father_nik = $validated['fatherNik'] ?? $applicant->father_nik;
        $applicant->father_occupation = $validated['fatherOccupation'] ?? $applicant->father_occupation;
        $applicant->father_education = $validated['fatherEducation'] ?? $applicant->father_education;
        $applicant->father_income = $validated['fatherIncome'] ?? $applicant->father_income;
        $applicant->mother_name = $validated['motherName'] ?? $applicant->mother_name;
        $applicant->mother_nik = $validated['motherNik'] ?? $applicant->mother_nik;
        $applicant->mother_occupation = $validated['motherOccupation'] ?? $applicant->mother_occupation;
        $applicant->mother_education = $validated['motherEducation'] ?? $applicant->mother_education;
        $applicant->mother_income = $validated['motherIncome'] ?? $applicant->mother_income;

        // Update file if new base64 data provided
        if (!empty($validated['kkFileData']) && strpos($validated['kkFileData'], 'data:') === 0) {
            $deleteFile($applicant->kk_file_data); // Hapus file lama di Cloudinary
            $applicant->kk_file_name = $validated['kkFileName'];
            $applicant->kk_file_data = $saveBase64($validated['kkFileData'], 'kk');
        }
        if (!empty($validated['aktaFileData']) && strpos($validated['aktaFileData'], 'data:') === 0) {
            $deleteFile($applicant->akta_file_data); // Hapus file lama di Cloudinary
            $applicant->akta_file_name = $validated['aktaFileName'];
            $applicant->akta_file_data = $saveBase64($validated['aktaFileData'], 'akta');
        }
        if (!empty($validated['ktpFileData']) && strpos($validated['ktpFileData'], 'data:') === 0) {
            $deleteFile($applicant->ktp_file_data); // Hapus file lama di Cloudinary
            $applicant->ktp_file_name = $validated['ktpFileName'];
            $applicant->ktp_file_data = $saveBase64($validated['ktpFileData'], 'ktp');
        }
        if (!empty($validated['ijazahFileData']) && strpos($validated['ijazahFileData'], 'data:') === 0) {
            $deleteFile($applicant->ijazah_file_data); // Hapus file lama di Cloudinary
            $applicant->ijazah_file_name = $validated['ijazahFileName'];
            $applicant->ijazah_file_data = $saveBase64($validated['ijazahFileData'], 'ijazah');
        }

        $applicant->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Data pendaftaran berhasil diperbarui.',
            'data' => $applicant
        ]);
    }
}
