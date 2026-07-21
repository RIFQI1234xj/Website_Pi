<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Principal;
use Illuminate\Http\Request;

class PrincipalController extends Controller
{
    public function index()
    {
        $principal = Principal::first();
        return response()->json(['success' => true, 'data' => $principal], 200);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name'    => 'sometimes|string|max:255',
            'role'    => 'sometimes|string|max:255',
            'image'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'message' => 'sometimes|string',
        ]);

        $principal = Principal::first();
        $data = $request->except('image', '_method');

        if ($request->hasFile('image')) {
            if ($principal && $principal->image) {
                if (str_starts_with($principal->image, 'http')) {
                    if (str_contains($principal->image, 'cloudinary.com') && env('CLOUDINARY_URL')) {
                        $parts = parse_url($principal->image, PHP_URL_PATH);
                        if ($parts) {
                            preg_match('/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/', $parts, $matches);
                            if (isset($matches[1])) {
                                try { \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::destroy($matches[1]); } catch (\Exception $e) {}
                            }
                        }
                    }
                } else if (file_exists(public_path('images/' . $principal->image))) {
                    unlink(public_path('images/' . $principal->image));
                }
            }
            $file = $request->file('image');
            if (env('CLOUDINARY_URL')) {
                $data['image'] = $file->storeOnCloudinary('mialhasani/principals')->getSecurePath();
            } else {
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images'), $filename);
                $data['image'] = $filename;
            }
        }

        if (!$principal) {
            $principal = Principal::create($data);
        } else {
            $principal->update($data);
        }

        return response()->json(['success' => true, 'message' => 'Profil pimpinan berhasil diperbarui', 'data' => $principal], 200);
    }
}