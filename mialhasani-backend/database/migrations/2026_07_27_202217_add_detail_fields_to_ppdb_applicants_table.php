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
        Schema::table('ppdb_applicants', function (Blueprint $table) {
            $table->string('previous_school')->nullable()->after('whatsapp_number');
            $table->string('nisn')->nullable()->after('previous_school');
            
            // Father
            $table->string('father_name')->nullable()->after('nisn');
            $table->string('father_nik')->nullable()->after('father_name');
            $table->string('father_occupation')->nullable()->after('father_nik');
            $table->string('father_education')->nullable()->after('father_occupation');
            $table->string('father_income')->nullable()->after('father_education');
            
            // Mother
            $table->string('mother_name')->nullable()->after('father_income');
            $table->string('mother_nik')->nullable()->after('mother_name');
            $table->string('mother_occupation')->nullable()->after('mother_nik');
            $table->string('mother_education')->nullable()->after('mother_occupation');
            $table->string('mother_income')->nullable()->after('mother_education');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ppdb_applicants', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
