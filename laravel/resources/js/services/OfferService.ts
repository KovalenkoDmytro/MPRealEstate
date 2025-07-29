export type OfferPayload = {
    amount: string;
    message: string;
};

export const offerService = {
    async makeOffer(listingId: number, payload: OfferPayload) {
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

            const json = await response.json();
            return { ok: response.ok, status: response.status, data: json };
        } catch (error) {
            console.error("Fetch failed:", error);
            throw new Error("Network error. Please try again later.");
        }
    },

    // Example placeholder methods for future extensions
    async getUserOffers(listingId: number) {
        const response = await fetch(route("buyer.listings.userOffers", listingId), {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        return await response.json();
    },
};
