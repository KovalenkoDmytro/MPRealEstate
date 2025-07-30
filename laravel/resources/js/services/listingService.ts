export const listingService = {
    // Toggle favorite
    async toggleFavorite(listingId: number, isFavorite: boolean) {
        const url = isFavorite
            ? route("favorites.destroy", listingId)
            : route("favorites.store");

        const options: RequestInit = {
            method: isFavorite ? "DELETE" : "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN":
                    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
            },
            body: isFavorite ? undefined : JSON.stringify({ listing_id: listingId }),
        };

        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Failed to toggle favorite");
        return response.json();
    },

    // Apply filters (return filtered query object)
    applyFilters(form: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(form).filter(([_, value]) => value !== "" && value !== false)
        );
    },

    // Update seller listing
    async updateSellerListing(listingId: number, formData: FormData) {
        const response = await fetch(route("seller.listings.update", { listing: listingId }), {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": (
                    document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
                )?.content || "",
                Accept: "application/json",
                "X-HTTP-Method-Override": "PUT",
            },
            body: formData,
        });

        if (response.ok) {
            return { success: true };
        } else if (response.status === 422) {
            const json = await response.json();
            return { success: false, errors: json.errors };
        } else {
            console.error("Unexpected error", response);
            throw new Error("Unexpected error occurred");
        }
    },
};
