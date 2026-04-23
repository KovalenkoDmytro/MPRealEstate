<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RealEstateListingRequest extends FormRequest
{
    public const MAX_IMAGE_SIZE_KB = 4096;

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
        $effectiveImageMaxKb = $this->resolveEffectiveImageMaxKb();

        return [
            // Core Info
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:5000'],

            // Location
            'street_number' => ['required', 'string', 'max:255'],
            'unit_number' => ['sometimes', 'string', 'max:50'],
            'street_name' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],

            // Property Specs
            'property_type' => ['required', 'in:house,condo,townhouse,land,multi-family,farm'],
            'bedrooms' => ['required', 'integer', 'min:1'],
            'bathrooms' => ['required', 'integer', 'min:1'],
            'square_feet' => ['required', 'integer', 'min:100'],
            'lot_size' => ['sometimes', 'integer', 'min:5'],

            // Additional Details
            'year_built' => ['required', 'digits:4', 'integer', 'min:1800', 'max:' . date('Y')],
            'has_garage' => ['sometimes', 'boolean'],
            'garage_spaces' => ['sometimes', 'integer', 'min:5'],
            'has_basement' => ['sometimes', 'boolean'],

            // Financials
            'hoa_fees' => ['sometimes', 'numeric', 'min:5'],
            'property_taxes' => ['required', 'numeric', 'min:50'],

            // Media
            'main_image' => $this->removeMainImageRequired()
                ? ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:' . $effectiveImageMaxKb]
                : ['sometimes', 'image', 'mimes:jpeg,png,jpg,webp', 'max:' . $effectiveImageMaxKb],

            'gallery_images' => ['sometimes', 'array', 'max:5'],
            'gallery_images.*' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:' . $effectiveImageMaxKb],
            'keywords'      => ['sometimes', 'array'],
            'keywords.*'    => ['sometimes', 'string', 'distinct', 'min:1', 'max:50'],
        ];
    }

    private function removeMainImageRequired(): bool
    {
        return $this->isMethod('post') || ($this->isMethod('put') && $this->boolean('remove_main_image') === true);
    }

    private function resolveEffectiveImageMaxKb(): int
    {
        $validationLimitBytes = self::MAX_IMAGE_SIZE_KB * 1024;
        $uploadMaxBytes = $this->iniSizeToBytes((string) ini_get('upload_max_filesize'));
        $postMaxBytes = $this->iniSizeToBytes((string) ini_get('post_max_size'));

        $candidates = array_filter(
            [$validationLimitBytes, $uploadMaxBytes, $postMaxBytes],
            static fn (int $value): bool => $value > 0
        );

        if ($candidates === []) {
            return self::MAX_IMAGE_SIZE_KB;
        }

        $effectiveBytes = (int) min($candidates);

        return max(1, (int) floor($effectiveBytes / 1024));
    }

    private function iniSizeToBytes(string $size): int
    {
        $value = trim($size);
        if ($value === '' || $value === '-1') {
            return 0;
        }

        $unit = strtolower(substr($value, -1));
        $number = (float) $value;

        return match ($unit) {
            'g' => (int) ($number * 1024 * 1024 * 1024),
            'm' => (int) ($number * 1024 * 1024),
            'k' => (int) ($number * 1024),
            default => (int) $number,
        };
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
            'main_image.uploaded' => __('validation.realEstateListingRequest.main_image_uploaded'),
            'gallery_images.*.image' => __('validation.realEstateListingRequest.gallery_images_image'),
            'gallery_images.*.mimes' => __('validation.realEstateListingRequest.gallery_images_mimes'),
            'gallery_images.*.max' => __('validation.realEstateListingRequest.gallery_images_size_max'),
            'gallery_images.*.uploaded' => __('validation.realEstateListingRequest.gallery_images_uploaded'),
            'gallery_images.max' => __('validation.realEstateListingRequest.gallery_images_amount_max'),
        ];
    }
}
