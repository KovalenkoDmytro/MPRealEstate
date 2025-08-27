<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmDepositRequest extends FormRequest {

    public function authorize(): bool {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // If user not logged in, or not buyer/seller, deny
        return $user?->hasRole('seller') ?? false;
    }

    public function rules(): array {
        return [
            'is_security_deposit_confirmed' => ['required', 'boolean'],
            'security_deposit_confirmed_at' => ['required', 'date'],
        ];
    }

    public function prepareForValidation(): void {
        // If the field is missing, set it to the current datetime
        if ( !$this->filled('security_deposit_confirmed_at') ) {
            $this->merge([
                'security_deposit_confirmed_at' => now(),
            ]);
        }
    }

}
