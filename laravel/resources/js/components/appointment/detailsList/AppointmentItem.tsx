import {
    Box,
    Typography,
    Stack,
    Paper,
    ButtonBase,
    Avatar
} from '@mui/material';
import { Link } from '@inertiajs/react';
import { Appointment, AppointmentWithListingBuyer } from '@/types';
import { format, parseISO, isFuture } from 'date-fns';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { neutral, primary, radius } from '@/design/tokens';
import IconLocationMark from "@/icons/IconLocationMark";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconClock from "@/icons/IconClock";
import {useAuth} from "@/hooks/useAuth";
import { Email, Phone } from "@mui/icons-material";


type Props = {
    appointment: Appointment;
    onCancel: (id: number) => void;
    // Seller specific actions
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
};

// Type guard to check if appointment has buyer info (is seller view)
function isSellerAppointment(appointment: Appointment): appointment is AppointmentWithListingBuyer {
    return (appointment as AppointmentWithListingBuyer).buyer !== undefined;
}

export default function AppointmentItem({ appointment, onCancel, onApprove, onReject }: Props) {
    const user = useAuth();
    const date = parseISO(appointment.scheduled_at);
    const dateStr = format(date, 'MMM d, yyyy');
    const timeStr = format(date, 'h:mm a');
    const listing = appointment.listing;
    const mainImage = listing?.main_image?.image_path || '/images/placeholder-house.jpg';

    const renderStatusBadge = (status: string) => {
        let version: 'primary' | 'notification' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';
        let label = status;

        switch (status) {
            case 'accepted':
                version = 'success';
                label = 'Confirmed';
                break;
            case 'pending':
                version = 'warning';
                label = 'Pending';
                break;
            case 'rejected':
                version = 'error';
                label = 'Rejected';
                break;
            case 'cancelled by buyer':
                version = 'neutral';
                label = 'Cancelled';
                break;
            default:
                version = 'neutral';
        }

        return <Badge version={version} text={label} size="small" />;
    };

    // Buyer Action Logic: Can cancel if pending/accepted AND future
    const showCancelButton = user.role === 'buyer' &&
        (appointment.status === 'pending' || appointment.status === 'accepted') &&
        isFuture(date);

    // Seller Action Logic: Can Confirm/Reject only if pending
    const showSellerActions = user.role === 'seller' &&
        appointment.status === 'pending' &&
        onApprove && onReject;

    return (
        <Paper component="article" elevation={0} sx={{ overflow: 'hidden', borderRadius: radius.md, border: `1px solid ${neutral[200]}`, bgcolor: neutral[0], display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
            <ButtonBase LinkComponent={Link} href={route('listings.show', listing.id)} aria-label={`View ${listing.title}`} sx={{ position: 'relative', height: { xs: 180, sm: 160 }, width: '100%', flexShrink: 0, '&:focus-visible': { outline: `3px solid ${primary[400]}`, outlineOffset: -3 } }}>
                <Box component="img" src={mainImage} alt={listing.title} loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </ButtonBase>
            <Box sx={{ p: 2, minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Box sx={{ flex: '1 1 180px', minWidth: 0 }}><Link href={route('listings.show', listing.id)} style={{ textDecoration: 'none' }}><Typography component="h3" sx={{ color: neutral[800], fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.4, flex: '1 1 180px', '&:hover': { color: primary[600] } }}>{listing.title}</Typography></Link></Box>
                    {renderStatusBadge(appointment.status)}
                </Box>
                <Stack direction="row" spacing={0.75} sx={{ color: neutral[600], '& svg': { width: 16, height: 16, flexShrink: 0, mt: '2px' } }}>
                    <IconLocationMark /><Typography variant="caption">{listing.street_number} {listing.street_name}, {listing.city}, {listing.province}</Typography>
                </Stack>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', my: 2, color: primary[800], '& > div': { display: 'flex', alignItems: 'center', gap: 0.75 }, '& svg': { width: 18, height: 18 } }}>
                    <Box><IconCalendarToday /><Typography variant="body2" fontWeight={600}>{dateStr}</Typography></Box>
                    <Box><IconClock /><Typography variant="body2" fontWeight={600}>{timeStr}</Typography></Box>
                </Box>
                {user.role === 'seller' && isSellerAppointment(appointment) && (
                    <Box sx={{ py: 1.5, borderTop: `1px solid ${neutral[200]}` }}>
                        <Typography variant="caption" color="text.secondary">Visitor</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                            <Avatar sx={{ width: 30, height: 30, bgcolor: primary[50], color: primary[700], fontSize: 13, fontWeight: 700 }}>{appointment.buyer.name?.charAt(0) || '?'}</Avatar>
                            <Typography variant="body2" fontWeight={600}>{appointment.buyer.name}</Typography>
                        </Stack>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1, color: neutral[600], '& > div': { display: 'flex', alignItems: 'center', gap: 0.5 }, '& svg': { fontSize: 15 } }}>
                            <Box><Email /><Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>{appointment.buyer.email}</Typography></Box>
                            {appointment.buyer.phone_number && <Box><Phone /><Typography variant="caption">{appointment.buyer.phone_number}</Typography></Box>}
                        </Box>
                    </Box>
                )}
                {(appointment.access_code && appointment.status === 'accepted') && <Box sx={{ bgcolor: primary[50], borderRadius: radius.sm, px: 1.5, py: 1, mb: 1.5 }}><Typography variant="caption" color="text.secondary">Access code</Typography><Typography variant="body2" fontWeight={700} sx={{ color: primary[800], letterSpacing: '0.08em', overflowWrap: 'anywhere' }}>{appointment.access_code}</Typography></Box>}
                {(appointment.rejection_reason && appointment.status === 'rejected') && <Box sx={{ bgcolor: neutral[50], borderRadius: radius.sm, p: 1.5, mb: 1.5 }}><Typography variant="caption" color="error.main">Rejection reason</Typography><Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{appointment.rejection_reason}</Typography></Box>}
                {(showCancelButton || showSellerActions) && <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 1, mt: 'auto', pt: 1.5, borderTop: `1px solid ${neutral[200]}` }}>
                    {showCancelButton && <Button version="outline" text="Cancel visit" fullWidth={false} onClick={() => onCancel(appointment.id)} />}
                    {showSellerActions && <><Button version="outline" text="Reject" fullWidth={false} onClick={() => onReject?.(appointment.id)} /><Button version="primary" text="Approve visit" fullWidth={false} onClick={() => onApprove?.(appointment.id)} /></>}
                </Box>}
            </Box>
        </Paper>
    );
}
