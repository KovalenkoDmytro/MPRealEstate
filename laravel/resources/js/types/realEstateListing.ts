import {User, BaseEntity} from '@/types';

/**
 * Represents the status of a property listing
 */
export enum PropertyStatus {
    /** Property is available for purchase */
    Available = 'available',
    /** Property has been sold */
    Sold = 'sold',
    /** Property has a pending offer or deal */
    Pending = 'pending'
}

/**
 * Represents an image associated with a property listing
 */
export interface Image extends BaseEntity {
    /** Unique identifier property listing */
    real_estate_listing_id: number;
    /** Path to the image file */
    image_path: string;
    /** Whether this is the main image true or not false */
    is_main: boolean;
}

/**
 * Represents a scheduled appointment between a buyer and a seller
 * for viewing a real estate listing.
 */
export interface Appointment {
    /** Unique identifier of the appointment */
    id: number;

    /** ID of the buyer requesting the appointment */
    buyer_id: number;

    /** ID of the seller receiving the request */
    seller_id: number;

    /** ID of the related real estate listing */
    real_estate_listing_id: number;

    buyer_cancelled_at:  string | null;

    /** Scheduled date & time of the appointment (ISO string with timezone) */
    scheduled_at: string;

    /**
     * Current status of the appointment
     * - pending: awaiting seller's response
     * - accepted: seller approved the appointment
     * - rejected: seller denied the appointment
     */
    status: "pending" | "accepted" | "rejected" | "cancelled by buyer";

    /** Lockbox code provided by the seller when accepting (optional) */
    access_code: string | null;

    /** Explanation provided by the seller if the appointment is rejected */
    rejection_reason: string | null;
}

/**
 * Represents a real estate listing in the system
 */
export interface RealEstateListing extends BaseEntity {
    /** Title of the property listing */
    title: string;
    /** Detailed description of the property */
    description: string;
    /** Listing price in dollars */
    price: number;

    // --- Location / Address Fields ---
    /** Street number (e.g., "2715") */
    street_number: string;
    /** Unit/Apartment number (optional) */
    unit_number: string | null;
    /** Street name (e.g., "12 Avenue Southeast") */
    street_name: string;
    /** City (e.g., "Calgary") */
    city: string;
    /** Province or State (e.g., "Alberta") */
    province: string;
    /** Postal or Zip code */
    postal_code: string;
    /** Country name */
    country: string;

    // --- Coordinates ---
    /** Geographic latitude */
    latitude: number;
    /** Geographic longitude */
    longitude: number;

    /** Number of bedrooms */
    bedrooms: number;
    /** Number of bathrooms */
    bathrooms: number;
    /** Total square footage of the property */
    square_feet: number;
    /** Current status of the listing */
    status: PropertyStatus;
    /** ID of the seller */
    seller_id: number;
    /** the seller */
    seller: User;
    /** Main property image */
    main_image: Image;
    /** Additional property images */
    images: Image[];
    /** Size of the lot in acres/sqft */
    lot_size: number | null;
    /** Type of property (e.g., single-family, condo) */
    property_type: string;
    /** Year the property was built */
    year_built: number;
    /** Whether the property has a garage */
    has_garage: boolean;
    /** Number of garage spaces */
    garage_spaces: number | null;
    /** Whether the property has a basement */
    has_basement: boolean;
    /** Homeowner association fees */
    hoa_fees: number | null;
    /** Annual property taxes */
    property_taxes: number;
    /** Whether the price has been reduced */
    price_reduced: boolean;
    /** Total number of times this listing page has been viewed (all users) */
    views_count?: number;
    /** Number of unique users who have viewed this listing */
    unique_viewers_count?: number;
    /** Search keywords */
    keywords: string[];
    /** Appointments */
    appointments?: Appointment[];
}
