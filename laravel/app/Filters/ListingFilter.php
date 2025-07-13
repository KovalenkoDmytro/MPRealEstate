<?php

namespace App\Filters;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class ListingFilter
{
    public static function apply(Builder $query, array $filters, ?User $user = null): Builder

    {
        // Text/Exact Match filters
        $query
            ->when(!empty($filters['location']), fn($q) =>
            $q->where('location', 'like', '%' . $filters['location'] . '%'))

            ->when(!empty($filters['property_type']), fn($q) =>
            $q->where('property_type', $filters['property_type']))

            ->when(!empty($filters['status']), fn($q) =>
            $q->where('status', $filters['status']))

            ->when(!empty($filters['keywords']), fn($q, $value) =>
            $q->where(function ($q) use ($value) {
                $q->where('title', 'like', "%$value%")
                    ->orWhere('description', 'like', "%$value%");
            })
            );

        // Range filters (min/max)
        $rangeFilters = [
            'min_price'          => ['price', '>='],
            'max_price'          => ['price', '<='],
            'bedrooms'           => ['bedrooms', '>='],
            'bathrooms'          => ['bathrooms', '>='],
            'square_feet_min'    => ['square_feet', '>='],
            'square_feet_max'    => ['square_feet', '<='],
            'lot_size_min'       => ['lot_size', '>='],
            'lot_size_max'       => ['lot_size', '<='],
            'year_built_min'     => ['year_built', '>='],
            'year_built_max'     => ['year_built', '<='],
            'garage_spaces_min'  => ['garage_spaces', '>='],
            'hoa_fees_min'       => ['hoa_fees', '>='],
            'hoa_fees_max'       => ['hoa_fees', '<='],
            'property_taxes_min' => ['property_taxes', '>='],
            'property_taxes_max' => ['property_taxes', '<='],
        ];

        foreach ($rangeFilters as $filterKey => [$column, $operator]) {
            if (!empty($filters[$filterKey])) {
                $query->where($column, $operator, $filters[$filterKey]);
            }
        }

        // Boolean filters
        foreach (['has_garage', 'has_basement', 'price_reduced'] as $boolField) {
            if (array_key_exists($boolField, $filters)) {
                $query->where($boolField, filter_var($filters[$boolField], FILTER_VALIDATE_BOOLEAN));
            }
        }

        // Date filter
        if (!empty($filters['listed_since'])) {
            $query->whereDate('created_at', '>=', $filters['listed_since']);
        }

        if (!empty($filters['favorites_only']) && $user) {
            $query->whereIn('id', $user->favoriteListings()->pluck('real_estate_listing_id'));
        }


        return $query;
    }


}
