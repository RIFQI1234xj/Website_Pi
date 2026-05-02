<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        // Mengambil semua data program dari database
        $programs = Program::all();

        // Mengirimkannya dalam bentuk JSON
        return response()->json([
            'success' => true,
            'message' => 'Daftar Program MI Al-Hasani',
            'data'    => $programs
        ], 200);
    }
    public function featured()
    {
        // Ambil 1 program unggulan
        $program = Program::first(); 
        
        return response()->json([
            'success' => true,
            'data'    => $program
        ], 200);
    }
}