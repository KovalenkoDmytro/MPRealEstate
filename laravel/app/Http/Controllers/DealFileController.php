<?php

namespace App\Http\Controllers;

use App\Services\DealFileService;

use App\Models\Deal;
use App\Models\DealFile;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DealFileController extends Controller
{

    private DealFileService $dealFileService;

    public function __construct(DealFileService $dealFileService)
    {
        $this->dealFileService = $dealFileService;
    }

    public function store(Request $request, Deal $deal)
    {
        $this->dealFileService->storeFile($request, $deal);
        return back()->with('success', 'File uploaded successfully.');
    }

    public function download(DealFile $file): StreamedResponse
    {
        return $this->dealFileService->downloadFile($file);
    }

    public function destroy(DealFile $file): \Illuminate\Http\RedirectResponse
    {
        $this->dealFileService->deleteFile($file);
        return back()->with('success', 'File deleted successfully.');
    }
}
