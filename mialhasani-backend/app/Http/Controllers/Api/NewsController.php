<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::latest()->get(); // Ambil semua berita, urutkan dari yang terbaru
        
        return response()->json([
            'success' => true,
            'data'    => $news
        ], 200);
        
    }

    /**
     * Ambil detail satu berita berdasarkan ID
     */
    public function show($id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $news
        ], 200);
    }

    /**
     * Ambil berita terkait (kategori sama, kecuali berita yang sedang dibaca)
     */
    public function related($id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'success' => false,
                'data'    => []
            ], 404);
        }

        $related = News::where('category', $news->category)
            ->where('id', '!=', $id)
            ->latest()
            ->take(3)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $related
        ], 200);
    }

    public function latest()
    {
        // Ambil 3 berita terbaru
        $news = News::latest()->take(3)->get();
        
        return response()->json([
            'success' => true,
            'data'    => $news
        ], 200);
    }
}
