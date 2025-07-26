import {User, RealEstateListing, BaseEntity} from '@/types'

/**
 * Represents the status of an offer on a real estate listing
 */
export enum OfferStatus {
    /** Offer is awaiting response */
    Pending = 'pending',
    /** Offer has been accepted by the seller */
    Accepted = 'accepted',
    /** Offer has been rejected by the seller */
    Rejected = 'rejected',
}

/**
 * Represents an offer made by a buyer on a real estate listing
 */
export interface Offer extends BaseEntity {
    /** Price offered by the buyer in dollars */
    offer_price: number;
    /** Message from the buyer to the seller */
    message: string;
    /** Current status of the offer */
    status: OfferStatus;
    /** The real estate listing the offer is made on */
    listing: RealEstateListing;
    /** The user who made the offer */
    buyer: User;
}
