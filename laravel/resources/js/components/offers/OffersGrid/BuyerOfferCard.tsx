import { Offer } from "@/types";
import { Link } from "@inertiajs/react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function BuyerOfferCard({ offer }: { offer: Offer }) {
    return (
        <Grid size={{xs: 12, md: 6, lg: 4}}>
            <Card
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    "&:hover": { boxShadow: 3 },
                    transition: "0.2s",
                }}
            >
                <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                        <Link
                            href={`buyer/listings/${offer.listing.id}`}
                            style={{ color: "#1976d2", textDecoration: "none" }}
                        >
                            {offer.listing.title}
                        </Link>
                    </Typography>

                    <Typography>
                        💰 Listing Price: ${offer.listing.price.toLocaleString()}
                    </Typography>
                    <Typography>📌 Seller: {offer.listing.seller.name}</Typography>
                    <Typography>
                        <strong>My Offer:</strong> ${offer.amount.toLocaleString()}
                    </Typography>
                    <Typography color="text.secondary">
                        <strong>Message:</strong> {offer.message}
                    </Typography>

                    <Typography
                        mt={2}
                        fontWeight="bold"
                        sx={{
                            color:
                                offer.status === "accepted"
                                    ? "green"
                                    : offer.status === "rejected"
                                        ? "red"
                                        : "orange",
                        }}
                    >
                        Status: {offer.status.toUpperCase()}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}
