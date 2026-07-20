<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_name',
        'npsn',
        'email',
        'phone',
        'whatsapp_number',
        'website',
        'address',
        'postal_code',
        'school_status',
        'accreditation',
        'established_year',
        'welcome_title',
        'welcome_highlight',
        'welcome_tagline_1',
        'welcome_tagline_2',
        'welcome_tagline_3',
        'hero_images',
        'map_embed_url',
        'map_link',
        'facebook_url',
        'instagram_url',
        'youtube_url',
        'twitter_url',
        'brochure_images',
    ];

    protected $casts = [
        'established_year' => 'integer',
        'hero_images' => 'array',
        'brochure_images' => 'array',
    ];
}
