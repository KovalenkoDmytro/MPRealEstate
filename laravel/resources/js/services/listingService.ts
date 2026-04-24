import { api } from "@/axios";

export const listingService = {
    // Toggle favorite
    async toggleFavorite(listingId: number, isFavorite: boolean) {
        if (isFavorite) {
            const response = await api.delete(`/buyer/listings/favorites/${listingId}`);
            return response.data;
        } else {
            const response = await api.post("/buyer/listings/favorites", {
                listing_id: listingId,
            });
            return response.data;
        }
    },

    // Apply filters (return filtered query object)
    applyFilters(form: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(form).filter(([, value]) => value !== "" && value !== false)
        );
    },

    // Update seller listing (multipart)
    async updateListing(listingId: number, formData: FormData) {
        formData.append("_method", "PUT");
        try {
            const response = await api.post(
                route("listings.update", { listing: listingId }, false),
                formData,
                { headers: { Accept: "application/json"} } // let Axios set multipart boundary
            );
            return { success: true, data: response.data, message: response.data.message };
        } catch (err: any) {
            if (err.response?.status === 422) {
                return { success: false, errors: err.response.data.errors ?? {}, message: err.response.data.message ?? "" };
            }
            throw new Error(err.message || "Unexpected error occurred");
        }
    },

    // Create seller listing (multipart)
    async createListing(formData: FormData) {
        try {
            const response = await api.post(
                route("listings.store", [], false),
                formData,
                { headers: { Accept: "application/json" } }
            );
            return { success: true, data: response.data, message: response.data.message };
        } catch (err: any) {
            if (err.response?.status === 422) {
                return { success: false, errors: err.response.data.errors ?? {}, message: err.response.data.message ?? "" };
            }
            throw new Error(err.message || "Unexpected error occurred");
        }
    },

    async deactivateListing(listingId: number) {
        try {
            const response = await api.delete(route("listings.deactivate", listingId, false), {
                headers: { Accept: "application/json" },
            });

            return { success: true, data: response.data, message: response.data.message };
        } catch (err: any) {
            if (err.response?.status === 422 || err.response?.status === 403) {
                return {
                    success: false,
                    errors: err.response.data.errors ?? {},
                    message: err.response.data.message ?? "Unable to deactivate listing.",
                };
            }

            throw new Error(err.message || "Unexpected error occurred");
        }
    }
};
