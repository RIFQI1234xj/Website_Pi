<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    // Kolom yang boleh diisi secara massal
    protected $fillable = [
        'name',
        'role',
        'description',
        'image',
        'order',
        'subject',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}