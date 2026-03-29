import type { ChangeEvent } from "react";
import type { PropertyStatus } from "./realEstateListing";

export interface GalleryImagePreview {
    id?: number;
    file?: File;
    url: string;
}

export interface ListingImagesState {
    previewMainImage: string | null;
    previewGalleryImages: GalleryImagePreview[];
    totalGalleryImages: number;
}

export interface ListingImageHandlers {
    handleMainImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    removeMainImage: () => void;
    handleGalleryImagesChange: (event: ChangeEvent<HTMLInputElement>) => void;
    removeGalleryImage: (index: number) => void;
}

export interface ListingFormValues {
    title: string;
    description: string;
    price: number | null;
    street_number: string;
    street_name: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    square_feet: number | null;
    lot_size: number | null;
    property_type: string;
    year_built: number | null;
    has_garage: boolean;
    garage_spaces: number | null;
    has_basement: boolean;
    hoa_fees: number | null;
    property_taxes: number | null;
    status: PropertyStatus;
    price_reduced: boolean;
    keywords: string[];
    main_image: File | null;
    gallery_images: File[];
}

export interface EditableListingFormValues extends ListingFormValues {
    remove_images: number[];
}

export type ListingFormFieldValue = string | string[] | number | boolean | null;
