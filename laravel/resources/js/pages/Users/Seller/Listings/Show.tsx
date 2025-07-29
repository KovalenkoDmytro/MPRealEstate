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

interface PageProps {
    listing: RealEstateListing & {
        offers: Offer[];
    };
}

export default function Show({ listing }: PageProps) {
    const [offers, setOffers] = useState<Offer[]>(listing.offers || []);

    const handleUpdateStatus = async (offerId: number, status: "accepted" | "rejected") => {
        try {
            const response = await offerService.updateOfferStatus(offerId, status);

            if (response.ok && response.data.offerStatus) {
                const updatedStatus = response.data.offerStatus;

                setOffers((prev) =>
                    prev.map((offer) =>
                        offer.id === offerId ? { ...offer, status: updatedStatus } : offer
                    )
                );

                alert(`Offer ${updatedStatus} successfully!`);
            } else {
                alert("Failed to update offer status.");
            }
        } catch (error) {
            console.error("Error updating offer status:", error);
            alert("Network error. Please try again.");
        }
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
                <ListingDetails listing={listing} />


                <Divider sx={{ my: 3 }} />

                {/* Navigation Links */}
                <Stack direction="row" spacing={2} mb={2}>
                    <Link href={route("seller.listings.index")}>
                        <Button variant="outlined">🔙 Back to Listings</Button>
                    </Link>
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
