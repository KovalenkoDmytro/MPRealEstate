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
import { Email } from "@mui/icons-material";


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
                p: theme.shape.padding,
                mb: 2,
                borderRadius: theme.shape.borderRadius,
                borderColor: theme.palette.border.main,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
            }}
        >
            {/* --- Left: Image --- */}
            <Box
                component="img"
                src={mainImage}
                alt={listing?.title || 'Property'}
                sx={{
                    width: { xs: '100%', md: 240 },
                    height: { xs: 200, md: 'auto' },
                    minHeight: 200,
                    borderRadius: theme.shape.borderRadius,
                    objectFit: 'cover',
                }}
            />

            {/* --- Right: Details --- */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Header Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px'}} >
                        <Link href={route('buyer.listings.show', listing.id)} className="hover:underline">
                            <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                                {listing.title}
                            </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconLocationMark />
                            {listing.street_number}, {listing.street_name}, {listing.city}, {listing.province}
                        </Typography>
                    </Box>


                    {renderStatusBadge(appointment.status)}
                </Box>

                {/* Date & Time Row */}
                <Stack direction="row" alignItems="center" gap={3} sx={{ mt: 2, mb: 3 }}>
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

                            <Stack direction="row" alignItems="center" gap={2} color="text.secondary">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Email sx={{ fontSize: 16 }} />
                                    <Typography variant="caption">{appointment.buyer.email}</Typography>
                                    <Typography variant="caption">{appointment.buyer.phone_number}</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                )}



                {/* Footer: Notes & Actions */}
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>

                    {/* Information / Notes Area */}
                    <Box sx={{ maxWidth: '65%' }}>
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
                                <Typography variant="body2" color="text.primary">
                                    {appointment.rejection_reason}
                                </Typography>
                            </>
                        )}
                    </Box>


                    <Box sx={{ display: 'flex', gap: 2 }}>
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
