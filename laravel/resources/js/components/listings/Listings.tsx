import React from "react";
import { Grid, Typography, Box, Stack, Pagination } from "@mui/material"; // Added Pagination
import { RealEstateListing } from "@/types";
import ListingCard from "@/components/listing_new/ListingCard";
import PropertyMapSelector from "@/components/maps/PropertyMapSelect";
import ListingWideCard from "@/components/listing_new/ListingWideCard";
// Assuming you are using Inertia.js based on the Laravel context
import { router } from '@inertiajs/react';
import theme from "@/theme";

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

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {

        router.get(window.location.pathname, { page: value }, {
            preserveState: true,
            preserveScroll: true,
        });

    };

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
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={listings.last_page}
                    page={listings.current_page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    size="large"
                />
            </Box>
        </Box>
    );
}
