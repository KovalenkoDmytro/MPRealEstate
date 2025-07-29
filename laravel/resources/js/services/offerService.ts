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
            const response = await fetch(route("buyer.listings.makeOffer", listingId), {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                    Accept: "application/json",
                },
                body: formData,
            });

            const data: MakeOfferApiResponse = await response.json();
            return { ok: response.ok, status: response.status, data };
        } catch (error) {
            console.error("Fetch failed:", error);
            throw new Error("Network error. Please try again later.");
        }
    },

    async getUserOffers<T = any>(listingId: number): Promise<T> {
        const response = await fetch(route("buyer.listings.userOffers", listingId), {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user offers (Status: ${response.status})`);
        }

        return response.json();
    },

    async updateOfferStatus(
        offerId: number,
        status: "accepted" | "rejected"
    ): Promise<ApiResponse<UpdateStatusOfferApiResponse>> {
        try {
            const response = await fetch(`/seller/offers/${offerId}/update-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                    Accept: "application/json",
                },
                body: JSON.stringify({ status }),
            });

            const data: UpdateStatusOfferApiResponse = await response.json();
            return { ok: response.ok, status: response.status, data };
        } catch (error) {
            console.error("Update offer status failed:", error);
            throw new Error("Network error. Please try again later.");
        }
    }
};
