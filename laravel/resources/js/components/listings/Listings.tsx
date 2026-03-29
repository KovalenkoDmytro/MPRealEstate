import React from "react";
import { Grid, Typography, Box, Stack } from "@mui/material";
import { PaginatedResponse, RealEstateListing } from "@/types";
import ListingCard from "@/components/listing_new/ListingCard";
import PropertyMapSelector from "@/components/maps/PropertyMapSelect";
import ListingWideCard from "@/components/listing_new/ListingWideCard";
import theme from "@/theme";
import AppPagination from "@/components/common/AppPagination";

type ComponentProps = {
    listings: PaginatedResponse<RealEstateListing>;
    favoriteListings: number[];
    viewMode: 'grid' | 'list' | 'map';
};

export default function Listings({ listings, favoriteListings, viewMode }: ComponentProps) {
    if (!listings.data || listings.data.length === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                    No listings found.
                </Typography>
            </Box>
        );
    }

    // Map View
    if (viewMode === 'map') {
        return (
            <Box sx={{
                height: '80vh',
                width: '100%',
                borderRadius: theme.shape.borderRadius,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.border.main}`,
                borderColor: theme.palette.border.main,
            }}>
                <PropertyMapSelector />
            </Box>
        );
    }

    return (
        <Box>
            {/* Grid View */}
            {viewMode === 'grid' ? (
                <Grid container spacing={4} className="listings-grid">
                    {listings.data.map((listing) => (
                        <Grid size={{xs:12, md:6, lg:4}} key={listing.id}>
                            <ListingCard
                                listing={listing}
                                isFavorite={favoriteListings.includes(listing.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                /* List View */
                <Stack spacing={4} className="listings-list">
                    {listings.data.map((listing) => (
                        <Box key={listing.id}>
                            <ListingWideCard
                                listing={listing}
                                isFavorite={favoriteListings.includes(listing.id)}
                            />
                        </Box>
                    ))}
                </Stack>
            )}

            {/* Pagination Controls */}
            <AppPagination pagination={listings} />
        </Box>
    );
}
