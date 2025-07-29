import { Offer } from "@/types";
import { Typography, Grid } from "@mui/material";
import BuyerOfferCard from "@/components/offers/OffersGrid/BuyerOfferCard";
import SellerOfferCard from "@/components/offers/OffersGrid/SellerOfferCard";


interface OffersGridProps {
    offers: Offer[];
    filterStatus?: string; // e.g., 'pending'
    variant?: "buyer" | "seller"; // default = buyer
}

export default function OffersGrid({offers, filterStatus, variant = "buyer",}: OffersGridProps) {
    // Apply filtering
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
    if (variant === "buyer") {
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
        <div>
            {filteredOffers.map((offer) => (
                <SellerOfferCard key={offer.id} offer={offer} />
            ))}
        </div>
    );
}
