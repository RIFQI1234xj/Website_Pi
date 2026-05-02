<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Principal;

class PrincipalController extends Controller
{
    public function index()
    {
        $principal = Principal::first(); // Ambil 1 data teratas
        
        return response()->json([
            'success' => true,
            'data'    => $principal
        ], 200);
    }
}