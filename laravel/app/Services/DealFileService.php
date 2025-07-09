<?php

namespace App\Services;

use App\Models\Deal;
use App\Models\DealFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DealFileService
{
    public function storeFile(Request $request, Deal $deal): void
    {
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $file = $request->file('file');
        $filePath = $file->store('deal_files', 'public');
        $fileType = $file->getClientOriginalExtension();
        $author = $request->user();

        DealFile::create([
            'deal_id' => $deal->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'file_type' => $fileType,
            'author_name' => $author->name,
            'author_email' => $author->email,
        ]);
    }

    public function downloadFile(DealFile $file): StreamedResponse
    {
        $filePath = $file->file_path;

        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('public')->download($filePath, $file->file_name);
    }

    public function deleteFile(DealFile $file): void
    {
        Storage::disk('public')->delete($file->file_path);
        $file->delete();
    }
}
