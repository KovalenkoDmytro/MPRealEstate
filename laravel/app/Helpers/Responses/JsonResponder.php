<?php

namespace App\Helpers\Responses;

use Illuminate\Http\JsonResponse;

class JsonResponder
{
    public static function send(ApiResponse $response): JsonResponse
    {
        return $response->toJson();
    }
}
