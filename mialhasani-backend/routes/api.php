<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\PrincipalController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\SchoolSettingController;
use App\Http\Controllers\Api\PpdbStatusController;

// ======================================
// RUTE PUBLIK (tanpa autentikasi)
// ======================================

// Auth
Route::post('/login', [AuthController::class, 'login']);

// Media gambar
Route::get('/media/download/{filename}', [MediaController::class, 'download'])->where('filename', '.*');
Route::get('/media/{filename}', [MediaController::class, 'show'])->where('filename', '.*');

// PPDB Status (Public)
Route::get('/ppdb-status', [PpdbStatusController::class, 'getStatus']);
Route::post('/ppdb/apply', [\App\Http\Controllers\Api\ApplicantController::class, 'store']);

// Guru
Route::get('/teachers', [TeacherController::class, 'index']);

// Program
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/featured', [ProgramController::class, 'featured']);

// Berita
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/latest', [NewsController::class, 'latest']);
Route::get('/news/{id}', [NewsController::class, 'show']);
Route::get('/news/{id}/related', [NewsController::class, 'related']);

// Galeri
Route::get('/galleries', [GalleryController::class, 'index']);

// Kepala Sekolah
Route::get('/principal', [PrincipalController::class, 'index']);

// Identitas Sekolah
Route::get('/school-settings', [SchoolSettingController::class, 'index']);

// ======================================
// RUTE ADMIN (dilindungi Sanctum)
// ======================================
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD Berita
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);

    // CRUD Guru
    Route::post('/teachers', [TeacherController::class, 'store']);
    Route::put('/teachers/{id}', [TeacherController::class, 'update']);
    Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);

    // CRUD Galeri
    Route::post('/galleries', [GalleryController::class, 'store']);
    Route::put('/galleries/{id}', [GalleryController::class, 'update']);
    Route::delete('/galleries/{id}', [GalleryController::class, 'destroy']);

    // CRUD Program
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::put('/programs/{id}', [ProgramController::class, 'update']);
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);

    // Update Kepala Sekolah
    Route::put('/principal', [PrincipalController::class, 'update']);

    // PPDB (Admin)
    Route::put('/ppdb-status/update', [PpdbStatusController::class, 'updateStatus']);
    
    // Admin Applicants
    Route::get('/applicants', [\App\Http\Controllers\Api\ApplicantController::class, 'index']);
    Route::put('/applicants/{id}/status', [\App\Http\Controllers\Api\ApplicantController::class, 'updateStatus']);
    Route::delete('/applicants/{id}', [\App\Http\Controllers\Api\ApplicantController::class, 'destroy']);

    // Update Pengaturan Sekolah
    Route::put('/school-settings', [SchoolSettingController::class, 'update']);
});
