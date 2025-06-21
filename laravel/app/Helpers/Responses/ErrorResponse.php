<?php

namespace App\Helpers\Responses;

use Illuminate\Http\JsonResponse;

class ErrorResponse implements ApiResponse
{
    public function __construct(
        protected string $message = 'Something went wrong',
        protected array $errors = [],
        protected int $code = 422
    ) {}

    public function toJson(): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $this->message,
            'errors' => $this->errors,
        ], $this->code);
    }
}
