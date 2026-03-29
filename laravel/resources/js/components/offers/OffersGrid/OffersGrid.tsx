import React from "react";
import { Offer, PaginatedResponse } from "@/types";
import { Typography, Stack, Box, Grid } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import OfferCard from "@/components/offers/OffersGrid/OfferCard";
import AppPagination from "@/components/common/AppPagination";

interface OffersGridProps {
    offers: PaginatedResponse<Offer>;
}

export default function OffersGrid({ offers }: OffersGridProps) {
    const user = useAuth();
    const role = user.role;

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
            <AppPagination
                pagination={offers}
                showFirstButton
                showLastButton
                sx={{ mt: 4, mb: 2 }}
            />
        </Box>
    );
}
