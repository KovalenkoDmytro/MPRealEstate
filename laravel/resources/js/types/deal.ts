import {User, BaseEntity, RealEstateListing, File} from '@/types';
/**
 * Represents a real estate deal between buyers and sellers
 */

/**
 * Represents the status of the Break on a real estate listing
 */
export enum BreakStatus {
    /** Break is awaiting response */
    Pending = 'pending',
    /** The seller/bayer has accepted break */
    Accepted = 'accepted',
    /** The seller/bayer has rejected break */
    Rejected = 'rejected',
}

export interface Deal extends BaseEntity {
    /** Name/title of the deal */
    name: string;
    /** Deal amount in dollars */
    amount: number;
    /** Optional message from the seller */
    seller_message: string | null;
    /** Whether the deal is confirmed by all parties */
    is_security_deposit_confirmed: boolean;
    /** Whether the deal has been made */
    is_security_deposit_made: boolean;
    /** ID of the associated real estate listing */
    real_estate_listing_id: number | null;
    /** Whether the condition day is confirmed */
    is_condition_day_confirmed: boolean;
    /** Whether the possession day is confirmed */
    is_possession_day_confirmed: boolean;
    /** Whether the deal is completed */
    is_completed: boolean;
    /** Whether the deal is broken */
    is_broken: boolean;
    /** Condition day date */
    condition_day: string | null;
    /** Possession day date */
    possession_day: string | null;
    /** Security deposit amount */
    security_deposit: string | null;
    /** Associated users (buyers, sellers, lawyers) */
    users: User[];
    /** Break request information if applicable */
    break_request: null | {
        initiator_id: number;
        message: string;
        status: BreakStatus;
    };
}


export interface PropertyDetail extends Deal {
    real_estate_listing: RealEstateListing;
    files: File[];
}
