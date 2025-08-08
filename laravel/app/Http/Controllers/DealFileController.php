<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDealFileRequest;
use App\Services\DealFileService;

use App\Models\Deal;
use App\Models\DealFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DealFileController extends Controller
{

    private DealFileService $dealFileService;

    public function __construct(DealFileService $dealFileService)
    {
        $this->dealFileService = $dealFileService;
    }

    public function store(StoreDealFileRequest $request, Deal $deal): RedirectResponse {
        $this->dealFileService->storeFile($request, $deal);
        return back()->with('success', 'File uploaded successfully.');
    }

    public function download(DealFile $file): StreamedResponse
    {
        return $this->dealFileService->downloadFile($file);
    }

    public function destroy(DealFile $file): RedirectResponse
    {
        $this->dealFileService->deleteFile($file);
        return back()->with('success', 'File deleted successfully.');
    }
}
