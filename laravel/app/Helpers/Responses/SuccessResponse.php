<?php

namespace App\Helpers\Responses;

use Illuminate\Http\JsonResponse;

class SuccessResponse implements ApiResponse
{
    public function __construct(
        protected string $message = 'Success',
        protected array $data = [],
        protected int $code = 200
    ) {}

    public function toJson(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => $this->message,
            'data' => $this->data,
        ], $this->code);
    }
}
