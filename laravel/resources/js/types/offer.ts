import type { BaseEntity } from './baseEntity';
import type { RealEstateListing } from './realEstateListing';
import type { User } from './user';

/**
 * Represents the status of an offer on a real estate listing
 */
export enum OfferStatus {
    /** Offer is awaiting response */
    Pending = 'pending',
    /** The seller has accepted the offer */
    Accepted = 'accepted',
    /** The seller has rejected the offer */
    Rejected = 'rejected',
}

/**
 * Represents an offer made by a buyer on a real estate listing
 */
export interface Offer extends BaseEntity {
    /** Price offered by the buyer in dollars */
    amount: number;
    /** Message from the buyer to the seller */
    message: string;
    /** Current status of the offer */
    status: OfferStatus;
    /** The real estate listing the offer is made on */
    listing: RealEstateListing;
    /** The user who made the offer */
    buyer: User;
}
