import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { RealEstateListing, Offer } from "@/types";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { offerService } from "@/services/offerService";

// MUI Components
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Stack,
} from "@mui/material";
import {ImageGallery} from "@/components/listing/ImageGallery";
import {ListingDetails} from "@/components/listing/ListingDetails";
import {ReceivedOffers} from "@/components/listing/ReceivedOffers";
import {useNotification} from "@/context/NotificationContext";

interface PageProps {
    listing: RealEstateListing & {
        offers: Offer[];
    };
}

export default function Show({ listing }: PageProps) {
    const [offers, setOffers] = useState<Offer[]>(listing.offers || []);
    const { showNotification } = useNotification();
    const handleUpdateStatus = async (offerId: number, status: "accepted" | "rejected") => {

            const response = await offerService.updateOfferStatus(offerId, status);

            if (response.status === "success") {
                showNotification(response.message, response.status );
                const updatedStatus = response.data.status;

                setOffers(prev =>
                    prev.map(offer =>
                        offer.id === offerId
                            ? ({ ...offer, status: updatedStatus } as Offer)
                            : offer
                    )
                );
            }else {
                showNotification(response.message, "error");}




    };

    return (
        <AuthenticatedLayout
            header={<Typography variant="h5" fontWeight="bold">Listing</Typography>}
        >
            <Head title="Listings" />

            <Box p={3}>
                {/* Title */}
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {listing.title}
                </Typography>

                <ImageGallery mainImage={listing.main_image} images={listing.images} />


                {/* Property Details */}
                <ListingDetails listing={listing} role={'seller'}/>


                <Divider sx={{ my: 3 }} />

                {/* Navigation Links */}
                <Stack direction="row" spacing={2} mb={2}>
                    {listing.offers?.length === 0 && (
                        <Link href={route("seller.listings.edit", listing.id)}>
                            <Button variant="outlined">✏️ Edit Listing</Button>
                        </Link>
                    )}
                </Stack>

                {/* Offers Section */}
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            📑 Offers Received
                        </Typography>

                        <ReceivedOffers offers={offers} onUpdateStatus={handleUpdateStatus} />
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
}
