<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::orderBy('order', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar Guru MI Al-Hasani',
            'data'    => $teachers
        ], 200);
    }
}