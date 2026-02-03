import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { RealEstateListing, Offer } from "@/types";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { offerService } from "@/services/offerService";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Stack,
    Tooltip,
} from "@mui/material";
import {ImageGallery} from "@/components/listing/ImageGallery";
import {ListingDetails} from "@/components/listing/ListingDetails";
import {ReceivedOffers} from "@/components/listing/ReceivedOffers";
import {useNotification} from "@/context/NotificationContext";
import {FavoriteBorder, PersonOutline, Visibility } from "@mui/icons-material";

interface PageProps {
    listing: RealEstateListing & {
        offers: Offer[];
        favorite_by_buyer_count: number;
    };
}

export default function ListingShowPage({ listing }: PageProps) {
    const [offers, setOffers] = useState<Offer[]>(listing.offers || []);
    const { showNotification } = useNotification();
    // const handleUpdateStatus = async (offerId: number, status: "accepted" | "rejected") => {
    //
    //         const response = await offerService.updateOfferStatus(offerId, status);
    //
    //         if (response.status === "success") {
    //             showNotification(response.message, response.status );
    //             const updatedStatus = response.data.status;
    //
    //             setOffers(prev =>
    //                 prev.map(offer =>
    //                     offer.id === offerId
    //                         ? ({ ...offer, status: updatedStatus } as Offer)
    //                         : offer
    //                 )
    //             );
    //         }else {
    //             showNotification(response.message, "error");}
    //
    //
    //
    //
    // };

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

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 1, mb: 3, color: 'text.secondary' }}
                    divider={<Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: 'center' }} />}
                >
                    {/* Total Views */}
                    <Tooltip title="Total times this listing was viewed">
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Visibility fontSize="small" sx={{ color: '#6B7280' }} />
                            <Typography variant="body2">
                                <strong>{listing.views_count ?? 0}</strong> Views
                            </Typography>
                        </Box>
                    </Tooltip>

                    {/* Unique Viewers */}
                    <Tooltip title="Distinct users who viewed this listing">
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <PersonOutline fontSize="small" sx={{ color: '#6B7280' }} />
                            <Typography variant="body2">
                                <strong>{listing.unique_viewers_count ?? 0}</strong> Unique
                            </Typography>
                        </Box>
                    </Tooltip>

                    {/* Favorites Count */}
                    <Tooltip title="Number of buyers who saved this listing">
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <FavoriteBorder fontSize="small" sx={{ color: '#EC4899' }} /> {/* Pink/Red Icon */}
                            <Typography variant="body2" sx={{ color: '#BE185D', fontWeight: 500 }}>
                                <strong>{listing.favorite_by_buyer_count ?? 0}</strong> Saves
                            </Typography>
                        </Box>
                    </Tooltip>
                </Stack>

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

                        {/*<ReceivedOffers offers={offers} onUpdateStatus={handleUpdateStatus} />*/}
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
}
