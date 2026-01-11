import {User, BaseEntity, RealEstateListing, DealFile} from '@/types';
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
    deal_message: string | null;

    /** Security deposit amount */
    security_deposit: string | null;

    /** when seller sets required deposit */
    security_deposit_set_at: string | null;

    /** Whether security deposit has been made */
    is_security_deposit_made: boolean;

    /** Timestamp when deposit was made */
    security_deposit_made_at: string | null;

    /** Whether security deposit is confirmed */
    is_security_deposit_confirmed: boolean;

    /** Timestamp when deposit was confirmed */
    security_deposit_confirmed_at: string | null;

    /** Condition day selected by buyer */
    condition_day: string | null;

    /** Timestamp when condition day was selected */
    condition_day_selected_at: string | null;

    /** Whether condition day is confirmed */
    is_condition_day_confirmed: boolean;

    /** Timestamp when condition day was confirmed */
    condition_day_confirmed_at: string | null;

    /** Possession day selected by buyer */
    possession_day: string | null;

    /** Timestamp when possession day was selected */
    possession_day_selected_at: string | null;

    /** Whether possession day is confirmed */
    is_possession_day_confirmed: boolean;

    /** Timestamp when possession day was confirmed */
    possession_day_confirmed_at: string | null;

    /** Whether the deal is completed */
    is_completed: boolean;

    /** Timestamp when deal was completed */
    completed_at: string | null;

    /** Whether the deal is broken */
    is_broken: boolean;

    /** Timestamp when deal was broken */
    broken_at: string | null;

    /** ID of the associated real estate listing */
    real_estate_listing_id: number | null;

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
    files: DealFile[];
}
