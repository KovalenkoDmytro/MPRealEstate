import React from "react";
import { Grid, Typography, Box, Stack, CircularProgress } from "@mui/material";
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
    isLoading?: boolean;
};

export default function Listings({ listings, favoriteListings, viewMode, isLoading = false }: ComponentProps) {
    if (!listings.data || listings.data.length === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: "center", position: "relative" }}>
                {isLoading && (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            minHeight: 180,
                            bgcolor: "rgba(255,255,255,0.72)",
                            backdropFilter: "blur(2px)",
                            borderRadius: theme.shape.borderRadius,
                        }}
                    >
                        <CircularProgress color="primary" />
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Applying filters...
                        </Typography>
                    </Box>
                )}
                <Typography variant="body1" color="text.secondary" sx={{ opacity: isLoading ? 0.35 : 1 }}>
                    No listings found.
                </Typography>
            </Box>
        );
    }

    // Map View
    if (viewMode === 'map') {
        return (
            <Box sx={{ position: "relative" }}>
                <Box sx={{
                    height: '80vh',
                    width: '100%',
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.border.main}`,
                    borderColor: theme.palette.border.main,
                }}>
                    <PropertyMapSelector listings={listings.data} />
                </Box>
                {isLoading && (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 3,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            bgcolor: "rgba(255,255,255,0.62)",
                            backdropFilter: "blur(2px)",
                            borderRadius: theme.shape.borderRadius,
                        }}
                    >
                        <CircularProgress color="primary" />
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Applying filters...
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative" }}>
            {isLoading && (
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        minHeight: 320,
                        bgcolor: "rgba(255,255,255,0.72)",
                        backdropFilter: "blur(2px)",
                        borderRadius: theme.shape.borderRadius,
                    }}
                >
                    <CircularProgress color="primary" />
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Applying filters...
                    </Typography>
                </Box>
            )}

            {/* Grid View */}
            {viewMode === 'grid' ? (
                <Grid container spacing={4} className="listings-grid" sx={{ opacity: isLoading ? 0.35 : 1 }}>
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
                <Stack spacing={4} className="listings-list" sx={{ opacity: isLoading ? 0.35 : 1 }}>
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
            <Box sx={{ opacity: isLoading ? 0.35 : 1, pointerEvents: isLoading ? "none" : "auto" }}>
                <AppPagination pagination={listings} />
            </Box>
        </Box>
    );
}
