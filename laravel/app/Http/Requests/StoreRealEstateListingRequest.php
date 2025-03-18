<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRealEstateListingRequest extends FormRequest
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
            // 🔹 Basic Listing Details
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:10000',
            'location' => 'required|string|max:255',
            'bedrooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
            'square_feet' => 'required|integer|min:500',

            // 🔹 Image Upload Validation
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // ✅ Main image validation
            'gallery_images' => 'nullable|array', // ✅ Ensure gallery is an array
            'gallery_images.*' => 'image|mimes:jpeg,png,jpg|max:2048', // ✅ Validate each gallery image
            'remove_images' => 'array',
            'remove_images.*' => 'integer|exists:listing_images,id', // ✅ Ensure removed images exist

            // 🔹 Additional Property Parameters
            'home_type' => 'required|string|in:condo,house', // ✅ Must be 'condo' or 'house'
            'year_build' => 'required|integer|min:1950|max:' . date('Y'), // ✅ Must be between 1950 and the current year
            'amenities' => 'nullable|array', // ✅ Ensure array format
            'amenities.*' => 'string|in:pool,gym,furnished', // ✅ Validate each amenity
            'storeys' => 'required|numeric|min:1|max:50', // ✅ Min 1, Max 50
            'community_name' => 'nullable|string|max:255',
            'annual_property_taxes' => 'required|numeric|min:1|max:5000',
            'parking_space' => 'required|boolean',
            'storage_space' => 'required|boolean',
            'basement_space' => 'required|boolean',
            'construction_material' => 'nullable|string|max:255',
        ];
    }

    /**
     * Customize error messages.
     */
    public function messages(): array
    {
        return [
            'home_type.in' => 'The home type must be either "condo" or "house".',
            'year_build.max' => 'The year build cannot be in the future.',
            'storeys.max' => 'The maximum number of storeys is 50.',
        ];
    }
}
