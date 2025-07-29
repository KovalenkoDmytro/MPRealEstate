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
    CardMedia,
    Grid,
    Button,
    Chip,
    Divider,
    Stack,
    Alert,
} from "@mui/material";
import {ImageGallery} from "@/components/listing/ImageGallery";

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
                <Typography variant="body1">📍 Location: {listing.location}</Typography>
                <Typography variant="body1">
                    💰 Price: <strong>${listing.price.toLocaleString()}</strong>
                </Typography>
                <Typography variant="body1">
                    🛏 {listing.bedrooms} Bedrooms | 🛁 {listing.bathrooms} Bathrooms
                </Typography>
                <Typography variant="body1">📏 {listing.square_feet} sqft</Typography>

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

                        {offers.length > 0 ? (
                            offers.map((offer) => (
                                <Card key={offer.id} sx={{ mb: 2, p: 2 }} variant="outlined">
                                    <Typography><strong>👤 Buyer:</strong> {offer.buyer?.name || "Unknown Buyer"}</Typography>
                                    <Typography><strong>📧 Email:</strong> {offer.buyer?.email || "No Email"}</Typography>
                                    <Typography><strong>💰 Offer Price:</strong> ${offer.amount.toLocaleString()}</Typography>
                                    <Typography><strong>📝 Message:</strong> {offer.message}</Typography>
                                    <Typography>
                                        <strong>📌 Status:</strong>{" "}
                                        <Chip
                                            label={offer.status}
                                            color={
                                                offer.status === "accepted"
                                                    ? "success"
                                                    : offer.status === "rejected"
                                                        ? "error"
                                                        : "warning"
                                            }
                                            size="small"
                                        />
                                    </Typography>

                                    {offer.status === "pending" && (
                                        <Stack direction="row" spacing={1} mt={2}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleUpdateStatus(offer.id, "accepted")}
                                            >
                                                ✅ Accept
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleUpdateStatus(offer.id, "rejected")}
                                            >
                                                ❌ Reject
                                            </Button>
                                        </Stack>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <Alert severity="info">No offers yet.</Alert>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
}
