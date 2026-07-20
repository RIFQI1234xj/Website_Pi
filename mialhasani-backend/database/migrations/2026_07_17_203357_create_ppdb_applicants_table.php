<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ppdb_applicants', function (Blueprint $table) {
            $table->id();
            $table->string('registration_id')->unique();
            $table->string('tahun_ajaran');
            $table->string('student_name');
            $table->string('birth_place');
            $table->date('birth_date');
            $table->enum('gender', ['Laki-laki', 'Perempuan']);
            $table->text('address');
            $table->string('parent_name');
            $table->string('whatsapp_number');
            $table->string('kk_file_name')->nullable();
            $table->longText('kk_file_data')->nullable();
            $table->string('akta_file_name')->nullable();
            $table->longText('akta_file_data')->nullable();
            $table->string('ktp_file_name')->nullable();
            $table->longText('ktp_file_data')->nullable();
            $table->string('ijazah_file_name')->nullable();
            $table->longText('ijazah_file_data')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppdb_applicants');
    }
};
