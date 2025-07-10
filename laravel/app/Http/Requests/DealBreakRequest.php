<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DealBreakRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check(); // or apply any specific logic
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
            'message.required' => 'Please provide a reason for breaking the deal.',
            'message.string' => 'The message must be a valid string.',
            'message.max' => 'The message must not exceed 1000 characters.',
        ];
    }
}
