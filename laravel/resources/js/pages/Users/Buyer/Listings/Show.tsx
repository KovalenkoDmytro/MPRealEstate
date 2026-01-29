import React from "react";
import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { ImageGallery } from "@/components/listing/ImageGallery";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { OfferForm } from "@/components/listing/OfferForm";
import { RealEstateListing, Offer } from "@/types";
import { offerService } from "@/services/offerService";
import { useNotification } from "@/context/NotificationContext";
import {
    Dialog, DialogTitle, DialogContent,
    Stack, Typography, Box, Container, Grid
} from "@mui/material";
import SetAppointmentForm from "@/components/listing/appointments/SetAppointmentForm";
import IconArrowLeft from "@/icons/IconArrowLeft";
import { UserOfferStatus } from "./UserOfferStatus";
import { MakeOfferPrompt } from "./MakeOfferPrompt";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import IconLocationMark from "@/icons/IconLocationMark";
import {ListingLocationMap} from "@/components/maps/ListingLocationMap";

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
        <AuthenticatedLayout header="Dashboard">
            <Head title={listing.title} />

            <Container className='listing-show-page'>
                <Link href={route(`listings.index`)} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', textDecoration: 'none', gap: '8px'   }}>
                    <IconArrowLeft/>
                    <Typography> Back to Listings</Typography>
                </Link>

                <Stack spacing={4}>

                    <ImageGallery mainImage={listing.main_image} images={listing.images || []}  price={listing.price}/>

                    <Box mb={4}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {listing.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                            <IconLocationMark/>
                            <Typography variant="body1">
                                {`${listing.street_number} ${listing.street_name}, ${listing.city}, ${listing.province} ${listing.postal_code}`}
                            </Typography>
                        </Stack>
                    </Box>

                    <Grid container spacing={3}>


                        <Grid size={{ xs: 12, md: 8 }}>
                            <ListingDetails listing={listing} role="buyer" />
                        </Grid>


                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={3}>

                                {/* 1. Offer Section */}
                                {userOffer ? (
                                    <UserOfferStatus offer={userOffer} />
                                ) : (
                                    <MakeOfferPrompt onMakeOffer={() => setDialogOpen(true)} />
                                )}

                                {/* 2. Appointment Section */}
                                <SetAppointmentForm listing={listing} />

                            </Stack>
                        </Grid>
                    </Grid>
                    <ListingLocationMap lng={listing.longitude} lat={listing.latitude}/>


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
