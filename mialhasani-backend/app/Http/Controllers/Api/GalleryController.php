<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;

class GalleryController extends Controller
{
    public function index()
    {
        // Ambil semua foto galeri dari yang terbaru ke terlama
        $galleries = Gallery::latest()->get(); 
        
        return response()->json([
            'success' => true,
            'message' => 'Daftar Galeri MI Al-Hasani',
            'data'    => $galleries
        ], 200);
    }
}