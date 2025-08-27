<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SetDepositMadeRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // If user not logged in, or not buyer/seller, deny
        return $user?->hasRole('buyer') ?? false;
    }

    public function rules(): array {
        return [
            'is_security_deposit_made' => ['required', 'boolean'],
            'security_deposit_made_at' => ['required', 'date'],
        ];
    }

    public function prepareForValidation(): void {
        // If date is missing, default to now()
        if (!$this->filled('security_deposit_made_at')) {
            $this->merge([
                'security_deposit_made_at' => now(),
            ]);
        }
    }
}
