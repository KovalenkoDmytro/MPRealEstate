import { SearchBox } from "@mapbox/search-js-react";

// Normalized address data to replace the old Google Place object
export interface MapboxAddressData {
    fullAddress: string;
    longitude: number;
    latitude: number;
    streetNumber?: string;
    streetName?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    rawFeature: any;
}

interface AddressAutocompleteProps {
    value?: string;
    onSelect: (place: MapboxAddressData) => void;
}

export default function AddressAutocomplete({ value, onSelect }: AddressAutocompleteProps) {

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "YOUR_MAPBOX_ACCESS_TOKEN";

    const handleRetrieve = (res: any) => {
        const feature = res.features[0];
        if (!feature) return;

        const { properties, geometry } = feature;
        const context = properties.context || {};

        // Parse the Mapbox response into a clean object for your forms
        const addressData: MapboxAddressData = {
            fullAddress: properties.full_address || properties.place_formatted || properties.name,
            longitude: geometry.coordinates[0],
            latitude: geometry.coordinates[1],
            streetNumber: context.address?.address_number,
            streetName: context.street?.name || context.address?.street_name,
            city: context.place?.name,
            province: context.region?.name,
            postalCode: context.postcode?.name,
            country: context.country?.name,
            rawFeature: feature,
        };

        onSelect(addressData);
    };

    return (
        <div className="w-full border rounded border-gray-300 bg-white">
            <SearchBox
                accessToken={MAPBOX_TOKEN}
                value={value}
                options={{
                    country: 'ca', // Restrict to Canada
                    language: 'en'
                }}
                onRetrieve={handleRetrieve}
                theme={{
                    variables: {
                        fontFamily: 'inherit',
                        unit: '16px',
                        padding: '0.5em',
                        borderRadius: '8px',
                        boxShadow: 'none',
                        border: 'none',
                    }
                }}
            />
        </div>
    );
}
