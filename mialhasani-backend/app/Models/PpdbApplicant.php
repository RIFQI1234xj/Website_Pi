<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpdbApplicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'registration_id',
        'tahun_ajaran',
        'student_name',
        'birth_place',
        'birth_date',
        'gender',
        'address',
        'parent_name',
        'whatsapp_number',
        'previous_school',
        'nisn',
        'father_name',
        'father_nik',
        'father_occupation',
        'father_education',
        'father_income',
        'mother_name',
        'mother_nik',
        'mother_occupation',
        'mother_education',
        'mother_income',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
