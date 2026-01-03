import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { RealEstateListing } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import SellerListingCard from "@/components/listings/SellerListingCard";
import ListingCard from "@/components/listing_new/ListingCard";

type ComponentProps = {
    listings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    favoriteListings: number[];
};

export default function ListingsGrid({listings, favoriteListings}: ComponentProps) {
    const user = useAuth();
    const role = user.role;

    const isBuyer = role === "buyer";
    const isSeller = role === "seller";


    return (
        <Box className="listings-grid">
            {listings.data.length > 0 ? (
                <Grid container spacing={3}>

                    {isBuyer &&  (
                        <Grid  container spacing={4}>
                            {listings.data.map((listing) => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    isFavorite={favoriteListings.includes(listing.id)}
                                />
                            ))}
                        </Grid>
                    )}

                    {isSeller &&  (
                        <Grid container spacing={5}>
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
