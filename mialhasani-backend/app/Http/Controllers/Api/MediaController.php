<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class MediaController extends Controller
{
    public function show(string $filename)
    {
        $decodedFilename = rawurldecode($filename);
        $imagesDirectory = realpath(public_path('images'));
        $filePath = realpath(public_path('images/' . $decodedFilename));

        if (
            $imagesDirectory === false ||
            $filePath === false ||
            (!str_starts_with($filePath, $imagesDirectory . DIRECTORY_SEPARATOR) && $filePath !== $imagesDirectory)
        ) {
            abort(404);
        }

        return response()->file($filePath, [
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    public function download(string $filename)
    {
        $decodedFilename = rawurldecode($filename);
        $imagesDirectory = realpath(public_path('images'));
        $filePath = realpath(public_path('images/' . $decodedFilename));

        if (
            $imagesDirectory === false ||
            $filePath === false ||
            (!str_starts_with($filePath, $imagesDirectory . DIRECTORY_SEPARATOR) && $filePath !== $imagesDirectory)
        ) {
            abort(404);
        }

        return response()->download($filePath);
    }
}
