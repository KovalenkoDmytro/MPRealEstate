import {Appointment} from "@/types/realEstateListing";

export interface DailyStat {
    date: string;
    total: number;
}

export interface SellerStats {
    summary: {
        total_last_30_days: number;
        breakdown: {
            pending: number;
            completed: number;
            cancelled: number;
        }
    };
    chart_data: {
        last_7_days: DailyStat[];
    };
}



export type SellerAppointmentsStat = {
    today_appointments: Appointment[]
    upcoming_appointments: Appointment[]
    canceled_appointments: Appointment[]
    pending_appointments: Appointment[]
    accepted_appointments: Appointment[]
    past_appointments:Appointment[]
}


export interface SellerAppointmentsPage extends SellerAppointmentsStat {
    all_appointments: Appointment[];
}


