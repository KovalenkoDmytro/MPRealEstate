import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { RealEstateListing } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import SellerListingCard from "@/components/listings/SellerListingCard";
import BuyerListingCard from "@/components/listings/BuyerListingCard";

type ComponentProps = {
    listings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    isFavorite?: (listingId: number) => boolean;
    toggleFavorite?: (
        e: React.FormEvent,
        listingId: number,
        isCurrentlyFavorite: boolean
    ) => void;
};

export default function ListingsGrid({listings, isFavorite, toggleFavorite,}: ComponentProps) {
    const user = useAuth();
    const role = user.role;

    return (
        <Box>
            {listings.data.length > 0 ? (
                <Grid container spacing={3}>
                    {listings.data.map((listing) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={listing.id}>
                            {role === "buyer" && isFavorite && toggleFavorite &&  (
                                <BuyerListingCard
                                    listing={listing}
                                    isFavorite={isFavorite}
                                    toggleFavorite={toggleFavorite}
                                />
                            )}
                            {role === "seller" && <SellerListingCard listing={listing} />}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="body1" color="text.secondary">
                        No listings found.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
