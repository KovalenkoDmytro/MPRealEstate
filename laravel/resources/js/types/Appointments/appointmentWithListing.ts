import type { Appointment } from './appointment';
import type { RealEstateListing } from "../realEstateListing";
import type { User } from "../user";

export interface AppointmentWithListingSeller extends Appointment {
    listing: RealEstateListing;
    seller: User;
}

export interface AppointmentWithListingBuyer extends Appointment {
    listing: RealEstateListing;
    buyer: User;
}
