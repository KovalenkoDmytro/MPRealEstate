import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Stack,
    Divider,
    alpha,
    Grid
} from "@mui/material";
import { Link } from "@inertiajs/react";
import { PropertyStatus, RealEstateListing } from "@/types";



// Helper function for secondary property detail rows
const DetailRow = ({ icon, label, value }: { icon: string, label: string, value: string | number }) => (
    <Typography variant="body2" color="text.secondary">
        {icon} {label}: {value}
    </Typography>
);

export default function SellerListingCard ({ listing } : { listing: RealEstateListing }) {

    // Custom style for the Status Badge overlay
    const getStatusColor = (status: PropertyStatus) => {
        switch (status) {
            case PropertyStatus.Available: return 'success.main';
            case PropertyStatus.Pending: return 'warning.main';
            case PropertyStatus.Sold: return 'error.main'; // Used for the badge if no central overlay is shown
            default: return 'info.main';
        }
    };


    const isSold = listing.status === PropertyStatus.Sold;

    return (
        <Card elevation={6} sx={{ borderRadius: 2}}>

            {/* -------------------- IMAGE SECTION -------------------- */}
            <Box sx={{ position: 'relative' }}>
                {listing.main_image ? (
                    <CardMedia
                        component="img"
                        height="340"
                        image={listing.main_image.image_path}
                        alt={listing.title}
                        sx={{ objectFit: 'cover', height: 340 }}
                    />
                ) : (
                    <Box sx={{ height: 340, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "grey.200" }}>
                        <Typography variant="h6" color="text.disabled">❌ No Image</Typography>
                    </Box>
                )}

                {/* --- NEW: SOLD Overlay --- */}
                {isSold && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: alpha('#FFFFFF', 0.85),
                            zIndex: 10,
                        }}
                    >
                        <Typography
                            variant="h2"
                            color="error.main"
                            fontWeight="bold"
                            sx={{
                                textTransform: 'uppercase',
                                transform: 'rotate(-10deg)',
                                border: `4px solid ${alpha('#FF0000', 0.8)}`,
                                p: 2,
                                borderRadius: 1,
                            }}
                        >
                            Sold
                        </Typography>
                    </Box>
                )}


                {/* Status Badge Overlay */}
                {!isSold && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: getStatusColor(listing.status),
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            boxShadow: 3,
                            zIndex: 11,
                        }}
                    >
                        {listing.status}
                    </Box>
                )}

            </Box>

            {/* -------------------- CONTENT SECTION -------------------- */}
            <CardContent>

                {/* Price (Most Prominent Feature in Content) */}
                <Typography variant="h5" color="primary" fontWeight={800} sx={{ mb: 1 }}>
                    ${listing.price.toLocaleString()}
                </Typography>

                {/* Title & Location */}
                <Typography variant="h6" component="h2" fontWeight="bold" noWrap>
                    {listing.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                    📍 {listing.location}
                </Typography>

                {/* Details Section (Using the 60/40 Split and 2 Columns) */}
                <Stack direction="row" spacing={3} sx={{ mt: 2, mb: 3 }}>

                    {/* 1. Property Details (FIXED: Removed redundant nesting) */}
                    <Box sx={{ width: '40%' }}>
                        <Typography variant="subtitle2" gutterBottom>Details</Typography>

                        {/* Using Grid container and MUI v7 'size' prop for the two-column layout */}
                        <Grid container spacing={1}>

                            {/* Essential Details (redundant with overlay, but included per request) */}
                            <Grid size={6}>
                                <DetailRow icon="🛏️" label="Bedrooms" value={listing.bedrooms} />
                            </Grid>
                            <Grid size={6}>
                                <DetailRow icon="🛁" label="Bathrooms" value={listing.bathrooms} />
                            </Grid>
                            <Grid size={6}>
                                <DetailRow icon="📐" label="Size" value={`${listing.square_feet.toLocaleString()} sqft`} />
                            </Grid>

                            {/* Secondary Details (Existing conditional logic) */}
                            {listing.lot_size && (
                                <Grid size={6}>
                                    <DetailRow icon="🏡" label="Lot Size" value={`${listing.lot_size.toLocaleString()} sqft`} />
                                </Grid>
                            )}

                            {listing.year_built && (
                                <Grid size={6}>
                                    <DetailRow icon="🏗️" label="Year Built" value={listing.year_built} />
                                </Grid>
                            )}

                            {/* HOA Fees */}
                            {listing.hoa_fees && (
                                <Grid size={6}>
                                    <DetailRow icon="💸" label="HOA Fees" value={`$${listing.hoa_fees.toLocaleString()}`} />
                                </Grid>
                            )}

                            {/* Property Taxes */}
                            {listing.property_taxes && (
                                <Grid size={6}>
                                    <DetailRow icon="📊" label="Property Taxes" value={`$${listing.property_taxes.toLocaleString()}`} />
                                </Grid>
                            )}

                        </Grid>
                    </Box>

                    {/* 2. Description  */}
                    {listing.description && (
                        <Box sx={{ width: '60%' }}>
                            <Typography variant="subtitle2" gutterBottom>Description</Typography>
                            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.primary', display: 'block', maxHeight: 80, overflow: 'hidden' }}>
                                {listing.description}
                            </Typography>
                        </Box>
                    )}
                </Stack>


                <Divider sx={{ mb: 3 }} />

                {/* Actions  */}
                {listing.status === PropertyStatus.Pending ? (
                    <Typography variant="button" sx={{ display: 'block', textAlign: 'right', color: 'warning.main' }}>
                        Processing: {listing.status}
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Stack direction="row" spacing={2}>
                            <Link href={route("seller.listings.edit", listing.id)} style={{ textDecoration: "none" }}>
                                <Button variant="contained" size="medium" color="primary">
                                    Edit Listing
                                </Button>
                            </Link>

                            <Link href={route("seller.listings.deactivate", listing.id)} style={{ textDecoration: "none" }}>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    color="error"
                                >
                                    Deactivate
                                </Button>
                            </Link>
                        </Stack>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};
