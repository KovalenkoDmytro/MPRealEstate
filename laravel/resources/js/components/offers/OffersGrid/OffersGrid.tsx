import React from "react";
import { Offer } from "@/types";
import { Typography, Stack, Pagination, Box, Grid } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import OfferCard from "@/components/offers/OffersGrid/OfferCard";
import { router } from "@inertiajs/react";

// Define the paginated structure matching Laravel's output
interface PaginatedOffers {
    data: Offer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface OffersGridProps {
    offers: PaginatedOffers;
}

export default function OffersGrid({ offers }: OffersGridProps) {
    const user = useAuth();
    const role = user.role;

    // Handle page change using Inertia
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        router.get(
            window.location.href,
            { page: value },
            { preserveState: true, preserveScroll: true }
        );
    };

    if (!offers.data || offers.data.length === 0) {
        return (
            <Typography mt={2} color="text.secondary">
                No offers available.
            </Typography>
        );
    }

    return (
        <Box>
            {/* Render Buyer Layout (Vertical Stack) */}
            {role === "buyer" ? (
                <Stack spacing={3} mt={4}>
                    {offers.data.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} role={"buyer"} />
                    ))}
                </Stack>
            ) : (
                // Render Seller Layout (Grid List)
                <Grid container spacing={3} sx={{ width: "100%", mt: 2 }}>
                    {offers.data.map((offer) => (
                        <Grid size={{ xs: 12 }} key={offer.id}>
                            <OfferCard offer={offer} role={"seller"} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Pagination Controls */}
            {offers.last_page > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                    <Pagination
                        count={offers.last_page}
                        page={offers.current_page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
}
