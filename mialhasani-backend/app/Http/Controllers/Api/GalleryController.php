<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    private function storeUploadedPhotos(array $files): array
    {
        $storedPhotos = [];

        foreach ($files as $file) {
            if (env('CLOUDINARY_URL')) {
                $storedPhotos[] = $file->storeOnCloudinary('mialhasani/galleries')->getSecurePath();
            } else {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images'), $filename);
                $storedPhotos[] = $filename;
            }
        }

        return $storedPhotos;
    }

    private function deleteGalleryPhotos(array $photos): void
    {
        foreach (array_unique($photos) as $photo) {
            if (!is_string($photo)) continue;

            if (str_starts_with($photo, 'http')) {
                if (str_contains($photo, 'cloudinary.com') && env('CLOUDINARY_URL')) {
                    $parts = parse_url($photo, PHP_URL_PATH);
                    if ($parts) {
                        preg_match('/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/', $parts, $matches);
                        if (isset($matches[1])) {
                            try {
                                \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::destroy($matches[1]);
                            } catch (\Exception $e) {}
                        }
                    }
                }
                continue;
            }

            $path = public_path('images/' . $photo);
            if (file_exists($path)) {
                unlink($path);
            }
        }
    }

    public function index()
    {
        $galleries = Gallery::latest()->get();
        return response()->json(['success' => true, 'message' => 'Daftar Galeri', 'data' => $galleries], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'photos'      => 'required|array|min:1',
            'photos.*'    => 'image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'nullable|string',
        ]);

        $storedPhotos = $this->storeUploadedPhotos($request->file('photos', []));

        $data = $request->except('photos');
        $data['image'] = $storedPhotos[0];
        $data['photos'] = $storedPhotos;

        $gallery = Gallery::create($data);
        return response()->json(['success' => true, 'message' => 'Album galeri berhasil ditambahkan', 'data' => $gallery], 201);
    }

    public function update(Request $request, $id)
    {
        $gallery = Gallery::find($id);
        if (!$gallery) return response()->json(['success' => false, 'message' => 'Galeri tidak ditemukan'], 404);

        $request->validate([
            'title'       => 'sometimes|string|max:255',
            'category'    => 'sometimes|string|max:100',
            'photos'      => 'nullable|array|min:1',
            'photos.*'    => 'image|mimes:jpg,jpeg,png|max:2048',
            'retained_photos'   => 'nullable|array',
            'retained_photos.*' => 'string',
            'description' => 'nullable|string',
        ]);

        $data = $request->except('photos', 'retained_photos', 'sync_existing_photos', '_method');
        $existingPhotos = is_array($gallery->photos) && count($gallery->photos) > 0
            ? $gallery->photos
            : array_filter([$gallery->image]);

        if ($request->has('sync_existing_photos') || $request->hasFile('photos')) {
            $retainedPhotos = $request->has('sync_existing_photos')
                ? array_values(array_intersect($existingPhotos, $request->input('retained_photos', [])))
                : $existingPhotos;
            $storedPhotos = $this->storeUploadedPhotos($request->file('photos', []));
            $mergedPhotos = [...$retainedPhotos, ...$storedPhotos];

            if (count($mergedPhotos) === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Album harus memiliki minimal 1 foto.',
                ], 422);
            }

            $deletedPhotos = array_values(array_diff($existingPhotos, $retainedPhotos));
            $this->deleteGalleryPhotos($deletedPhotos);

            $data['image'] = $mergedPhotos[0];
            $data['photos'] = $mergedPhotos;
        }

        $gallery->update($data);
        return response()->json(['success' => true, 'message' => 'Galeri berhasil diperbarui', 'data' => $gallery], 200);
    }

    public function destroy($id)
    {
        $gallery = Gallery::find($id);
        if (!$gallery) return response()->json(['success' => false, 'message' => 'Galeri tidak ditemukan'], 404);

        $existingPhotos = is_array($gallery->photos) && count($gallery->photos) > 0
            ? $gallery->photos
            : array_filter([$gallery->image]);

        $this->deleteGalleryPhotos($existingPhotos);
        $gallery->delete();
        return response()->json(['success' => true, 'message' => 'Galeri berhasil dihapus'], 200);
    }
}
