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
    Stack, Typography, Box, Paper, Container
} from "@mui/material";
import SetAppointmentForm from "@/components/listing/appointments/SetAppointmentForm";
import PropertyMapSelector from "@/components/maps/PropertyMapSelect";
import IconArrowLeft from "@/icons/IconArrowLeft";
import { UserOfferStatus } from "./UserOfferStatus";
import { MakeOfferPrompt } from "./MakeOfferPrompt";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";

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
                    {/* 1. Image Gallery */}
                    <ImageGallery mainImage={listing.main_image} images={listing.images || []}  price={listing.price}/>

                    {/* 2. Listing Details (Price, Specs, Property Details) */}
                    <ListingDetails listing={listing} role={"buyer"} />

                    {/* 3. Offer Status Section */}
                    {userOffer ? (
                        <UserOfferStatus offer={userOffer} />
                    ) : (
                        <MakeOfferPrompt onMakeOffer={() => setDialogOpen(true)} />
                    )}



                    {/* 4. Appointment Section */}
                    <SetAppointmentForm listing={listing} />





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
            <Dialog
                open={dialogOpen}
                onClose={() => !processing && setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ fontWeight: 'bold' , display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <LocalOfferRoundedIcon color="primary" />

                    Make an Offer</DialogTitle>

                {/* Added padding here since we removed it from the OfferForm */}
                <DialogContent dividers sx={{ p: 3 }}>
                    <OfferForm
                        onSubmit={handleSubmit}
                        // Pass the cancel handler here
                        onCancel={() => setDialogOpen(false)}
                        processing={processing}
                        // Ensure you pass errors if you have them, or an empty object
                        // errors={errors || {}}
                    />
                </DialogContent>

                {/* Removed DialogActions entirely - the form handles the buttons now */}
            </Dialog>
        </AuthenticatedLayout>
    );
}
