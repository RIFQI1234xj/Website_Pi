<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpdbApplicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'tahun_ajaran',
        'student_name',
        'birth_place',
        'birth_date',
        'gender',
        'address',
        'parent_name',
        'whatsapp_number',
        'kk_file_name',
        'kk_file_data',
        'akta_file_name',
        'akta_file_data',
        'ktp_file_name',
        'ktp_file_data',
        'ijazah_file_name',
        'ijazah_file_data',
        'status',
    ];
}
