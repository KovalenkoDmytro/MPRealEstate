import {api} from "@/axios";
import {OfferStatus} from "@/types";

export type OfferPayload = {
    amount: string;
    message: string;
};



export const offerService = {
    async makeOffer(listingId: number, payload: OfferPayload){
        const formData = new FormData();
        formData.append("amount", payload.amount);
        formData.append("message", payload.message);

        try {
            const response = await api.post(
                route("buyer.listings.makeOffer", listingId, false), formData, {headers: {Accept: "application/json"}}
            );
            return { status: 'success', data: response.data, message: response.data.message };

        }  catch (error: any) {
            if (error.response?.status === 422) {
                return { status: 'error', message: error.response.data.message ?? "" };
            }
            throw new Error(error.message || "Unexpected error occurred");
        }
    },

    async getUserOffers<T = any>(listingId: number): Promise<T> {
        const r = await api.get(route("buyer.listings.userOffers", listingId, false), {
            headers: {Accept: "application/json"},
        });
        return r.data as T;
    },

    async updateOfferStatus(
        offerId: number,
        status: "accepted" | "rejected"
    ){
        try {
            // keep relative URL; swap to a named route if you have one
            const r = await api.patch(route('seller.offers.updateStatus', offerId),
                {status},
                {headers: {Accept: "application/json"}}
            );
            return {ok: true, status: r.status, data: r.data as UpdateStatusOfferApiResponse};
        } catch (err: any) {
            const status = err?.response?.status ?? 0;
            const data = (err?.response?.data ?? null) as UpdateStatusOfferApiResponse | null;
            return Promise.reject(
                new Error(
                    (data as any)?.message
                        ? (data as any).message
                        : status ? `Request failed (${status})` : "Network error. Please try again later."
                )
            );
        }
    },
};
