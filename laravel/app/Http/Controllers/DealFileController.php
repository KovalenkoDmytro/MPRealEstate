<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Models\DealFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DealFileController extends Controller
{
    /**
     * ✅ Store uploaded files related to a deal
     */
    public function store(Request $request, Deal $deal)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // Max 10MB file
        ]);

        $file = $request->file('file');
        $filePath = $file->store('deal_files', 'public'); // Save in storage/app/public/deal_files
        $fileType = $file->getClientOriginalExtension();
        $authorName = auth()->user()->name;
        $authorEmail = auth()->user()->email;

        DealFile::create([
            'deal_id' => $deal->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'file_type' => $fileType,
            'author_name' => $authorName,
            'author_email' => $authorEmail,
        ]);

        return back()->with('success', 'File uploaded successfully.');
    }

    /**
     * ✅ Download a file
     */
    public function download(DealFile $file): StreamedResponse
    {
        $filePath = $file->file_path; // Ensure correct path

        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, "File not found.");
        }

        return Storage::disk('public')->download($filePath, $file->file_name);
    }

    /**
     * ✅ Delete a file
     */
    public function destroy(DealFile $file)
    {
        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return back()->with('success', 'File deleted successfully.');
    }
}
