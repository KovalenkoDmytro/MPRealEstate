import type { Appointment } from "./appointment";

export interface BuyerAppointmentsStat {
    today_appointments: Appointment[]
    upcoming_appointments: Appointment[]
    canceled_appointments: Appointment[]
    rejected_appointments: Appointment[]
    pending_appointments: Appointment[]
    accepted_appointments: Appointment[]
    past_appointments:Appointment[]
}


export interface BuyerAppointmentsPage extends BuyerAppointmentsStat {
    all_appointments: Appointment[];
}

