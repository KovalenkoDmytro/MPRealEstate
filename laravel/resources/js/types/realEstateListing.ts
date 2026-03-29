import type { Appointment } from "./Appointments";
import type { BaseEntity } from "./baseEntity";
import type { User } from "./user";

/**
 * Represents the status of a property listing
 */
export enum PropertyStatus {
    /** Property is available for purchase */
    Available = "available",
    /** Property has been sold */
    Sold = "sold",
    /** Property has a pending offer or deal */
    Pending = "pending",
}

/**
 * Address data stored for a listing.
 */
export interface ListingAddress {
    street_number: string;
    unit_number: string | null;
    street_name: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
}

/**
 * Geolocation data stored for a listing.
 */
export interface ListingCoordinates {
    latitude: number;
    longitude: number;
}

/**
 * Represents an image associated with a property listing.
 */
export interface ListingImage extends BaseEntity {
    real_estate_listing_id: number;
    image_path: string;
    is_main: boolean;
}

export type Image = ListingImage;

/**
 * Represents a real estate listing in the system.
 */
export interface RealEstateListing extends BaseEntity, ListingAddress, ListingCoordinates {
    /** Optional display-ready formatted location string */
    location?: string;
    title: string;
    description: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    status: PropertyStatus;
    seller_id: number;
    seller: User;
    main_image: ListingImage | null;
    images: ListingImage[];
    lot_size: number | null;
    property_type: string;
    year_built: number;
    has_garage: boolean;
    garage_spaces: number | null;
    has_basement: boolean;
    hoa_fees: number | null;
    property_taxes: number;
    price_reduced: boolean;
    views_count?: number;
    unique_viewers_count?: number;
    keywords: string[];
    appointments?: Appointment[];
}
