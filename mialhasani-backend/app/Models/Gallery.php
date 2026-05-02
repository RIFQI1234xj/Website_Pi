<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    // Izinkan kolom-kolom ini diisi data
    protected $fillable = ['title', 'category', 'image', 'photos', 'description'];

    // Cast kolom 'photos' agar otomatis jadi array PHP / JSON
    protected $casts = [
        'photos' => 'array',
    ];
}