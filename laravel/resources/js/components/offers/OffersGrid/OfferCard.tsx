import { useState } from "react";
import { Offer, OfferStatus } from "@/types";
import {Paper, Typography, Box, Stack, Avatar} from "@mui/material";
import { format, parseISO } from 'date-fns';
import theme from "@/theme";
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
    const percentDiff = ((difference / offer.listing.price) * 100);

    const formattedAmount = difference > 0 ? `+${formatCurrency(difference)}` : formatCurrency(difference);
    const formattedPercent = difference > 0 ? `+${percentDiff.toFixed(1)}` : percentDiff.toFixed(1);

    const isBelowAsking = difference < 0;
    const isAboveAsking = difference > 0;

    const boxColor = isAboveAsking ? '#2F855A' : (isBelowAsking ? '#C53030' : '#718096');
    const boxBg = isAboveAsking ? '#F0FFF4' : (isBelowAsking ? '#FFF5F5' : '#EDF2F7');

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
            <Paper
                elevation={0}
                sx={{
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.border.main}`,
                    display: 'flex',
                    padding: theme.shape.padding,
                    flexDirection: { xs: 'column', md: 'row' },
                    bgcolor: theme.palette.background.white,
                    fontFamily: 'sans-serif',
                    width: '100%',
                }}
            >
                {/* --- LEFT SECTION: Image --- */}
                <Box sx={{
                    width: { xs: '100%', md: 240 },
                    height: { xs: 220, md: 'auto' },
                    flexShrink: 0,
                    mr: { md: 3 },
                    mb: { xs: 2, md: 0 },
                    position: 'relative'
                }}
                >
                    <Box
                        component="img"
                        src={offer.listing.main_image?.image_path || "/api/placeholder/400/320"}
                        alt={offer.listing.title}
                        sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: theme.shape.borderRadius,
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                </Box>

                {/* --- MIDDLE SECTION: Details --- */}
                <Box
                    sx={{
                        p: 3,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: { md: '1px solid #e2e8f0' },
                        pt: 0,
                    }}
                >
                    {/* Header: Title + Status */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                            {offer.listing.title}
                        </Typography>
                        <Badge version={statusStyle.version} text={statusStyle.text}/>
                    </Stack>

                    {/* Address */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 0.5, color: theme.palette.primary.main }}>
                        <IconLocationMark/>
                        {offer.listing.street_number} {offer.listing.street_name}, {offer.listing.city}, {offer.listing.province}
                    </Typography>

                    {/* Pricing Columns */}
                    <Stack direction="row" spacing={5} mb={2}>
                        <Box>
                            <Typography variant="caption" sx={{ color: theme.palette.primary.main, display: 'block' }}>
                                Offer Amount
                            </Typography>
                            <Typography variant="h5" fontWeight={800} sx={{ color: '#1a202c' }}>
                                {formatCurrency(offer.amount)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 0.5 }}>
                                Asking Price
                            </Typography>
                            <Typography variant="h6" fontWeight={600} sx={{ color: '#718096' }}>
                                {formatCurrency(offer.listing.price)}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Price Difference Indicator */}
                    <Box
                        sx={{
                            bgcolor: boxBg,
                            color: boxColor,
                            p: 1.5,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: 'fit-content'
                        }}
                    >
                        {isAboveAsking ? <IconTrendingUp/> : (isBelowAsking ? <IconTrendingDown/> : null)}

                        <Typography variant="body2" fontWeight={700}>
                            {formattedAmount}
                            <Box component="span" sx={{ fontWeight: 500, opacity: 0.9, ml: 0.5 }}>
                                ({formattedPercent}% {isAboveAsking ? 'above' : 'below'} asking)
                            </Box>
                        </Typography>
                    </Box>
                </Box>

                {/* --- RIGHT SECTION: Target User (Buyer or Seller) & Metadata --- */}
                <Box sx={{ p: 3, pt: 0, width: { md: 350 }, display: 'flex', flexDirection: 'column' }}>

                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        {targetLabel}
                    </Typography>

                    {/* User Profile */}
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: '#572A4D1A', color: '#718096', width: 40, height: 40 }}>
                            {targetUser?.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
                            {targetUser?.name}
                        </Typography>
                    </Stack>

                    {/* Date Sent */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2, bgcolor: '#F7FAFC', p: 2, borderRadius: 1 }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                            <IconCalendarToday/>
                            <Typography variant="body2" fontWeight={500}>Send</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600} color="#1a202c">
                            {offer.created_at ? format(parseISO(offer.created_at), 'MMM d, yyyy') : 'N/A'}
                        </Typography>
                    </Stack>

                    {/* Message */}
                    <Box sx={{ p: 2, bgcolor: '#CB9A9F1A', borderRadius: 1, mb: 2 }}>
                        <Typography variant="caption" color={theme.palette.primary.main} fontWeight={700}>Message</Typography>
                        <Typography variant="body2" color={theme.palette.secondary.main}>{offer.message}</Typography>
                    </Box>

                    {/* Actions: Only show for Seller on Pending offers */}
                    {role === 'seller' && isPending && (
                        <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                            <Button
                                version="primary"
                                text="Accept"
                                onClick={() => handleActionClick('accepted')}
                                icon={<IconConfirm />}
                            />
                            <Button
                                version="outline"
                                text="Reject"
                                onClick={() => handleActionClick('rejected')}
                                icon={<IconCanceled/>}
                            />
                        </Box>
                    )}
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
