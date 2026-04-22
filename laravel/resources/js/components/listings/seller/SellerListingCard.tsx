import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
    Grid
} from '@mui/material';
import { RealEstateListing } from '@/types';
import Button from '@/components/common/Button';
import { formatCurrency, formatNumber } from "@/helpers/priceHelper";
import theme from "@/theme";
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconDollar from "@/icons/IconDollar";
import IconLotSpace from "@/icons/IconLotSpace";
import IconEdit from "@/icons/IconEdit";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useNotification } from "@/context/NotificationContext";
import IconContainer from "@/components/common/IconContainer";
import { listingService } from "@/services/listingService";
import { router } from "@inertiajs/react";

type Props = {
    listing: RealEstateListing;
};

export default function SellerListingCard({ listing }: Props) {
    const mainImage = listing.main_image?.image_path || '/images/placeholder-house.jpg';
    const { showNotification } = useNotification();
    // Dialog state
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | null }) => {
        if (!value) return null;
        return (
            <Stack direction="row" alignItems="center" gap={1} mb={1}>
                <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    <Box component="span" fontWeight={600} color="text.primary" mr={0.5}>
                        {label}:
                    </Box>
                    {value}
                </Typography>
            </Stack>
        );
    };

    const handleDeactivateClick = () => {
        setDeactivateDialogOpen(true);
    };

    const handleConfirmDeactivate = async () => {
        try {
            const result = await listingService.deactivateListing(listing.id);

            if (!result?.success) {
                showNotification(result?.message || "Failed to deactivate listing", "error");
                return;
            }

            showNotification(result.message || "Listing deactivated successfully", "success");
            router.reload({ only: ["listings"] });
        } catch {
            showNotification("Failed to deactivate listing", "error");
        }
    };

    return (
        <>
            <Card
                elevation={0}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: theme.shape.borderRadius,
                    border: '1px solid',
                    borderColor: theme.palette.border.main,
                    overflow: 'hidden',
                }}
            >
                {/* Image Section - Removed Badge Overlay */}
                <Box sx={{ position: 'relative', height: 420, bgcolor: 'grey.100' }}>
                    <Box
                        component="img"
                        src={mainImage}
                        alt={listing.title}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>

                    {/* Header: Price & Title */}
                    <Box mb={3}>
                        <Typography variant="h5" fontWeight={800} color="text.primary" gutterBottom>
                            {formatCurrency(listing.price)}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            {listing.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" gap={0.5} color="text.secondary" mt={0.5}>
                            <IconLocationMark/>

                            <Typography variant="body2" noWrap>
                                {listing.street_number} {listing.street_name}, {listing.city}, {listing.province}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Content Columns */}
                    <Grid container spacing={4}>

                        {/* Column 1: Details */}
                        <Grid size={{ xs: 12, md: 5 }} >
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: 'text.primary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                Details
                            </Typography>

                            <DetailItem
                                icon={<IconBed />}
                                label="Bedrooms"
                                value={listing.bedrooms}
                            />
                            <DetailItem
                                icon={<IconBath />}
                                label="Bathrooms"
                                value={listing.bathrooms}
                            />
                            <DetailItem
                                icon={<IconSqft />}
                                label="Size"
                                value={`${formatNumber(listing.square_feet)} sqft`}
                            />
                            <DetailItem
                                icon={<IconCalendarToday />}
                                label="Year Built"
                                value={listing.year_built}
                            />
                            <DetailItem
                                icon={<IconDollar />}
                                label="Prop Taxes"
                                value={formatCurrency(listing.property_taxes)}
                            />
                            {listing.lot_size && (
                                <DetailItem
                                    icon={<IconLotSpace />}
                                    label="Lot Size"
                                    value={`${formatNumber(listing.lot_size)} ft²`}
                                />
                            )}
                        </Grid>

                        {/* Column 2: Description */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: 'text.primary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                Description
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 5, // Limit lines to keep card uniform
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.6
                                }}
                            >
                                {listing.description}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Footer Actions: Using Custom Button Component */}
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button
                            version="outline"
                            text="Deactivate"
                            onClick={handleDeactivateClick}
                        />
                        <Button
                            version="primary"
                            text="Edit Listing"
                            icon={<IconEdit />}
                            link={true}
                            href={route('seller.listings.edit', listing.id)}
                        />
                    </Stack>
                </CardContent>
            </Card>

            <ConfirmDialog
                open={deactivateDialogOpen}
                title="Deactivate Listing?"
                description="Are you sure you want to deactivate this listing? It will no longer be visible to buyers."
                confirmLabel="Deactivate"
                confirmColor="error"
                onClose={() => setDeactivateDialogOpen(false)}
                onConfirm={handleConfirmDeactivate}
            />
        </>
    );
}
