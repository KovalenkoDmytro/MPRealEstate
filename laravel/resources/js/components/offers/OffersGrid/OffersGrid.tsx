import { Offer } from "@/types";
import {Typography, Grid, Stack} from "@mui/material";
import {useAuth} from "@/hooks/useAuth";
import OfferCard from "@/components/offers/OffersGrid/OfferCard";


interface OffersGridProps {
    offers: Offer[];
}

export default function OffersGrid({offers}: OffersGridProps) {
    const user = useAuth();
    const role = user.role;


    if (offers.length === 0) {
        return (
            <Typography mt={2} color="text.secondary">
                No offers available.
            </Typography>
        );
    }

    // Render buyer layout (grid)
    if (role === "buyer") {
        return (
            <Stack spacing={3} mt={4}>
                {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} role={"buyer"} />
                ))}
            </Stack>
        );
    }

    // Render seller layout (list)
    return (
        <Grid container spacing={3} sx={{ width: "100%" }}>
            {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} role={"seller"} />
            ))}
        </Grid>
    );
}
