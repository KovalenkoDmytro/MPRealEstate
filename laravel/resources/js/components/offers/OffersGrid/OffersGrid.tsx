import { Offer, PaginatedResponse } from "@/types";
import { Typography, Stack, Box, Grid } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import OfferCard from "@/components/offers/OffersGrid/OfferCard";
import AppPagination from "@/components/common/AppPagination";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconOffers from "@/icons/IconOffers";
import theme from "@/theme";

interface OffersGridProps {
    offers: PaginatedResponse<Offer>;
}

export default function OffersGrid({ offers }: OffersGridProps) {
    const user = useAuth();
    const role = user.role;
    const isBuyer = role === "buyer";

    if (!offers.data || offers.data.length === 0) {
        return (
            <Box
                sx={{
                    mt: 3,
                    p: { xs: 3, md: 5 },
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.border.main}`,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.background.white} 60%, ${theme.palette.secondary.main}10 100%)`,
                    textAlign: "center",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <IconContainer bgColor={`${theme.palette.primary.main}12`}>
                        <IconOffers color={theme.palette.primary.main} width={22} height={22} />
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
                    Offers Center
                </Typography>

                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    No offers available.
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        maxWidth: 620,
                        mx: "auto",
                        lineHeight: 1.8,
                        mb: 3,
                    }}
                >
                    {isBuyer
                        ? "You have not submitted any offers yet. Browse active listings and send your first offer when you find the right property."
                        : "Your properties have not received any offers yet. Publish or update listings to start attracting buyer interest."}
                </Typography>

                <Box sx={{ maxWidth: 260, mx: "auto" }}>
                    <Button
                        version="primary"
                        link={true}
                        text={isBuyer ? "Browse Listings" : "Add New Listing"}
                        href={isBuyer ? route("listings.index") : route("listings.create")}
                    />
                </Box>
            </Box>
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
