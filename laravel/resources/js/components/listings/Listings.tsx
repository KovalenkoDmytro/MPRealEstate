import React from "react";
import { Grid, Typography, Box, Stack } from "@mui/material";
import { RealEstateListing } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import ListingCard from "@/components/listing_new/ListingCard";
import PropertyMapSelector from "@/components/maps/PropertyMapSelect";
import ListingWideCard from "@/components/listing_new/ListingWideCard";

type ComponentProps = {
    listings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    favoriteListings: number[];
    viewMode: 'grid' | 'list' | 'map';
};

export default function Listings({ listings, favoriteListings, viewMode }: ComponentProps) {
    console.log(listings.data)
    if (!listings.data || listings.data.length === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                    No listings found.
                </Typography>
            </Box>
        );
    }


    if (viewMode === 'map') {
        return <PropertyMapSelector
            // listings={listings.data}
        />;
    }


    // const renderCard = (listing: RealEstateListing) => {
    //     if (isBuyer) {
    //         return (
    //             <ListingCard
    //                 listing={listing}
    //                 isFavorite={favoriteListings.includes(listing.id)}
    //             />
    //         );
    //     }
    //
    //     return <SellerListingCard listing={listing} />;
    // };


    if (viewMode === 'grid') {
        return (
            <Grid container spacing={3} className="listings-grid">
                {listings.data.map((listing) => (
                    <Grid sx={{sx: 12, md:6 ,lg:4}} key={listing.id} >
                        <ListingCard
                            listing={listing}
                            isFavorite={favoriteListings.includes(listing.id)}
                        />
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Stack spacing={2} className="listings-list">
            {listings.data.map((listing) => (
                <Box key={listing.id}>
                    <ListingWideCard
                        listing={listing}
                        isFavorite={favoriteListings.includes(listing.id)}
                    />
                </Box>
            ))}
        </Stack>
    );
}
