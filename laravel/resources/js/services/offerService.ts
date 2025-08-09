import { api } from "@/axios";
import { OfferStatus } from "@/types";

export type OfferPayload = {
    amount: string;
    message: string;
};

export type MakeOfferApiResponse = {
    offer_id: number;
    listing_id: number;
    status: OfferStatus;
};

export type UpdateStatusOfferApiResponse = {
    offerStatus: OfferStatus;
};

export type ApiResponse<T> = {
    ok: boolean;
    status: number;
    data: T;
};

export const offerService = {
    async makeOffer(
        listingId: number,
        payload: OfferPayload
    ): Promise<ApiResponse<MakeOfferApiResponse>> {
        const formData = new FormData();
        formData.append("amount", payload.amount);
        formData.append("message", payload.message);

        try {
            const r = await api.post(
                route("buyer.listings.makeOffer", listingId, false),
                formData,
                { headers: { Accept: "application/json" } }
            );
            return { ok: true, status: r.status, data: r.data as MakeOfferApiResponse };
        } catch (err: any) {
            const status = err?.response?.status ?? 0;
            const data = (err?.response?.data ?? null) as MakeOfferApiResponse | null;
            return Promise.reject(
                new Error(
                    data && (data as any).message
                        ? (data as any).message
                        : status ? `Request failed (${status})` : "Network error. Please try again later."
                )
            );
        }
    },

    async getUserOffers<T = any>(listingId: number): Promise<T> {
        const r = await api.get(route("buyer.listings.userOffers", listingId, false), {
            headers: { Accept: "application/json" },
        });
        return r.data as T;
    },

    async updateOfferStatus(
        offerId: number,
        status: "accepted" | "rejected"
    ): Promise<ApiResponse<UpdateStatusOfferApiResponse>> {
        try {
            // keep relative URL; swap to a named route if you have one
            const r = await api.patch(
                `/seller/offers/${offerId}/update-status`,
                { status },
                { headers: { Accept: "application/json" } }
            );
            return { ok: true, status: r.status, data: r.data as UpdateStatusOfferApiResponse };
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
