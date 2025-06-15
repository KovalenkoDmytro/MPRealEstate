<?php

namespace App\Helpers;
use Illuminate\Http\JsonResponse;

class ResponseHelper
{
    public static function success(string $message = 'Success', array $data = [], int $code = 200): JsonResponse {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    public static function error(string $message = 'Something went wrong', array $errors = [], int $code = 422): JsonResponse {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}
