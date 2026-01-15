import React from "react";
import { Grid, Typography, Box, Stack, Pagination } from "@mui/material"; // Added Pagination
import { RealEstateListing } from "@/types";
import ListingCard from "@/components/listing_new/ListingCard";
import PropertyMapSelector from "@/components/maps/PropertyMapSelect";
import ListingWideCard from "@/components/listing_new/ListingWideCard";
// Assuming you are using Inertia.js based on the Laravel context
import { router } from '@inertiajs/react';

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
        // Option A: If using Inertia.js (Standard for Laravel + React)
        router.get(window.location.pathname, { page: value }, {
            preserveState: true,
            preserveScroll: true,
        });

        // Option B: If using standard React/Next.js router, replace with:
        // router.push(`/listings?page=${value}`);
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
        return <PropertyMapSelector />;
    }

    return (
        <Box>
            {/* Grid View */}
            {viewMode === 'grid' ? (
                <Grid container spacing={3} className="listings-grid">
                    {listings.data.map((listing) => (
                        <Grid sx={{xs:12, md:6, lg:4}} key={listing.id}>
                            <ListingCard
                                listing={listing}
                                isFavorite={favoriteListings.includes(listing.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                /* List View */
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
