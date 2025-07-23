<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DealBreakRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // If user not logged in, or not buyer/seller, deny
        return $user?->hasAnyRole(['buyer', 'seller']) ?? false;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:request,respond'],
            'message' => ['required_if:action,request', 'string'],
            'response' => ['required_if:action,respond', 'in:approved,rejected'],
        ];
    }

    public function messages(): array
    {
        return [
            'message.required_if' => 'Please provide a reason for breaking the deal.',
            'message.string'      => 'The message must be a valid string.',
            'message.max'         => 'The message must not exceed 1000 characters.',
            'response.required_if' => 'A response is required when responding to a break request.',
            'response.in'          => 'The response must be either approved or rejected.',
        ];
    }
}
