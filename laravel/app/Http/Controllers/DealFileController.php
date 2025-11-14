<?php

namespace App\Http\Controllers;

use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Http\Requests\StoreDealFileRequest;
use App\Services\DealFileService;

use App\Models\Deal;
use App\Models\DealFile;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DealFileController extends Controller
{

    private DealFileService $dealFileService;

    public function __construct(DealFileService $dealFileService)
    {
        $this->dealFileService = $dealFileService;
    }

    public function store(StoreDealFileRequest $request, Deal $deal): JsonResponse {

        $file = $this->dealFileService->storeFile($request, $deal);

        return JsonResponder::send(
            new SuccessResponse(__('files.upload_success'), [
                'file'    => $file
            ])
        );
    }

    public function download(DealFile $file): StreamedResponse
    {
        return $this->dealFileService->downloadFile($file);
    }

    public function destroy(DealFile $file): JsonResponse
    {
        $this->dealFileService->deleteFile($file);

        return JsonResponder::send(
            new SuccessResponse(__('files.delete_failed'))
        );
    }
}
