import { api } from "@/axios";
import {ApiResponseBase} from "@/services/dealService";

type CreateAppointmentData = {
    listing_id: number;
    scheduled_at: string;
};

type ApproveData = {
    appointment_id: number;
    action: "approve";
    access_code: string;
};

type RejectData = {
    appointment_id: number;
    action: "reject";
    rejection_reason: string;
};
export type AppointmentActionData = ApproveData | RejectData;

export const appointmentService = {
    async create(formData :CreateAppointmentData ): Promise<ApiResponseBase>  {
       const {data} = await api.post(route('appointments.store'),{
           ...formData,
       });
       return data;
    },

    async handle(data: AppointmentActionData) {
        const response = await api.post(route('seller.appointments.handle'), data);
        return response.data;
    }
};
