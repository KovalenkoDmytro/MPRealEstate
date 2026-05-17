import React from "react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { ImageGallery } from "@/components/listing/ImageGallery";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { OfferForm } from "@/components/listing/OfferForm";
import { RealEstateListing, Offer, OfferStatus } from "@/types";
import { offerService } from "@/services/offerService";
import { useNotification } from "@/context/NotificationContext";
import {
    Dialog, DialogTitle, DialogContent,
    Stack, Typography, Box, Container, Grid
} from "@mui/material";
import SetAppointmentForm from "@/components/listing/appointments/SetAppointmentForm";
import { UserOfferStatus } from "./UserOfferStatus";
import { MakeOfferPrompt } from "./MakeOfferPrompt";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import IconLocationMark from "@/icons/IconLocationMark";
import {ListingLocationMap} from "@/components/maps/ListingLocationMap";
import BackToButton from "@/components/common/BackToButton";

type PageProps = {
    listing: RealEstateListing;
    userOffer: Offer;
};

export default function ShowListing({ listing, userOffer }: PageProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);
    const { showNotification, setRedirectNotification } = useNotification();

    const handleSubmit = async (data: { amount: string; message: string }) => {
        try {
            setProcessing(true);
            const response = await offerService.makeOffer(listing.id, data);
            if (response.status === "success") {
                setRedirectNotification(response.message, response.status);
                setDialogOpen(false);
                window.location.reload();
            } else {
                showNotification(response.message, "error");
            }
        } catch (error: any) {
            showNotification(error.message, "error");
        } finally {
            setProcessing(false);
        }
    };


    return (
        <AuthenticatedLayout header="Dashboard" title={listing.title}>
            <Container className='listing-show-page' sx={{ px: { xs: 0, sm: 3 }, py: { xs: 2, sm: 3 } }}>
                <BackToButton
                    label="Listings"
                    fallbackHref={route("listings.index")}
                    sx={{ mb: { xs: 2, sm: 3 } }}
                />

                <Stack spacing={{ xs: 3, md: 4 }}>

                    <ImageGallery mainImage={listing.main_image} images={listing.images || []}  price={listing.price}/>

                    <Box mb={{ xs: 3, md: 4 }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            gutterBottom
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                                lineHeight: 1.15,
                                overflowWrap: 'anywhere',
                            }}
                        >
                            {listing.title}
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                            color="text.secondary"
                            sx={{ maxWidth: '100%' }}
                        >
                            <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0, mt: 0.25 }}>
                                <IconLocationMark/>
                            </Box>
                            <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                                {`${listing.street_number} ${listing.street_name}, ${listing.city}, ${listing.province} ${listing.postal_code}`}
                            </Typography>
                        </Stack>
                    </Box>

                    <Grid container spacing={{ xs: 2.5, md: 3 }}>


                        <Grid size={{ xs: 12, md: 8 }}>
                            <ListingDetails listing={listing} role="buyer" />
                        </Grid>


                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={3}>

                                {/* 1. Offer Section */}
                                {userOffer && (
                                    <UserOfferStatus offer={userOffer} />
                                )}
                                {(!userOffer || userOffer.status === OfferStatus.Rejected) && (
                                    <MakeOfferPrompt
                                        onMakeOffer={() => setDialogOpen(true)}
                                        reOffer={userOffer?.status === OfferStatus.Rejected}
                                    />
                                )}

                                {/* 2. Appointment Section */}
                                <SetAppointmentForm listing={listing} />

                            </Stack>
                        </Grid>
                    </Grid>
                    <ListingLocationMap listing={listing} />


                </Stack>
            </Container>


            <Dialog
                open={dialogOpen}
                onClose={() => !processing && setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ fontWeight: 'bold' , display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <LocalOfferRoundedIcon color="primary" />
                    Make an Offer
                </DialogTitle>


                <DialogContent dividers sx={{ p: 3 }}>
                    <OfferForm
                        onSubmit={handleSubmit}
                        onCancel={() => setDialogOpen(false)}
                        processing={processing}
                    />
                </DialogContent>

                {/* Removed DialogActions entirely - the form handles the buttons now */}
            </Dialog>
        </AuthenticatedLayout>
    );
}
