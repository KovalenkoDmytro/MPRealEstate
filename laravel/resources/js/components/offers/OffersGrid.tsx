import { Offer } from "@/types";
import { Typography, Grid } from "@mui/material";
import BuyerOfferCard from "@/components/offers/OffersGrid/BuyerOfferCard";
import SellerOfferCard from "@/components/offers/OffersGrid/SellerOfferCard";
import {useAuth} from "@/hooks/useAuth";


interface OffersGridProps {
    offers: Offer[];
    filterStatus?: string; // e.g., 'pending'
}

export default function OffersGrid({offers, filterStatus}: OffersGridProps) {
    const user = useAuth();
    const role = user.role;

    const filteredOffers = filterStatus
        ? offers.filter((offer) => offer.status === filterStatus)
        : offers;

    if (!filteredOffers || filteredOffers.length === 0) {
        return (
            <Typography mt={2} color="text.secondary">
                No offers available.
            </Typography>
        );
    }

    // Render buyer layout (grid)
    if (role === "buyer") {
        return (
            <Grid container spacing={3} sx={{ width: "100%" }}>
                {filteredOffers.map((offer) => (
                    <BuyerOfferCard key={offer.id} offer={offer} />
                ))}
            </Grid>
        );
    }

    // Render seller layout (list)
    return (
        <Grid container spacing={3} sx={{ width: "100%" }}>
            {filteredOffers.map((offer) => (
                <SellerOfferCard key={offer.id} offer={offer} />
            ))}
        </Grid>
    );
}
