import {RealEstateListing} from "@/types/realEstateListing";

export interface Appointment {
    id: number;
    buyer_id: number;
    seller_id: number;
    real_estate_listing_id: number;
    scheduled_at: string;
    status: "pending" | "accepted" | "rejected" | "cancelled by buyer";
    rejection_reason: string | null;
    access_code: string | null;
    buyer_cancelled_at: string | null;
    listing: RealEstateListing;
}
