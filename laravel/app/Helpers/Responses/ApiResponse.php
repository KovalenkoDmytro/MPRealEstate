<?php

namespace App\Helpers\Responses;

use Illuminate\Http\JsonResponse;

interface ApiResponse
{
    public function toJson(): JsonResponse;
}
