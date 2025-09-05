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
            'property_type' => ['required', 'in:house,condo,townhouse,land,multi-family,farm'],
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
        return $this->isMethod('post') || ($this->isMethod('put') && $this->boolean('remove_main_image') === true);
    }

    /**
     * Customize error messages.
     */
    public function messages(): array
    {
        return [
            'main_image.required' => __('validation.realEstateListingRequest.main_image_required'),
            'main_image.image' => __('validation.realEstateListingRequest.main_image_image'),
            'main_image.mimes' => __('validation.realEstateListingRequest.main_image_mimes'),
            'main_image.max' => __('validation.realEstateListingRequest.main_image_max'),
            'gallery_images.*.image' => __('validation.realEstateListingRequest.gallery_images_image'),
            'gallery_images.*.mimes' => __('validation.realEstateListingRequest.gallery_images_mimes'),
            'gallery_images.*.max' => __('validation.realEstateListingRequest.gallery_images_size_max'),
            'gallery_images.max' => __('validation.realEstateListingRequest.gallery_images_amount_max'),
        ];
    }
}
