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
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // If user not logged in, or not buyer/seller, deny
        return $user?->hasAnyRole(['buyer', 'seller', 'lawyer']) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'location'            => ['nullable', 'string', 'max:255'],
            'min_price'           => ['nullable', 'numeric', 'min:0'],
            'max_price'           => ['nullable', 'numeric', 'min:0'],
            'bedrooms'            => ['nullable', 'integer', 'min:0'],
            'bathrooms'           => ['nullable', 'integer', 'min:0'],
            'status'              => ['nullable', 'in:available,pending,sold'],
            'favorites_only'      => ['nullable', 'in:true,false,1,0'],

            // Extended fields
            'property_type'       => ['nullable', 'string', 'max:50'],
            'square_feet_min'     => ['nullable', 'integer', 'min:0'],
            'square_feet_max'     => ['nullable', 'integer', 'min:0'],
            'lot_size_min'        => ['nullable', 'numeric', 'min:0'],
            'lot_size_max'        => ['nullable', 'numeric', 'min:0'],
            'year_built_min'      => ['nullable', 'integer', 'min:1800'],
            'year_built_max'      => ['nullable', 'integer', 'min:1800'],
            'garage_spaces_min'   => ['nullable', 'integer', 'min:0'],
            'has_garage'          => ['nullable', 'in:true,false,1,0'],
            'has_basement'        => ['nullable', 'in:true,false,1,0'],
            'hoa_fees_min'        => ['nullable', 'numeric', 'min:0'],
            'hoa_fees_max'        => ['nullable', 'numeric', 'min:0'],
            'property_taxes_min'  => ['nullable', 'numeric', 'min:0'],
            'property_taxes_max'  => ['nullable', 'numeric', 'min:0'],
            'price_reduced'       => ['nullable', 'in:true,false,1,0'],
            'listed_since'        => ['nullable', 'date'],
            'keywords'            => ['nullable', 'string', 'max:255'],
        ];
    }


    public function validatedFilters(): array
    {
        return collect($this->only([
            'location', 'min_price', 'max_price', 'bedrooms', 'bathrooms', 'status', 'favorites_only',
            'property_type', 'square_feet_min', 'square_feet_max',
            'lot_size_min', 'lot_size_max',
            'year_built_min', 'year_built_max',
            'garage_spaces_min', 'has_garage', 'has_basement',
            'hoa_fees_min', 'hoa_fees_max',
            'property_taxes_min', 'property_taxes_max',
            'price_reduced', 'listed_since', 'keywords',
        ]))
            ->filter(fn ($value) => $value !== '' && $value !== null)
            ->toArray();
    }

}
