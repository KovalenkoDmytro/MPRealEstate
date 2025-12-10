import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { RealEstateListing } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import SellerListingCard from "@/components/listings/SellerListingCard";
import {BuyerListingCard} from "@/components/listings/BuyerListingCard";

type ComponentProps = {
    listings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    isFavorite?: (listingId: number) => boolean;
};

export default function ListingsGrid({listings, isFavorite,}: ComponentProps) {
    const user = useAuth();
    const role = user.role;

    const isBuyer = role === "buyer" && isFavorite;
    const isSeller = role === "seller";

    return (
        <Box>
            {listings.data.length > 0 ? (
                <Grid container spacing={3}>

                    {isBuyer &&  (
                        <Grid  size={{ xs: 12, sm: 6, md: 3 }} container spacing={4}>
                            {listings.data.map((listing, index) => (
                                <BuyerListingCard
                                    key={index}
                                    listing={listing}
                                    isFavorite={isFavorite}
                                />
                            ))}
                        </Grid>
                    )}

                    {isSeller &&  (
                        <Grid size={{ xs: 12}} container spacing={5}>
                            {listings.data.map((listing,index) => (
                                <SellerListingCard listing={listing} key={index}/>
                            ))}
                        </Grid>
                    )}

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
