<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RealEstateListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasRole('seller'); // ✅ Only sellers can create listings
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Ownership is set by controller (not via form)

            // Core Info
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],

            // Location
            'location' => ['required', 'string', 'max:255'],

            // Property Specs
            'property_type' => ['nullable', 'in:house,condo,townhouse,land,multi-family,farm'],
            'bedrooms' => ['required', 'integer', 'min:0'],
            'bathrooms' => ['required', 'integer', 'min:0'],
            'square_feet' => ['nullable', 'integer', 'min:0'],
            'lot_size' => ['nullable', 'integer', 'min:0'],

            // Additional Details
            'year_built' => ['nullable', 'digits:4', 'integer', 'min:1800', 'max:' . date('Y')],
            'has_garage' => ['nullable', 'boolean'],
            'garage_spaces' => ['nullable', 'integer', 'min:0'],
            'has_basement' => ['nullable', 'boolean'],

            // Financials
            'hoa_fees' => ['nullable', 'numeric', 'min:0'],
            'property_taxes' => ['nullable', 'numeric', 'min:0'],

            // Media
            'main_image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'gallery_images.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],

            // Optional
            'keywords' => ['nullable', 'string'],
        ];
    }

    /**
     * Customize error messages.
     */
    public function messages(): array
    {
        return [
            'main_image.required' => 'Please upload a main image.',
            'main_image.image' => 'The main image must be a valid image file.',
            'gallery_images.*.image' => 'Each gallery image must be a valid image file.',
        ];
    }
}
