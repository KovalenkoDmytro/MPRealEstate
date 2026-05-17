import type { RealEstateListing } from "@/types";

export type AppointmentStatus =
    | "pending"
    | "accepted"
    | "rejected"
    | "cancelled by buyer";

export interface Appointment {
    id: number;
    buyer_id: number;
    seller_id: number;
    real_estate_listing_id: number;
    scheduled_at: string;
    status: AppointmentStatus;
    rejection_reason: string | null;
    access_code: string | null;
    buyer_cancelled_at: string | null;
    listing: RealEstateListing;
}
