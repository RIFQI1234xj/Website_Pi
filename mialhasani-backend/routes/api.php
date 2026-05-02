<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\PrincipalController;

// Rute untuk mengambil data guru
Route::get('/teachers', [TeacherController::class, 'index']);

// Rute untuk mengambil data program
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/featured', [ProgramController::class, 'featured']);

// Rute untuk berita (PENTING: rute spesifik harus di atas rute wildcard {id})
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/latest', [NewsController::class, 'latest']);
Route::get('/news/{id}', [NewsController::class, 'show']);
Route::get('/news/{id}/related', [NewsController::class, 'related']);

// Rute untuk galeri
Route::get('/galleries', [GalleryController::class, 'index']);

// Rute untuk mengambil data kepala sekolah
Route::get('/principal', [PrincipalController::class, 'index']);

