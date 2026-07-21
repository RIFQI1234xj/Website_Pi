<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::latest()->get();
        return response()->json(['success' => true, 'message' => 'Daftar Berita', 'data' => $news], 200);
    }

    private function storeUploadedPhotos(array $files): array
    {
        $storedPhotos = [];
        foreach ($files as $file) {
            if (env('CLOUDINARY_URL')) {
                $storedPhotos[] = $file->storeOnCloudinary('mialhasani/news')->getSecurePath();
            } else {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images'), $filename);
                $storedPhotos[] = $filename;
            }
        }
        return $storedPhotos;
    }

    private function deleteNewsPhotos(array $photos): void
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

    public function show($id)
    {
        $news = News::find($id);
        if (!$news) return response()->json(['success' => false, 'message' => 'Berita tidak ditemukan'], 404);
        return response()->json(['success' => true, 'data' => $news], 200);
    }

    public function related($id)
    {
        $news = News::find($id);
        if (!$news) return response()->json(['success' => false, 'data' => []], 404);
        $related = News::where('category', $news->category)->where('id', '!=', $id)->latest()->take(3)->get();
        return response()->json(['success' => true, 'data' => $related], 200);
    }

    public function latest()
    {
        $news = News::latest()->take(3)->get();
        return response()->json(['success' => true, 'data' => $news], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'photos'   => 'required|array|min:1',
            'photos.*' => 'image|mimes:jpg,jpeg,png|max:2048',
            'excerpt'  => 'required|string',
            'content'  => 'nullable|string',
            'author'   => 'nullable|string|max:100',
            'date'     => 'required|string',
        ]);

        $storedPhotos = $this->storeUploadedPhotos($request->file('photos', []));

        $data = $request->except('photos');
        $data['image'] = $storedPhotos[0];
        $data['photos'] = $storedPhotos;

        $news = News::create($data);
        return response()->json(['success' => true, 'message' => 'Berita berhasil ditambahkan', 'data' => $news], 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::find($id);
        if (!$news) return response()->json(['success' => false, 'message' => 'Berita tidak ditemukan'], 404);

        $request->validate([
            'title'    => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'photos'   => 'nullable|array',
            'photos.*' => 'image|mimes:jpg,jpeg,png|max:2048',
            'retained_photos' => 'nullable|array',
            'sync_existing_photos' => 'nullable|boolean',
            'excerpt'  => 'sometimes|string',
            'content'  => 'nullable|string',
            'author'   => 'nullable|string|max:100',
            'date'     => 'sometimes|string',
        ]);

        $data = $request->except('photos', 'retained_photos', 'sync_existing_photos', '_method');

        $currentPhotos = is_array($news->photos) ? $news->photos : (empty($news->image) ? [] : [$news->image]);
        $retainedPhotos = $request->input('retained_photos', []);
        $syncExisting = $request->input('sync_existing_photos', false);

        if ($syncExisting) {
            $photosToDelete = array_diff($currentPhotos, $retainedPhotos);
            $this->deleteNewsPhotos($photosToDelete);
            $finalPhotos = $retainedPhotos;
        } else {
            $finalPhotos = $currentPhotos;
        }

        $newPhotos = $this->storeUploadedPhotos($request->file('photos', []));
        $finalPhotos = array_merge($finalPhotos, $newPhotos);

        if (!empty($finalPhotos)) {
            $data['image'] = $finalPhotos[0];
            $data['photos'] = array_values($finalPhotos);
        } else {
            $data['image'] = null;
            $data['photos'] = [];
        }

        $news->update($data);
        return response()->json(['success' => true, 'message' => 'Berita berhasil diperbarui', 'data' => $news], 200);
    }

    public function destroy($id)
    {
        $news = News::find($id);
        if (!$news) return response()->json(['success' => false, 'message' => 'Berita tidak ditemukan'], 404);
        
        $photosToDelete = is_array($news->photos) ? $news->photos : (empty($news->image) ? [] : [$news->image]);
        $this->deleteNewsPhotos($photosToDelete);

        $news->delete();
        return response()->json(['success' => true, 'message' => 'Berita berhasil dihapus'], 200);
    }
}
