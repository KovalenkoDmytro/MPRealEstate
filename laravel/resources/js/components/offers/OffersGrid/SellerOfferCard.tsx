import { Offer } from "@/types";
import { Link } from "@inertiajs/react";
import { Card, CardContent, Typography } from "@mui/material";

export default function SellerOfferCard({ offer }: { offer: Offer }) {
    return (
        <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, padding: 2 }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                    Listing:{" "}
                    <Link
                        href={route("seller.listings.show", offer.listing.id)}
                        style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                        {offer.listing.title}
                    </Link>
                </Typography>
                <Typography>
                    Buyer: {offer.buyer.name} ({offer.buyer.email})
                </Typography>
                <Typography>Offer Price: ${offer.amount}</Typography>
                <Typography>Message: {offer.message}</Typography>
                <Typography
                    sx={{
                        mt: 1,
                        color:
                            offer.status === "pending"
                                ? "orange"
                                : offer.status === "accepted"
                                    ? "green"
                                    : "red",
                    }}
                >
                    Status: {offer.status}
                </Typography>
            </CardContent>
        </Card>
    );
}
