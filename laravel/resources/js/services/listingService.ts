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
};
