import React from "react";
import { Grid, Typography, Box, Stack, CircularProgress } from "@mui/material";
import { PaginatedResponse, RealEstateListing } from "@/types";
import ListingCard from "@/components/listing_new/ListingCard";
import PropertyMapSelector from "@/components/maps/PropertyMapSelect";
import ListingWideCard from "@/components/listing_new/ListingWideCard";
import theme from "@/theme";
import AppPagination from "@/components/common/AppPagination";
import IconContainer from "@/components/common/IconContainer";
import IconHome from "@/icons/IconHome";

type ComponentProps = {
    listings: PaginatedResponse<RealEstateListing>;
    favoriteListings: number[];
    viewMode: 'grid' | 'list' | 'map';
    isLoading?: boolean;
};

export default function Listings({ listings, favoriteListings, viewMode, isLoading = false }: ComponentProps) {
    if (!listings.data || listings.data.length === 0) {
        return (
            <Box sx={{ mt: 4, position: "relative" }}>
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

                <Box
                    sx={{
                        opacity: isLoading ? 0.35 : 1,
                        p: { xs: 3, md: 5 },
                        borderRadius: theme.shape.borderRadius,
                        border: `1px solid ${theme.palette.border.main}`,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.background.white} 60%, ${theme.palette.secondary.main}10 100%)`,
                        boxShadow: '0 14px 35px rgba(0, 0, 0, 0.04)',
                        textAlign: "center",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <IconContainer bgColor={`${theme.palette.primary.main}12`}>
                            <IconHome color={theme.palette.primary.main} width={22} height={22} />
                        </IconContainer>
                    </Box>

                    <Typography
                        variant="overline"
                        sx={{
                            color: theme.palette.primary.main,
                            letterSpacing: "0.14em",
                            fontWeight: 700,
                            display: "block",
                            mb: 1,
                        }}
                    >
                        Search Results
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        No listings found.
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            maxWidth: 560,
                            mx: "auto",
                            lineHeight: 1.8,
                        }}
                    >
                        Try adjusting your filters, broadening the city or price range, or removing a few conditions to see more available properties.
                    </Typography>
                </Box>
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
