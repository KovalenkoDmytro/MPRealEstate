import {api} from "@/axios";


export type ApiStatus = "success" | "error";

export interface ApiErrorDetail {
    field?: string;     // optional, e.g. "condition_day"
    message: string;    // e.g. "The condition day must be a valid date."
}

export interface SetConditionDayResponse {
    status: ApiStatus;       // "success" | "error"
    message: string;         // human-readable summary
    errors?: ApiErrorDetail[]; // optional array of validation or logic errors
}



export const DealService = {
    async setDeposit(dealId: number, securityDeposit: number) {
        const r = await api
            .patch(route('seller.deals.setDeposit', dealId, false), {
                security_deposit: securityDeposit,
            });
        return r.data;
    },

    async markDepositMade(dealId: number, depositDateTime: Date) {
        const r = await api
            .patch(route('buyer.deals.markDepositMade', dealId, false), {
                is_security_deposit_made: true,
                security_deposit_made_at: depositDateTime,
            });
        return r.data;
    },

    async confirmDeposit(dealId: number, depositDateTime: Date) {
        const r = await api
            .patch(route('seller.deals.confirmDeposit', dealId, false), {
                is_security_deposit_confirmed: true,
                security_deposit_confirmed_at: depositDateTime,
            });
        return r.data;
    },

    async setConditionDay(dealId: number, conditionDay: string) {
        const response = await api
            .patch(route('buyer.deals.setConditionDay', dealId, false), {
                condition_day: conditionDay,
            });
        return response.data;
    },

    async confirmConditionDay(dealId: number): Promise<SetConditionDayResponse> {
        const r = await api
            .patch(route('seller.deals.confirmConditionDay', dealId, false), {});
        return r.data;
    },

    async setPossessionDay(dealId: number, possessionDay: string) {
        const r = await api
            .patch(route('buyer.deals.setPossessionDay', dealId, false), {
                possession_day: possessionDay,
            });
        return r.data;
    },

    async confirmPossessionDay(dealId: number) {
        const r = await api
            .patch(route('seller.deals.confirmPossessionDay', dealId, false), {});
        return r.data;
    },

    async inviteLawyer(dealId: number, lawyerCode: string) {
        const r = await api
            .post(route('deals.inviteLawyer', dealId, false), {
                lawyer_code: lawyerCode,
            });
        return r.data;
    },

    async breakTheDeal(dealId: number, message: string) {
        const r = await api
            .post(route('deals.break.request', dealId, false), {
                action: 'request',
                message,
            });
        return r.data;
    },

    async respondToBreakTheDeal(dealId: number, response: 'approved' | 'rejected') {
        const r = await api
            .post(route('deals.break.request', dealId, false), {
                action: 'respond',
                response,
            });
        return r.data;
    },
};
