import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { ImageGallery } from "@/components/listing/ImageGallery";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { OfferFeedback } from "@/components/listing/OfferFeedback";
import { OfferForm } from "@/components/listing/OfferForm";
import { Offer, RealEstateListing } from "@/types";
import { offerService } from "@/services/offerService";
import {useNotification} from "@/context/NotificationContext";
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography} from "@mui/material";
import SetAppointmentForm from "@/components/listing/appointments/SetAppointmentForm";


type PageProps = {
    listing: RealEstateListing;
    userOffer: Offer;
};

export default function ShowListing({listing, userOffer}: PageProps) {
    console.log("Listing Data:", listing);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const { showNotification, setRedirectNotification } = useNotification();
    const handleSubmit = async (data: { amount: string; message: string }) => {
        try {
            setProcessing(true);
            setErrors({});

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

    const OfferSummary = () => (
        <>
            <h2 className="text-xl font-bold text-green-700">✅ Your Offer</h2>
            <p className="mt-2 text-lg">
                💵 <strong>${parseFloat(String(userOffer.amount)).toLocaleString()}</strong>
            </p>
            <p className="mt-1 text-gray-700 whitespace-pre-line">📝 {userOffer.message}</p>
        </>
    );

    return (
        <AuthenticatedLayout
            header="My Listings"
        >
            <div className="container mx-auto p-6">
                <ImageGallery mainImage={listing.main_image} images={listing.images || []} />
                <ListingDetails listing={listing} role={"buyer"} />

                {listing.status === "pending" && <OfferFeedback userOffer={userOffer} />}

                {listing.status !== "pending" && (
                    <div className="mt-6 p-4 border border-gray-300 rounded-md">
                        {userOffer ? (
                            <OfferSummary />
                        ) : (
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">No offer yet</Typography>
                                <Button variant="contained" onClick={() => setDialogOpen(true)}>
                                    Make an Offer
                                </Button>
                            </Stack>
                        )}
                    </div>
                )}
            </div>

            <SetAppointmentForm listing={listing}/>

            {/* Offer Form in MUI Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => (!processing ? setDialogOpen(false) : null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Make an Offer</DialogTitle>
                <DialogContent dividers>
                    <OfferForm onSubmit={handleSubmit} processing={processing} errors={errors} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} disabled={processing}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}
