import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Offer, User } from "@/types";
import OffersGrid from "@/components/offers/OffersGrid";
import {Box, Typography, Card, CardContent, Divider,} from "@mui/material";

type PageProps = {
    auth: { user: User };
    offers: Offer[];
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

                        {offers.length && <OffersGrid offers={offers}/>}

                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
}
