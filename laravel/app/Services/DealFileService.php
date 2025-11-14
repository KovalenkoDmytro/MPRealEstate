<?php

namespace App\Services;

use App\Http\Requests\StoreDealFileRequest;
use App\Models\Deal;
use App\Models\DealFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DealFileService
{
    public function storeFile(StoreDealFileRequest $request, Deal $deal): DealFile
    {
        $file = $request->file('file');
        $filePath = $file->store('deal_files', 'public');
        $fileType = $file->getClientOriginalExtension();
        $author = $request->user();

        $dealFile = DealFile::create([
            'deal_id' => $deal->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'file_type' => $fileType,
            'author_name' => $author->name,
            'author_email' => $author->email,
        ]);

        return $dealFile->fresh();


    }

    public function downloadFile(DealFile $file): StreamedResponse
    {
        $filePath = $file->file_path;

        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, __('files.not_found'));
        }

        return Storage::disk('public')->download($filePath, $file->file_name);
    }

    public function deleteFile(DealFile $file): void
    {
        Storage::disk('public')->delete($file->file_path);
        $file->delete();
    }
}
