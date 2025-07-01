<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property string|null $location
 * @property float|null $min_price
 * @property float|null $max_price
 * @property int|null $bedrooms
 * @property int|null $bathrooms
 * @property string|null $status
 * @property bool|null $favorites_only
 */
class ListingFilterRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'location' => ['nullable', 'string', 'max:255'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:active,pending,sold'], // adjust allowed statuses
            'favorites_only' => ['nullable', 'boolean'],
        ];
    }

    public function validatedFilters(): array
    {
        // Provide convenience method to get filters, ensuring empty ones are omitted
        return $this->only([
            'location', 'min_price', 'max_price', 'bedrooms', 'bathrooms', 'status', 'favorites_only',
        ]);
    }
}
