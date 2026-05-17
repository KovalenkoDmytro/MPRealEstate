import {
    Box,
    Typography,
    Stack,
    Divider,
    Paper,
    Avatar
} from '@mui/material';
import { Link } from '@inertiajs/react';
import { AppointmentWithListingSeller , AppointmentWithListingBuyer } from '@/types';
import { format, parseISO, isFuture } from 'date-fns';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import theme from "@/theme";
import IconLocationMark from "@/icons/IconLocationMark";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconClock from "@/icons/IconClock";
import {useAuth} from "@/hooks/useAuth";
import { Email, Phone } from "@mui/icons-material";


type Props = {
    appointment: AppointmentWithListingBuyer | AppointmentWithListingSeller;
    onCancel: (id: number) => void;
    // Seller specific actions
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
};

// Type guard to check if appointment has buyer info (is seller view)
function isSellerAppointment(appointment: AppointmentWithListingBuyer | AppointmentWithListingSeller): appointment is AppointmentWithListingBuyer {
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
                version = 'primary';
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
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                p: { xs: 2, md: theme.shape.padding },
                mb: 2,
                borderRadius: theme.shape.borderRadius,
                borderColor: theme.palette.border.main,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 2, md: 3 },
                minWidth: 0,
            }}
        >
            {/* --- Left: Image --- */}
            <Box
                component="img"
                src={mainImage}
                alt={listing?.title || 'Property'}
                sx={{
                    width: { xs: '100%', md: 240 },
                    height: { xs: 180, sm: 220, md: 'auto' },
                    minHeight: { xs: 180, md: 200 },
                    borderRadius: theme.shape.borderRadius,
                    objectFit: 'cover',
                }}
            />

            {/* --- Right: Details --- */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Header Row */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1.5, sm: 2 },
                        mb: 1,
                        minWidth: 0,
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }} >
                        <Link href={route('listings.show', listing.id)} className="hover:underline">
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontSize: { xs: '1.125rem', md: '1.5rem' },
                                    lineHeight: 1.25,
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                {listing.title}
                            </Typography>
                        </Link>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: { xs: 1, md: 2 },
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                overflowWrap: 'anywhere',
                            }}
                        >
                            <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0, mt: 0.25 }}>
                                <IconLocationMark />
                            </Box>
                            {listing.street_number}, {listing.street_name}, {listing.city}, {listing.province}
                        </Typography>
                    </Box>


                    <Box sx={{ flexShrink: 0 }}>
                        {renderStatusBadge(appointment.status)}
                    </Box>
                </Box>

                {/* Date & Time Row */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    gap={{ xs: 1.25, sm: 3 }}
                    sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 2, md: 3 } }}
                >
                    <Stack direction="row" alignItems="center" gap={1}>
                        <IconCalendarToday/>
                        <Typography variant="body1" fontWeight={600} color="text.primary">
                            {dateStr}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1}>
                        <IconClock/>
                        <Typography variant="body1" fontWeight={600} color="text.primary">
                            {timeStr}
                        </Typography>
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 2 }} />


                {user.role === "seller" && isSellerAppointment(appointment) && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                            Visitor
                        </Typography>
                        <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                            <Stack direction="row" alignItems="center" gap={1.5}>
                                <Avatar
                                    sx={{ width: 32, height: 32, bgcolor: 'grey.200', color: 'text.primary', fontSize: 14, fontWeight: 700 }}
                                >
                                    {appointment.buyer.name ? appointment.buyer.name.charAt(0) : '?'}
                                </Avatar>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {appointment.buyer.name}
                                </Typography>
                            </Stack>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                gap={{ xs: 0.75, sm: 2 }}
                                color="text.secondary"
                                sx={{ minWidth: 0 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                                    <Email sx={{ fontSize: 16 }} />
                                    <Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>
                                        {appointment.buyer.email}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                                    <Phone sx={{ fontSize: 16 }} />
                                    <Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>
                                        {appointment.buyer.phone_number}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                )}



                {/* Footer: Notes & Actions */}
                <Box
                    sx={{
                        mt: 'auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', sm: 'flex-end' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                    }}
                >

                    {/* Information / Notes Area */}
                    <Box sx={{ maxWidth: { xs: '100%', sm: '65%' }, minWidth: 0 }}>
                        {appointment.access_code && appointment.status === 'accepted' && (
                            <>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    ACCESS CODE
                                </Typography>
                                <Typography variant="body2" color="success.main" fontWeight={600}>
                                    {appointment.access_code}
                                </Typography>
                            </>
                        )}

                        {appointment.rejection_reason && appointment.status === 'rejected' && (
                            <>
                                <Typography variant="caption" color="error.main" fontWeight={600}>
                                    REJECTION REASON
                                </Typography>
                                <Typography variant="body2" color="text.primary" sx={{ overflowWrap: 'anywhere' }}>
                                    {appointment.rejection_reason}
                                </Typography>
                            </>
                        )}
                    </Box>


                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 1.5,
                            width: { xs: '100%', sm: 'auto' },
                            '& .btn': {
                                width: { xs: '100%', sm: 'auto' },
                                minWidth: { sm: 120 },
                                whiteSpace: 'nowrap',
                            },
                        }}
                    >
                        {showCancelButton && (
                            <Button
                                version={"outline"}
                                text={"Cancel"}
                                onClick={() => onCancel(appointment.id)}
                            />
                        )}

                        {showSellerActions && (
                            <>
                                <Button
                                    version={"primary"}
                                    text={"Approve"}
                                    onClick={() => onApprove && onApprove(appointment.id)}
                                />
                                <Button
                                    version={"outline"}
                                    text={"Reject"}
                                    onClick={() => onReject && onReject(appointment.id)}
                                />
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
