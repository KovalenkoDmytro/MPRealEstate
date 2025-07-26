import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Offer, User } from "@/types";

// MUI
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2

type PageProps = {
    auth: { user: User };
    offers?: Offer[];
};

export default function Dashboard({ auth, offers }: PageProps) {
    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    Dashboard
                </Typography>
            }
        >
            <Head title="Dashboard" />

            {/* Logged-in message */}
            <Box py={6} maxWidth="lg" mx="auto">
                <Card>
                    <CardContent>
                        <Typography>
                            You're logged in as <strong>{auth.user.role.toUpperCase()}!</strong>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Offers Section */}
            <Box py={4} maxWidth="lg" mx="auto">
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            📜 My Offers
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {offers && offers.length > 0 ? (
                            <Grid container spacing={3} sx={{ width: "100%" }}>
                                {offers.map((offer) => (
                                    <Grid key={offer.id} size={{ xs: 12, md: 6, lg: 4 }}>
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

                                                {/* Offer Status */}
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
                                ))}
                            </Grid>
                        ) : (
                            <Typography mt={2} color="text.secondary">
                                No offers made yet.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
}
