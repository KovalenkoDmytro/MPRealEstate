import { Grid, Typography, Box, Stack } from "@mui/material";
import { PaginatedResponse, RealEstateListing } from "@/types";
import ListingCard from "@/components/listing_new/ListingCard";
import PropertyMapSelector from "@/components/maps/PropertyMapSelect";
import ListingWideCard from "@/components/listing_new/ListingWideCard";
import theme from "@/theme";
import AppPagination from "@/components/common/AppPagination";
import IconContainer from "@/components/common/IconContainer";
import IconHome from "@/icons/IconHome";
import Loading from "@/design/Loading";
import EmptyState from "@/design/EmptyState";

type ListingsProps = {
    listings: PaginatedResponse<RealEstateListing>;
    favoriteListings: number[];
    viewMode: 'grid' | 'list' | 'map';
    isLoading?: boolean;
};

export default function Listings({ listings, favoriteListings, viewMode, isLoading = false }: ListingsProps) {
    if (!listings.data || listings.data.length === 0) {
        return (
            <Box sx={{ mt: 4, position: "relative" }}>
                {isLoading && <Loading overlay label="Applying filters..." />}

                <Box sx={{ opacity: isLoading ? 0.35 : 1 }}>
                    <EmptyState
                        icon={
                            <IconContainer>
                                <IconHome width={22} height={22} />
                            </IconContainer>
                        }
                        eyebrow="Search Results"
                        title="No listings found."
                        description="Try adjusting your filters, broadening the city or price range, or removing a few conditions to see more available properties."
                    />
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
                {isLoading && <Loading overlay label="Applying filters..." />}
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative" }}>
            {isLoading && <Loading overlay label="Applying filters..." />}

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
