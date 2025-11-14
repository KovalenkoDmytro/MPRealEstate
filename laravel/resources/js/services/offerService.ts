import {api} from "@/axios";

export type OfferPayload = {
    amount: string;
    message: string;
};

type updateOfferStatusResponse = {
    status : 'success' | 'error';
    message: string;
    data: { status : 'accepted' | 'rejected' };
    $errors? : []
}


export const offerService = {
    async makeOffer(listingId: number, payload: OfferPayload): Promise<updateOfferStatusResponse>{
        const formData = new FormData();
        formData.append("amount", payload.amount);
        formData.append("message", payload.message);

        const response = await api.post(
            route("buyer.listings.makeOffer", listingId, false), formData, {headers: {Accept: "application/json"}}
        );

        return response.data;
    },

    // async getUserOffers<T = any>(listingId: number): Promise<updateOfferStatusResponse> {
    //     const response = await api.get(route("buyer.listings.userOffers", listingId, false), {
    //         headers: {Accept: "application/json"},
    //     });
    //     return response.data;
    // },

    async updateOfferStatus(offerId: number, status: "accepted" | "rejected"): Promise<updateOfferStatusResponse>{
        const response = await api.patch(route('seller.offers.updateStatus', offerId),
            {status},
            {headers: {Accept: "application/json"}}
        );
        return response.data;
    }
};
