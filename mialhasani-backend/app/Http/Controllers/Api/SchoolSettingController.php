<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SchoolSettingController extends Controller
{
    public function index()
    {
        $settings = SchoolSetting::query()->firstOrCreate([], $this->defaultValues());

        return response()->json([
            'success' => true,
            'data' => $settings,
        ], 200);
    }

    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'school_name' => 'nullable|string|max:255',
                'npsn' => 'nullable|string|max:50',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:50',
                'whatsapp_number' => 'nullable|string|max:50',
                'website' => 'nullable|url|max:255',
                'address' => 'nullable|string',
                'postal_code' => 'nullable|string|max:20',
                'school_status' => 'nullable|string|max:50',
                'accreditation' => 'nullable|string|max:10',
                'established_year' => 'nullable|integer',
                'welcome_title' => 'nullable|string|max:255',
                'welcome_highlight' => 'nullable|string|max:255',
                'welcome_tagline_1' => 'nullable|string|max:255',
                'welcome_tagline_2' => 'nullable|string|max:255',
                'welcome_tagline_3' => 'nullable|string|max:255',
                'retained_hero_images' => 'nullable|array',
                'retained_hero_images.*' => 'string',
                'hero_images' => 'nullable|array',
                'hero_images.*' => 'file|mimes:jpg,jpeg,png,webp|max:10240',
                'retained_brochure_images' => 'nullable|array',
                'retained_brochure_images.*' => 'string',
                'brochure_images' => 'nullable|array',
                'brochure_images.*' => 'file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
                'map_embed_url' => 'nullable|string',
                'map_link' => 'nullable|string|max:255',
                'facebook_url' => 'nullable|string|max:255',
                'instagram_url' => 'nullable|string|max:255',
                'youtube_url' => 'nullable|string|max:255',
                'twitter_url' => 'nullable|string|max:255',
            ]);

            $settings = SchoolSetting::query()->firstOrNew([]);
            $settings->fill($this->normalizeNullableValues(Arr::except($validated, [
                'retained_hero_images',
                'hero_images',
                'retained_brochure_images',
                'brochure_images',
            ])));

            // --- Process Hero Images ---
            $existingHeroImages = is_array($settings->hero_images) ? $settings->hero_images : [];
            $retainedHeroImages = $request->input('retained_hero_images', []);

            $retainedHeroImages = array_values(array_filter($retainedHeroImages, function ($value) use ($existingHeroImages) {
                return is_string($value) && in_array($value, $existingHeroImages, true);
            }));

            $uploadedHeroImages = [];
            $heroFiles = $request->file('hero_images', []);
            if (is_array($heroFiles)) {
                foreach ($heroFiles as $file) {
                    if (!$file) continue;
                    if (env('CLOUDINARY_URL')) {
                        $uploadedHeroImages[] = cloudinary()->uploadApi()->upload($file->getRealPath(), ['folder' => 'mialhasani/settings'])['secure_url'];
                    } else {
                        $filename = 'hero-' . time() . '-' . Str::lower(Str::random(10)) . '.' . $file->getClientOriginalExtension();
                        $file->move(public_path('images'), $filename);
                        $uploadedHeroImages[] = $filename;
                    }
                }
            }
            $settings->hero_images = array_merge($retainedHeroImages, $uploadedHeroImages);

            // --- Process Brochure Images ---
            $existingBrochureImages = is_array($settings->brochure_images) ? $settings->brochure_images : [];
            $retainedBrochureImages = $request->input('retained_brochure_images', []);

            $retainedBrochureImages = array_values(array_filter($retainedBrochureImages, function ($value) use ($existingBrochureImages) {
                return is_string($value) && in_array($value, $existingBrochureImages, true);
            }));

            $uploadedBrochureImages = [];
            $brochureFiles = $request->file('brochure_images', []);
            if (is_array($brochureFiles)) {
                foreach ($brochureFiles as $file) {
                    if (!$file) continue;
                    if (env('CLOUDINARY_URL')) {
                        $uploadedBrochureImages[] = cloudinary()->uploadApi()->upload($file->getRealPath(), ['folder' => 'mialhasani/settings'])['secure_url'];
                    } else {
                        $filename = 'brosur-mi-alhasani-' . time() . '-' . Str::lower(Str::random(10)) . '.' . $file->getClientOriginalExtension();
                        $file->move(public_path('images'), $filename);
                        $uploadedBrochureImages[] = $filename;
                    }
                }
            }
            $settings->brochure_images = array_merge($retainedBrochureImages, $uploadedBrochureImages);

            $settings->save();

            return response()->json([
                'success' => true,
                'message' => 'Pengaturan sekolah berhasil diperbarui',
                'data' => $settings,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal: ' . $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error 500: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    private function defaultValues(): array
    {
        return [
            'school_name' => 'MI Al-Hasani',
            'npsn' => '60706775',
            'email' => 'misalhasani@gmail.com',
            'phone' => '(0251) 8256657',
            'whatsapp_number' => '6281385086531',
            'website' => 'https://mialhasani.sch.id',
            'address' => "Jl. Kp. Babakansirna 02/02\nDs. Jogjogan, Kec. Cisarua\nKab. Bogor, Jawa Barat",
            'postal_code' => '16750',
            'school_status' => 'Swasta',
            'accreditation' => 'B',
            'established_year' => 1995,
            'welcome_title' => 'Selamat Datang di',
            'welcome_highlight' => 'MI AL-HASANI',
            'welcome_tagline_1' => 'Tempat di Mana Ilmu Pengetahuan',
            'welcome_tagline_2' => 'dan',
            'welcome_tagline_3' => 'Nilai - Nilai Islami Berpadu',
            'hero_images' => [
                'galeri-prestasi.jpg',
                'galeri-maulid.jpg',
                'galeri-shalat.jpg',
            ],
            'map_embed_url' => 'https://maps.google.com/maps?q=MTsS+AL+HASANI,+Jl.+Jogjogan,+Cisarua,+Bogor&t=&z=16&ie=UTF8&iwloc=&output=embed',
            'map_link' => 'https://maps.google.com/?q=MTsS+AL+HASANI,+Jl.+Jogjogan,+Cisarua,+Bogor',
            'facebook_url' => null,
            'instagram_url' => null,
            'youtube_url' => null,
            'twitter_url' => null,
        ];
    }

    private function normalizeNullableValues(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = trim($value) === '' ? null : trim($value);
            }
        }

        return $data;
    }
}
