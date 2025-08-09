import { api } from "@/axios";

export const listingService = {
    // Toggle favorite
    async toggleFavorite(listingId: number, isFavorite: boolean) {
        if (isFavorite) {
            const r = await api.delete(route("favorites.destroy", listingId, false));
            return r.data;
        } else {
            const r = await api.post(route("favorites.store", [], false), {
                listing_id: listingId,
            });
            return r.data;
        }
    },

    // Apply filters (return filtered query object)
    applyFilters(form: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(form).filter(([, value]) => value !== "" && value !== false)
        );
    },

    // Update seller listing (multipart)
    async updateSellerListing(listingId: number, formData: FormData) {
        try {
            const r = await api.put(
                route("seller.listings.update", { listing: listingId }, false),
                formData,
                { headers: { Accept: "application/json" } } // let Axios set multipart boundary
            );
            return { success: true, data: r.data };
        } catch (err: any) {
            if (err.response?.status === 422) {
                return { success: false, errors: err.response.data?.errors ?? {} };
            }
            console.error("Unexpected error", err);
            throw new Error(err.message || "Unexpected error occurred");
        }
    },

    // Create seller listing (multipart)
    async createSellerListing(formData: FormData) {
        try {
            const r = await api.post(
                route("seller.listings.store", [], false),
                formData,
                { headers: { Accept: "application/json" } }
            );
            return { success: true, data: r.data };
        } catch (err: any) {
            if (err.response?.status === 422) {
                return { success: false, errors: err.response.data?.errors ?? {} };
            }
            console.error("Unexpected error", err);
            throw new Error(err.message || "Unexpected error occurred");
        }
    },
};
