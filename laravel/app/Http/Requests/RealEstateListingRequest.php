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
        /** @var \App\Models\User $user */
        $user = auth()->user();

        return $user?->hasRole('seller') ?? false;
    }

    protected function prepareForValidation(): void {
        $this->merge([
            'has_garage' => $this->boolean('has_garage'),
            'has_basement' => $this->boolean('has_basement'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
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
            'main_image' => $this->removeMainImageRequired()
                ? ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2120']
                : ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2120'],

            'gallery_images' => ['array', 'max:7'],
            'gallery_images.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2120'],


            'keywords' => ['nullable', 'string'],
        ];
    }

    private function removeMainImageRequired(): bool
    {
        return $this->isMethod('post') ||  $this->isMethod('put') && $this->boolean('remove_main_image') === true;
    }

    /**
     * Customize error messages.
     */
    public function messages(): array
    {
        return [
            'main_image.required' => 'Please upload a main image.',
            'main_image.image' => 'The main image must be a valid image file.',
            'main_image.mimes' => 'Main image must be a JPEG, PNG, JPG, or WEBP file.',
            'main_image.max' => 'Main image must not exceed 2MB.',
            'gallery_images.*.image' => 'Each gallery image must be a valid image file.',
            'gallery_images.*.mimes' => 'Gallery images must be JPEG, PNG, JPG, or WEBP files.',
            'gallery_images.*.max' => 'Each gallery image must not exceed 2MB.',
            'gallery_images.max' => 'You can upload a maximum of 7 gallery images.',
        ];
    }
}
