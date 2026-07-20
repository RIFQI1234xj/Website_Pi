<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('school_settings', function (Blueprint $table) {
            $table->string('welcome_title')->nullable()->after('established_year');
            $table->string('welcome_highlight')->nullable()->after('welcome_title');
            $table->string('welcome_tagline_1')->nullable()->after('welcome_highlight');
            $table->string('welcome_tagline_2')->nullable()->after('welcome_tagline_1');
            $table->string('welcome_tagline_3')->nullable()->after('welcome_tagline_2');
            $table->json('hero_images')->nullable()->after('welcome_tagline_3');
        });
    }

    public function down(): void
    {
        Schema::table('school_settings', function (Blueprint $table) {
            $table->dropColumn([
                'welcome_title',
                'welcome_highlight',
                'welcome_tagline_1',
                'welcome_tagline_2',
                'welcome_tagline_3',
                'hero_images',
            ]);
        });
    }
};

