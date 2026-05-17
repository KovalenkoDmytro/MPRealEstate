import { api } from "@/axios";

export type ApiStatus = "success" | "error";

export interface ApiErrorDetail {
    field?: string;
    message: string;
}

export interface ApiResponseBase {
    status: ApiStatus;
    message: string;
    errors?: ApiErrorDetail[];
}

/**
 * Deal Service — handles all deal-related API operations.
 */
export const DealService = {
    async setDeposit(dealId: number, securityDeposit: number): Promise<ApiResponseBase> {
        const { data } = await api.patch(route("deals.setDeposit", dealId, false), {
            security_deposit: securityDeposit,
        });
        return data;
    },

    async markDepositMade(dealId: number, depositDateTime: Date): Promise<ApiResponseBase> {
        const { data } = await api.patch(route("deals.markDepositMade", dealId, false), {
            is_security_deposit_made: true,
            security_deposit_made_at: depositDateTime,
        });
        return data;
    },

    async confirmDeposit(dealId: number, depositDateTime: Date): Promise<ApiResponseBase> {
        const { data } = await api.patch(route("deals.confirmDeposit", dealId, false), {
            is_security_deposit_confirmed: true,
            security_deposit_confirmed_at: depositDateTime,
        });
        return data;
    },

    async setConditionDay(dealId: number, conditionDay: string): Promise<ApiResponseBase> {
        const { data } = await api.patch(route("deals.setConditionDay", dealId, false), {
            condition_day: conditionDay,
        });
        return data;
    },

    async confirmConditionDay(dealId: number): Promise<ApiResponseBase> {
        const { data } = await api.patch(route("deals.confirmConditionDay", dealId, false), {});
        return data;
    },

    async setPossessionDay(dealId: number, possessionDay: string): Promise<ApiResponseBase> {
        const { data } = await api.patch(route("deals.setPossessionDay", dealId, false), {
            possession_day: possessionDay,
        });
        return data;
    },

    async confirmPossessionDay(dealId: number): Promise<ApiResponseBase> {
        const { data } = await api.patch(route("deals.confirmPossessionDay", dealId, false), {});
        return data;
    },

    async inviteLawyer(dealId: number, lawyerCode: string): Promise<ApiResponseBase> {
        const { data } = await api.post(route("deals.inviteLawyer", dealId, false), {
            lawyer_code: lawyerCode,
        });
        return data;
    },

    async breakTheDeal(dealId: number, message: string): Promise<ApiResponseBase> {
        const { data } = await api.post(route("deals.break.request", dealId, false), {
            action: "request",
            message,
        });
        return data;
    },

    async respondToBreakTheDeal(
        dealId: number,
        response: "approved" | "rejected",
        message?: string
    ): Promise<ApiResponseBase> {
        const payload: {
            action: "respond";
            response: "approved" | "rejected";
            message?: string;
        } = {
            action: "respond",
            response,
        };

        if (message?.trim()) {
            payload.message = message.trim();
        }

        const { data } = await api.post(route("deals.break.request", dealId, false), {
            ...payload,
        });
        return data;
    },
};
