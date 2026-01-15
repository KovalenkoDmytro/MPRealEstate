import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { ImageGallery } from "@/components/listing/ImageGallery";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { OfferForm } from "@/components/listing/OfferForm";
import { RealEstateListing, Offer } from "@/types";
import { offerService } from "@/services/offerService";
import { useNotification } from "@/context/NotificationContext";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Stack, Typography, Box, Paper, Container
} from "@mui/material";
import SetAppointmentForm from "@/components/listing/appointments/SetAppointmentForm";
import PropertyMapSelector from "@/components/maps/PropertyMapSelect"; // Assuming this handles the location view

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
                <Stack spacing={4}>
                    {/* 1. Image Gallery */}
                    <ImageGallery mainImage={listing.main_image} images={listing.images || []}  price={listing.price}/>

                    {/* 2. Listing Details (Price, Specs, Property Details) */}
                    <ListingDetails listing={listing} role={"buyer"} />

                    {/* 3. Offer Status Section */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            borderStyle: userOffer ? 'solid' : 'dashed',
                            borderColor: userOffer ? '#c3e6cb' : '#e0e0e0',
                            backgroundColor: userOffer ? '#f0fff4' : 'inherit'
                        }}
                    >
                        {userOffer ? (
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                                        Check Your Offer
                                    </Typography>
                                </Stack>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1, color: '#2e7d32' }}>
                                    ${parseFloat(String(userOffer.amount)).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Competitive offer submitted. Awaiting seller response.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>No Offer Yet</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Make an offer to show your interest in this property
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    onClick={() => setDialogOpen(true)}
                                    sx={{ bgcolor: '#4a2c4a', '&:hover': { bgcolor: '#3a223a' }, textTransform: 'none', px: 4 }}
                                >
                                    Make an Offer
                                </Button>
                            </Stack>
                        )}
                    </Paper>

                    {/* 4. Appointment Section */}
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Schedule a Viewing</Typography>
                        <SetAppointmentForm listing={listing} />
                    </Paper>

                    {/* 5. Location Section */}
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Location</Typography>
                        <Box sx={{ height: 400, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                            <PropertyMapSelector />
                        </Box>
                    </Paper>
                </Stack>
            </Container>

            {/* Offer Dialog */}
            <Dialog open={dialogOpen} onClose={() => !processing && setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Make an Offer</DialogTitle>
                <DialogContent dividers>
                    <OfferForm onSubmit={handleSubmit} processing={processing} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}
