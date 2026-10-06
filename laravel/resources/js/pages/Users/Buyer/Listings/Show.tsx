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
    Stack, Typography, Box, Grid, Chip, Divider
} from "@mui/material";
import SetAppointmentForm from "@/components/listing/appointments/SetAppointmentForm";
import { UserOfferStatus } from "./UserOfferStatus";
import { MakeOfferPrompt } from "./MakeOfferPrompt";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import IconLocationMark from "@/icons/IconLocationMark";
import {ListingLocationMap} from "@/components/maps/ListingLocationMap";
import BackToButton from "@/components/common/BackToButton";
import SectionCard from "@/design/SectionCard";
import { formatCurrency } from "@/helpers/priceHelper";
import { primary, radius } from "@/design/tokens";
import { BedOutlined, BathtubOutlined, SquareFootOutlined } from "@mui/icons-material";

type PageProps = {
    listing: RealEstateListing;
    userOffer: Offer | null;
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
        <AuthenticatedLayout header="Listing details" title={listing.title}>
            <Box className="listing-show-page" sx={{ maxWidth: 1280, mx: 'auto', py: { xs: 2, md: 0 } }}>
                <BackToButton
                    label="Listings"
                    fallbackHref={route("listings.index")}
                    sx={{ mb: 3, color: 'common.white', '&:hover': { color: primary[200] } }}
                />

                <Stack spacing={3}>
                    <SectionCard tone="elevated" sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3}>
                            <Box sx={{ minWidth: 0 }}>
                                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
                                    <Chip label={listing.property_type} size="small" sx={{ bgcolor: primary[50], color: primary[700], textTransform: 'capitalize' }} />
                                    <Chip label={listing.status} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                                </Stack>
                                <Typography component="h1" variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.03em', overflowWrap: 'anywhere', mb: 1.5 }}>
                                    {listing.title}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="flex-start" color="text.secondary">
                                    <Box sx={{ display: 'inline-flex', flexShrink: 0, mt: 0.25 }}><IconLocationMark /></Box>
                                    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                                        {`${listing.street_number} ${listing.street_name}, ${listing.city}, ${listing.province} ${listing.postal_code}`}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box sx={{ flexShrink: 0, textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Asking price</Typography>
                                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '-0.03em' }}>{formatCurrency(listing.price)}</Typography>
                            </Box>
                        </Stack>
                        <Divider sx={{ my: 2.5 }} />
                        <Stack direction="row" spacing={{ xs: 2, sm: 4 }} useFlexGap flexWrap="wrap">
                            {[
                                { icon: <BedOutlined fontSize="small" />, value: `${listing.bedrooms} bedrooms` },
                                { icon: <BathtubOutlined fontSize="small" />, value: `${listing.bathrooms} bathrooms` },
                                { icon: <SquareFootOutlined fontSize="small" />, value: `${listing.square_feet.toLocaleString()} sq ft` },
                            ].map(({ icon, value }) => (
                                <Stack key={value} direction="row" spacing={1} alignItems="center">
                                    <Box sx={{ display: 'flex', color: 'primary.main' }}>{icon}</Box>
                                    <Typography variant="body2" fontWeight={600}>{value}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </SectionCard>

                    <ImageGallery mainImage={listing.main_image} images={listing.images || []} />

                    <Grid container spacing={{ xs: 2.5, md: 3 }}>


                        <Grid size={{ xs: 12, md: 8 }}>
                            <ListingDetails listing={listing} role="buyer" />
                        </Grid>


                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={2.5} sx={{ position: { md: 'sticky' }, top: 112 }}>

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
                    <SectionCard tone="elevated" sx={{ p: { xs: 2, md: 3 }, '& > .MuiCard-root': { boxShadow: 'none', borderRadius: radius.md } }}>
                        <Typography component="h2" variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Explore the location</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>Find your way to the property and explore the neighbourhood.</Typography>
                        <ListingLocationMap listing={listing} />
                    </SectionCard>


                </Stack>
            </Box>


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
