import { Appointment } from './appointment';
import {RealEstateListing, User} from "@/types";

export interface AppointmentWithListingSeller extends Appointment {
    listing: RealEstateListing;
    seller: User;
}

export interface AppointmentWithListingBuyer extends Appointment {
    listing: RealEstateListing;
    buyer: User;
}
