import { useState } from "react";
import { Offer, OfferStatus } from "@/types";
import {Paper, Typography, Box, Stack, Avatar, ButtonBase} from "@mui/material";
import { format, parseISO } from 'date-fns';
import { neutral, primary, success, error, radius } from '@/design/tokens';
import { Link } from '@inertiajs/react';
import { formatCurrency } from "@/helpers/priceHelper";
import Badge from "@/components/common/Badge";
import IconLocationMark from "@/icons/IconLocationMark";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useNotification } from "@/context/NotificationContext";
import { offerService } from "@/services/offerService";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconTrendingDown from "@/icons/IconTrendingDown";
import IconTrendingUp from "@/icons/IconTrendingUp";
import IconConfirm from "@/icons/IconConfirm";
import IconCanceled from "@/icons/IconCanceled";

type BadgeVariant = "primary" | "success" | "error" | "warning" | "notification" | "accent" | "neutral";

interface OfferCardProps {
    offer: Offer;
    role: 'buyer' | 'seller';
}

export default function OfferCard({ offer, role }: OfferCardProps) {
    const { showNotification } = useNotification();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'accepted' | 'rejected' | null>(null);


    const targetUser = role === 'seller' ? offer.buyer : offer.listing.seller;
    const targetLabel = role === 'seller' ? 'Buyer' : 'Seller';

    // --- Price Logic ---
    const difference = offer.amount - offer.listing.price;
    const percentDiff = (offer.listing.price > 0 ? (difference / offer.listing.price) * 100 : 0);

    const formattedAmount = difference > 0 ? `+${formatCurrency(difference)}` : formatCurrency(difference);
    const formattedPercent = difference > 0 ? `+${percentDiff.toFixed(1)}` : percentDiff.toFixed(1);

    const isBelowAsking = difference < 0;
    const isAboveAsking = difference > 0;

    const boxColor = isAboveAsking ? success[700] : (isBelowAsking ? error[700] : neutral[600]);
    const boxBg = isAboveAsking ? success[50] : (isBelowAsking ? error[50] : neutral[100]);

    const getStatusStyles = (status: OfferStatus): { text: string; version: BadgeVariant } => {
        switch (status) {
            case OfferStatus.Pending:
                return { text: status, version: 'warning' };
            case OfferStatus.Accepted:
                return { text: status, version: 'success' };
            case OfferStatus.Rejected:
                return { text: status, version: 'error' };
            default:
                return { text: status, version: 'neutral' };
        }
    };

    const statusStyle = getStatusStyles(offer.status);
    const isPending = offer.status === OfferStatus.Pending;

    // --- Seller Action Handlers ---
    const handleActionClick = (type: 'accepted' | 'rejected') => {
        setActionType(type);
        setDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!actionType) return;

        try {
            await offerService.updateOfferStatus(offer.id, actionType);
            showNotification(`Offer ${actionType} successfully`, "success");
            window.location.reload();
        } catch {
            showNotification("Failed to update offer status", "error");
        } finally {
            setDialogOpen(false);
        }
    };

    return (
        <>
            <Paper component="article" elevation={0} sx={{ bgcolor: neutral[50], borderRadius: radius.lg, border: `1px solid ${neutral[200]}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
                <ButtonBase LinkComponent={Link} href={route('listings.show', offer.listing.id)} aria-label={`View ${offer.listing.title}`} sx={{ width: '100%', height: 160, position: 'relative', flexShrink: 0, '&:focus-visible': { outline: `3px solid ${primary[400]}`, outlineOffset: -3 } }}>
                    <Box component="img" src={offer.listing.main_image?.image_path || '/images/placeholder-house.jpg'} alt={offer.listing.title} loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', top: 14, right: 14 }}><Badge version={statusStyle.version} text={statusStyle.text} size="small" /></Box>
                </ButtonBase>
                <Box sx={{ p: { xs: 2, sm: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Link href={route('listings.show', offer.listing.id)} style={{ textDecoration: 'none' }}><Typography component="h2" sx={{ fontSize: '1rem', overflowWrap: 'anywhere', fontWeight: 700, lineHeight: 1.4, color: neutral[800], '&:hover': { color: primary[600] } }}>{offer.listing.title}</Typography></Link>
                    <Stack direction="row" spacing={0.75} sx={{ mt: 1, mb: 2.5, color: neutral[600], '& svg': { width: 17, height: 17, flexShrink: 0, mt: '2px' } }}>
                        <IconLocationMark /><Typography variant="caption">{offer.listing.street_number} {offer.listing.street_name}, {offer.listing.city}, {offer.listing.province}</Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                        <Box><Typography variant="caption" color="text.secondary">Offer amount</Typography><Typography sx={{ fontSize: '1.8rem', lineHeight: 1.3, fontWeight: 800, color: primary[900], letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(offer.amount)}</Typography></Box>
                        <Box><Typography variant="caption" color="text.secondary">Asking price</Typography><Typography sx={{ fontSize: '1.3rem', lineHeight: 1.8, fontWeight: 600, color: neutral[600], fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(offer.listing.price)}</Typography></Box>
                    </Box>
                    <Box sx={{ bgcolor: boxBg, color: boxColor, p: 1.25, borderRadius: radius.sm, display: 'flex', alignItems: 'center', gap: 0.75, mb: 2.5, '& svg': { width: 18, height: 18, flexShrink: 0 } }}>
                        {isAboveAsking ? <IconTrendingUp /> : isBelowAsking ? <IconTrendingDown /> : null}
                        <Typography variant="body2"><Box component="span" fontWeight={700}>{formattedAmount}</Box> · {difference === 0 ? 'At asking price' : `${formattedPercent}% ${isAboveAsking ? 'above' : 'below'} asking`}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', pt: 2, borderTop: `1px solid ${neutral[200]}`, mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 36, height: 36, borderRadius: radius.sm, bgcolor: primary[100], color: primary[700], fontSize: 15, fontWeight: 700 }}>{targetUser?.name?.charAt(0) || '?'}</Avatar>
                            <Box><Typography variant="caption" color="text.secondary">{targetLabel}</Typography><Typography variant="body2" fontWeight={700}>{targetUser?.name || 'Not available'}</Typography></Box>
                        </Stack>
                        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: neutral[600], '& svg': { width: 17, height: 17 } }}><IconCalendarToday /><Typography variant="caption">Sent {offer.created_at ? format(parseISO(offer.created_at), 'MMM d, yyyy') : 'N/A'}</Typography></Stack>
                    </Box>
                    {offer.message && <Box sx={{ bgcolor: neutral[100], p: 1.5, borderRadius: radius.md, mb: 2 }}><Typography variant="caption" fontWeight={700} sx={{ color: primary[700] }}>Message</Typography><Typography variant="body2" sx={{ color: neutral[600], mt: 0.5, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{offer.message}</Typography></Box>}
                    {role === 'seller' && isPending && <Box sx={{ mt: 'auto', pt: 1, display: 'flex', gap: 1 }}>
                        <Button version="outline" text="Reject" onClick={() => handleActionClick('rejected')} icon={<IconCanceled />} />
                        <Button version="primary" text="Accept offer" onClick={() => handleActionClick('accepted')} icon={<IconConfirm />} />
                    </Box>}
                </Box>
            </Paper>

            {/* Confirm Dialog (Seller Only) */}
            {role === 'seller' && (
                <ConfirmDialog
                    open={dialogOpen}
                    title={actionType === 'accepted' ? "Accept Offer?" : "Reject Offer?"}
                    description={
                        actionType === 'accepted'
                            ? "Are you sure you want to accept this offer? This will notify the buyer."
                            : "Are you sure you want to reject this offer? This action cannot be undone."
                    }
                    confirmLabel={actionType === 'accepted' ? "Accept" : "Reject"}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={handleConfirmAction}
                />
            )}
        </>
    );
}
