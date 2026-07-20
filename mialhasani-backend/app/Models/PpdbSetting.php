<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ==============================================
// Model: PpdbSetting
// ==============================================

class PpdbSetting extends Model
{
    use HasFactory;

    protected $table = 'ppdb_settings';

    protected $fillable = [
        'tahun_ajaran',
        'is_open',
    ];

    protected $casts = [
        'is_open' => 'boolean',
    ];
}
