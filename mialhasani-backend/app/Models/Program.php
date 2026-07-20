<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    // Tambahkan baris ini untuk mengizinkan pengisian data
    protected $fillable = [
        'title', 
        'description', 
        'image', 
        'images', // Tambahkan images (JSON array)
        'category',
        'schedule',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'images' => 'array',
    ];
}