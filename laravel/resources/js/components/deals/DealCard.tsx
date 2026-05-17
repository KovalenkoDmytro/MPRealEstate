import {PropertyDetail, User} from "@/types";
import {
    Paper,
    Typography,
    Box,
    Stack,
    Divider,
    Avatar,
    Grid,
} from "@mui/material";
import { formatCurrency } from "@/helpers/priceHelper";
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import Button from "@/components/common/Button";
import theme from "@/theme";
import Badge from "@/components/common/Badge";
import IconAppointments from "@/icons/IconAppointments";
import { format, parseISO } from 'date-fns';
import {useAuth} from "@/hooks/useAuth";

interface DealCardProps {
    deal: PropertyDetail;
}

export const DealCard: React.FC<DealCardProps> = ({deal }) => {
    const user = useAuth();
    const listing = deal.real_estate_listing ?? null;
    const counterparty: User | undefined = user.role === 'buyer'
        ? deal.users.find(u => u.role === 'seller')
        : deal.users.find(u => u.role === 'buyer');

    const getStatusBadge = () => {
        if (deal.is_broken) return { label: "Deal Broken", color: "#B91C1C", bg: "#FEE2E2" };
        if (deal.is_completed) return { label: "Closed", color: "#047857", bg: "#D1FAE5" };
        return { label: "Pending", color: "#925b77", bg: "#f5ebf0" };
    };

    const status = getStatusBadge();

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: theme.shape.borderRadius,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: '#e2e8f0',
                padding: theme.shape.padding,
                bgcolor: theme.palette.background.white,
                color: theme.palette.primary.main,
            }}
        >
            <Grid container spacing={0}>
                {/* Left Column — 8/12 */}
                <Grid
                    size={{ xs: 12, md: 8 }}
                    sx={{
                        borderRight: { md: '1px solid #e2e8f0' },
                        pr: { md: 3 },
                    }}
                >
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        {/* Images */}
                        <Stack spacing={2} flexShrink={0}>
                            <Box
                                component="img"
                                src={listing?.main_image?.image_path ?? "/images/placeholder-house.jpg"}
                                sx={{
                                    width: { xs: '100%', md: '225px' },
                                    height: 225,
                                    borderRadius: theme.shape.borderRadius,
                                    boxShadow: theme.shape.boxShadow,
                                    objectFit: 'cover',
                                }}
                            />
                            <Stack direction="row" spacing={1}>
                                {listing?.images?.slice(0, 3).map((img, i) => (
                                    <Box
                                        key={i}
                                        component="img"
                                        src={img.image_path}
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: theme.shape.borderRadius,
                                            boxShadow: theme.shape.boxShadow,
                                            objectFit: 'cover',
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Stack>

                        {/* Details */}
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                mb={1}
                            >
                                <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                                    {listing?.title ?? deal.name ?? "Listing unavailable"}
                                </Typography>
                                <Badge text={status.label} version={"notification"} />
                            </Stack>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconLocationMark />
                                {listing
                                    ? `${listing.street_number}, ${listing.street_name}, ${listing.city}, ${listing.province}`
                                    : "Property listing is no longer available"}
                            </Typography>

                            <Typography variant="body2" sx={{ color: theme.palette.primary.main, mb: 3, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                                {listing?.description ?? "Deal details remain available even though listing details are unavailable."}
                            </Typography>

                            {listing ? (
                                <Stack direction="row" spacing={3} mb={3}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <IconBed />
                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{listing.bedrooms} Beds</Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <IconBath />
                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{listing.bathrooms} Baths</Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <IconSqft />
                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{listing.square_feet.toLocaleString()} sq ft</Typography>
                                    </Stack>
                                </Stack>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Property attributes (beds, baths, size) are unavailable.
                                </Typography>
                            )}

                            <Divider sx={{ mb: 2 }} />

                            <Stack direction="row" spacing={4}>
                                <Box>
                                    <Typography variant="caption" sx={{ letterSpacing: 0.5, color: theme.palette.primary.main }}>OFFER AMOUNT</Typography>
                                    <Typography variant="h5" fontWeight={800} sx={{ color: theme.palette.text.primary }}>{formatCurrency(deal.amount)}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ letterSpacing: 0.5, color: theme.palette.primary.main }}>ORIGINAL PRICE</Typography>
                                    <Typography variant="h5" fontWeight={800} sx={{ color: theme.palette.text.primary }}>
                                        {listing ? formatCurrency(listing.price) : "N/A"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>

                {/* Right Column — 4/12 */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ pl: { md: 3 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="caption">{counterparty?.role ?? "Counterparty"}</Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                            <Avatar sx={{ bgcolor: '#572A4D1A', color: '#718096', width: 40, height: 40 }}>
                                {counterparty?.name?.charAt(0) ?? "?"}
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
                                {counterparty?.name ?? "Unknown user"}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={4} mb={3}>
                            <Box>
                                <Typography variant="caption">Submitted</Typography>
                                <Typography variant="body2" color="#2d3748" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                                    <IconAppointments />
                                    {format(parseISO(deal.created_at), 'MMM d, yyyy')}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption">Possession day</Typography>
                                <Typography variant="body2" color="#2d3748" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                                    <IconAppointments />
                                    {deal.possession_day ? format(parseISO(deal.possession_day), 'MMM d, yyyy') : 'Not set yet'}
                                </Typography>
                            </Box>
                        </Stack>

                        <Box sx={{ p: 2, bgcolor: '#CB9A9F1A', borderRadius: 1, mb: 2 }}>
                            <Typography variant="caption" color={theme.palette.primary.main} fontWeight={700}>Notification</Typography>
                            <Typography variant="body2" color={theme.palette.secondary.main}>{deal.deal_message}</Typography>
                        </Box>

                        <Box sx={{ mt: 'auto' }}>
                            <Button
                                version="primary"
                                text="View Details"
                                link={true}
                                href={route("deals.show", deal.id)}
                                className="w-full justify-center py-3"
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};
