<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = Program::all();
        return response()->json(['success' => true, 'message' => 'Daftar Program', 'data' => $programs], 200);
    }

    public function featured()
    {
        $program = Program::first();
        return response()->json(['success' => true, 'data' => $program], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'images.*'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'category'    => 'required|string|max:100',
            'schedule'    => 'nullable|string|max:255',
            'is_active'   => 'nullable',
        ]);

        $data = $request->except(['image', 'images']);
        
        $uploadedImages = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if (env('CLOUDINARY_URL')) {
                    $uploadedImages[] = cloudinary()->uploadApi()->upload($file->getRealPath(), ['folder' => 'mialhasani/programs'])['secure_url'];
                } else {
                    $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                    $file->move(public_path('images'), $filename);
                    $uploadedImages[] = $filename;
                }
            }
        }

        if (count($uploadedImages) > 0) {
            $data['images'] = $uploadedImages;
            $data['image'] = $uploadedImages[0];
        }

        $program = Program::create($data);
        return response()->json(['success' => true, 'message' => 'Program berhasil ditambahkan', 'data' => $program], 201);
    }

    public function update(Request $request, $id)
    {
        $program = Program::find($id);
        if (!$program) return response()->json(['success' => false, 'message' => 'Program tidak ditemukan'], 404);

        $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'images.*'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'existing_images' => 'nullable|array',
            'category'    => 'sometimes|string|max:100',
            'schedule'    => 'nullable|string|max:255',
            'is_active'   => 'nullable',
        ]);

        $data = $request->except(['image', 'images', 'existing_images', '_method']);
        $existingImages = $request->input('existing_images', []);
        
        $newImages = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if (env('CLOUDINARY_URL')) {
                    $newImages[] = cloudinary()->uploadApi()->upload($file->getRealPath(), ['folder' => 'mialhasani/programs'])['secure_url'];
                } else {
                    $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                    $file->move(public_path('images'), $filename);
                    $newImages[] = $filename;
                }
            }
        }

        $finalImages = array_merge($existingImages, $newImages);
        $data['images'] = $finalImages;
        $data['image'] = count($finalImages) > 0 ? $finalImages[0] : null;

        $oldImages = $program->images ?: ($program->image ? [$program->image] : []);
        foreach ($oldImages as $oldImg) {
            if (!in_array($oldImg, $finalImages)) {
                if (str_starts_with($oldImg, 'http')) {
                    if (str_contains($oldImg, 'cloudinary.com') && env('CLOUDINARY_URL')) {
                        $parts = parse_url($oldImg, PHP_URL_PATH);
                        if ($parts) {
                            preg_match('/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/', $parts, $matches);
                            if (isset($matches[1])) {
                                try {
                                    cloudinary()->uploadApi()->destroy($matches[1]);
                                } catch (\Exception $e) {}
                            }
                        }
                    }
                } else if (file_exists(public_path('images/' . $oldImg))) {
                    unlink(public_path('images/' . $oldImg));
                }
            }
        }

        $program->update($data);
        return response()->json(['success' => true, 'message' => 'Program berhasil diperbarui', 'data' => $program], 200);
    }

    public function destroy($id)
    {
        $program = Program::find($id);
        if (!$program) return response()->json(['success' => false, 'message' => 'Program tidak ditemukan'], 404);
        
        $oldImages = $program->images ?: ($program->image ? [$program->image] : []);
        foreach ($oldImages as $oldImg) {
            if (str_starts_with($oldImg, 'http')) {
                if (str_contains($oldImg, 'cloudinary.com') && env('CLOUDINARY_URL')) {
                    $parts = parse_url($oldImg, PHP_URL_PATH);
                    if ($parts) {
                        preg_match('/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/', $parts, $matches);
                        if (isset($matches[1])) {
                            try {
                                cloudinary()->uploadApi()->destroy($matches[1]);
                            } catch (\Exception $e) {}
                        }
                    }
                }
            } else if (file_exists(public_path('images/' . $oldImg))) {
                unlink(public_path('images/' . $oldImg));
            }
        }
        
        $program->delete();
        return response()->json(['success' => true, 'message' => 'Program berhasil dihapus'], 200);
    }
}