import type { BaseEntity } from './baseEntity';

/**
 * Represents the role of a user in the system
 */
export enum UserRole {
    /** Legal representative for buyers or sellers */
    Lawyer = 'lawyer',
    /** User who sells properties */
    Seller = 'seller',
    /** User who buys properties */
    Buyer = 'buyer',
    /** System administrator */
    Admin = 'admin'
}

/**
 * Represents a user in the system
 */
export interface User extends BaseEntity {
    /** Full name of the user */
    name: string;
    /** Email address of the user */
    email: string;
    /** Timestamp when the email was verified, or null if not verified */
    email_verified_at: string | null;
    /** Phone number of the user */
    phone_number: string;
    /** Role of the user in the system */
    role: UserRole;
    /** Whether the user is a lawyer representing buyers */
    is_buyer_lawyer: boolean;
    /** Whether the user is a lawyer representing sellers */
    is_seller_lawyer: boolean;
    /** Lawyer's registration number, if applicable */
    lawyer_number: string | null;
}
