import { Offer, PaginatedResponse } from "@/types";
import { Typography, Box } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import OfferCard from "@/components/offers/OffersGrid/OfferCard";
import AppPagination from "@/components/common/AppPagination";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconOffers from "@/icons/IconOffers";
import { neutral, primary, radius } from '@/design/tokens';
import { useTwoRowGridHeight } from '@/hooks/useTwoRowGridHeight';

interface OffersGridProps {
    offers: PaginatedResponse<Offer>;
}

export default function OffersGrid({ offers }: OffersGridProps) {
    const { gridRef, height } = useTwoRowGridHeight(offers.data);
    const user = useAuth();
    const role = user.role;
    const isBuyer = role === "buyer";

    if (!offers.data || offers.data.length === 0) {
        return (
            <Box
                sx={{
                    mt: 3,
                    p: { xs: 3, md: 5 },
                    borderRadius: radius.lg,
                    border: `1px solid ${neutral[200]}`,
                    bgcolor: neutral[50],
                    textAlign: "center",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <IconContainer bgColor={primary[50]}>
                        <IconOffers color={primary[600]} width={22} height={22} />
                    </IconContainer>
                </Box>

                <Typography
                    variant="overline"
                    sx={{
                        color: primary[600],
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
                        color: neutral[800],
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    No offers available.
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: neutral[600],
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
            <Box sx={{ mt: 4, maxHeight: { xs: 'none', md: height ?? 'none' }, overflowY: { xs: 'visible', md: 'auto' }, pr: { xs: 0, md: 1 }, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: neutral[400], borderRadius: radius.pill } }}>
            <Box ref={gridRef} sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, '@media (min-width: 1800px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
                {offers.data.map((offer) => <OfferCard key={offer.id} offer={offer} role={isBuyer ? 'buyer' : 'seller'} />)}
            </Box>
            </Box>

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
