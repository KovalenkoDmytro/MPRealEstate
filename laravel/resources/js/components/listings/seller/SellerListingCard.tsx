import { useState } from 'react';
import { Box, Card, Typography, Stack, ButtonBase } from '@mui/material';
import { RealEstateListing } from '@/types';
import Button from '@/components/common/Button';
import { formatCurrency, formatNumber } from "@/helpers/priceHelper";
import { neutral, primary, radius } from '@/design/tokens';
import Badge from '@/components/common/Badge';
import { PropertyStatus } from '@/types/realEstateListing';
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
import { listingService } from "@/services/listingService";
import { router, Link } from "@inertiajs/react";

type Props = {
    listing: RealEstateListing;
};

export default function SellerListingCard({ listing }: Props) {
    const mainImage = listing.main_image?.image_path || '/images/placeholder-house.jpg';
    const { showNotification } = useNotification();
    // Dialog state
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const statusVersion = listing.status === PropertyStatus.Available ? 'success' : listing.status === PropertyStatus.Pending ? 'warning' : 'neutral';
    const details = [
        { label: 'Year built', value: listing.year_built, icon: <IconCalendarToday /> },
        { label: 'Tax / year', value: formatCurrency(listing.property_taxes), icon: <IconDollar /> },
        ...(listing.lot_size ? [{ label: 'Lot size', value: `${formatNumber(listing.lot_size)} ft²`, icon: <IconLotSpace /> }] : []),
    ];

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
            <Card component="article" elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: radius.lg, bgcolor: neutral[50], border: `1px solid ${neutral[200]}`, overflow: 'hidden', minWidth: 0 }}>
                <ButtonBase LinkComponent={Link} href={route('listings.show', listing.id)} aria-label={`View ${listing.title}`} sx={{ position: 'relative', height: 210, width: '100%', flexShrink: 0, '&:focus-visible': { outline: `3px solid ${primary[400]}`, outlineOffset: -3 } }}>
                    <Box component="img" src={mainImage} alt={listing.title} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', top: 14, left: 14 }}><Badge version={statusVersion} text={listing.status} size="small" /></Box>
                </ButtonBase>
                <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Typography sx={{ color: primary[900], fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', mb: 1 }}>{formatCurrency(listing.price)}</Typography>
                    <Link href={route('listings.show', listing.id)} style={{ textDecoration: 'none' }}><Typography component="h2" sx={{ fontSize: '1.05rem', fontWeight: 700, color: neutral[800], lineHeight: 1.4, overflowWrap: 'anywhere', '&:hover': { color: primary[600] } }}>{listing.title}</Typography></Link>
                    <Stack direction="row" spacing={0.75} sx={{ mt: 1, color: neutral[600], '& svg': { width: 17, height: 17, flexShrink: 0, mt: '2px' } }}>
                        <IconLocationMark /><Typography variant="caption">{listing.street_number} {listing.street_name}, {listing.city}, {listing.province}</Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2, '& > span': { display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: neutral[100], borderRadius: radius.sm, px: 1, py: 0.75, color: neutral[600] }, '& svg': { width: 17, height: 17 } }}>
                        <Typography component="span" variant="caption"><IconBed />{listing.bedrooms} beds</Typography>
                        <Typography component="span" variant="caption"><IconBath />{listing.bathrooms} baths</Typography>
                        <Typography component="span" variant="caption"><IconSqft />{formatNumber(listing.square_feet)} sqft</Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5, py: 1.5, borderTop: `1px solid ${neutral[200]}`, borderBottom: `1px solid ${neutral[200]}` }}>
                        {details.map((detail) => <Box key={detail.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, '& svg': { color: neutral[500], width: 18, height: 18, flexShrink: 0 } }}>{detail.icon}<Box><Typography variant="caption" color="text.secondary">{detail.label}</Typography><Typography variant="body2" fontWeight={600}>{detail.value}</Typography></Box></Box>)}
                    </Box>
                    <Typography variant="body2" sx={{ my: 2, color: neutral[600], lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{listing.description}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 1 }}>
                        <Button version="outline" text="Deactivate" onClick={handleDeactivateClick} />
                        <Button version="primary" text="Edit listing" icon={<IconEdit />} link href={route('listings.edit', listing.id)} />
                    </Stack>
                </Box>
            </Card>

            <ConfirmDialog
                open={deactivateDialogOpen}
                title="Deactivate Listing?"
                description="Are you sure you want to deactivate this listing? It will no longer be visible to buyers."
                confirmLabel="Deactivate"
                onClose={() => setDeactivateDialogOpen(false)}
                onConfirm={handleConfirmDeactivate}
            />
        </>
    );
}
