<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::orderBy('order', 'asc')->get();
        return response()->json(['success' => true, 'message' => 'Daftar Guru MI Al-Hasani', 'data' => $teachers], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'role'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'order'       => 'nullable|integer',
            'subject'     => 'nullable|string|max:255',
            'is_active'   => 'nullable|boolean',
        ]);

        $data = $request->except('image');
        $data['description'] = $data['description'] ?? '-';
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            if (env('CLOUDINARY_URL')) {
                $data['image'] = $file->storeOnCloudinary('mialhasani/teachers')->getSecurePath();
            } else {
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images'), $filename);
                $data['image'] = $filename;
            }
        }

        $teacher = Teacher::create($data);
        return response()->json(['success' => true, 'message' => 'Guru berhasil ditambahkan', 'data' => $teacher], 201);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) return response()->json(['success' => false, 'message' => 'Guru tidak ditemukan'], 404);

        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'role'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'order'       => 'nullable|integer',
            'subject'     => 'nullable|string|max:255',
            'is_active'   => 'nullable|boolean',
        ]);

        $data = $request->except('image', '_method');
        $data['description'] = $data['description'] ?? '-';
        if ($request->hasFile('image')) {
            if ($teacher->image) {
                if (str_starts_with($teacher->image, 'http')) {
                    if (str_contains($teacher->image, 'cloudinary.com') && env('CLOUDINARY_URL')) {
                        $parts = parse_url($teacher->image, PHP_URL_PATH);
                        if ($parts) {
                            preg_match('/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/', $parts, $matches);
                            if (isset($matches[1])) {
                                try { \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::destroy($matches[1]); } catch (\Exception $e) {}
                            }
                        }
                    }
                } else if (file_exists(public_path('images/' . $teacher->image))) {
                    unlink(public_path('images/' . $teacher->image));
                }
            }
            $file = $request->file('image');
            if (env('CLOUDINARY_URL')) {
                $data['image'] = $file->storeOnCloudinary('mialhasani/teachers')->getSecurePath();
            } else {
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images'), $filename);
                $data['image'] = $filename;
            }
        }

        $teacher->update($data);
        return response()->json(['success' => true, 'message' => 'Guru berhasil diperbarui', 'data' => $teacher], 200);
    }

    public function destroy($id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) return response()->json(['success' => false, 'message' => 'Guru tidak ditemukan'], 404);
        if ($teacher->image) {
            if (str_starts_with($teacher->image, 'http')) {
                if (str_contains($teacher->image, 'cloudinary.com') && env('CLOUDINARY_URL')) {
                    $parts = parse_url($teacher->image, PHP_URL_PATH);
                    if ($parts) {
                        preg_match('/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/', $parts, $matches);
                        if (isset($matches[1])) {
                            try { \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::destroy($matches[1]); } catch (\Exception $e) {}
                        }
                    }
                }
            } else if (file_exists(public_path('images/' . $teacher->image))) {
                unlink(public_path('images/' . $teacher->image));
            }
        }
        $teacher->delete();
        return response()->json(['success' => true, 'message' => 'Guru berhasil dihapus'], 200);
    }
}