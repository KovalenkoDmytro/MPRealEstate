import { PropertyDetail, User } from '@/types';
import { Paper, Typography, Box, Stack, Avatar } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { formatCurrency } from '@/helpers/priceHelper';
import IconLocationMark from '@/icons/IconLocationMark';
import IconBed from '@/icons/IconBed';
import IconBath from '@/icons/IconBath';
import IconSqft from '@/icons/IconSqft';
import IconAppointments from '@/icons/IconAppointments';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import DealGallery from './DealGallery';
import { neutral, primary, radius } from '@/design/tokens';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface DealCardProps { deal: PropertyDetail }

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
    const user = useAuth();
    const listing = deal.real_estate_listing ?? null;
    const title = listing?.title ?? deal.name ?? 'Listing unavailable';
    const counterparty: User | undefined = user.role === 'buyer'
        ? deal.users.find((person) => person.role === 'seller')
        : deal.users.find((person) => person.role === 'buyer');
    const status: { label: string; version: 'error' | 'success' | 'warning' } = deal.is_broken
        ? { label: 'Deal broken', version: 'error' }
        : deal.is_completed ? { label: 'Closed', version: 'success' } : { label: 'Pending', version: 'warning' };

    return (
        <Paper component="article" elevation={0} sx={{
            bgcolor: neutral[50], borderRadius: radius.lg, border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', p: { xs: 2, sm: 3 },
        }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))', xl: 'minmax(240px, 0.95fr) minmax(0, 1.45fr) minmax(240px, 1fr)' }, gap: 3, alignItems: 'stretch' }}>
                <DealGallery title={title} mainImage={listing?.main_image?.image_path} images={listing?.images?.map((image) => image.image_path) ?? []} />
                <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
                        <Typography component="h3" sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4, overflowWrap: 'anywhere', color: neutral[800] }}>{title}</Typography>
                        <Badge text={status.label} version={status.version} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, color: neutral[600], mb: 2, '& svg': { flexShrink: 0, mt: '2px' } }}>
                        <IconLocationMark />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', overflowWrap: 'anywhere' }}>{listing ? [`${listing.street_number} ${listing.street_name}`.trim(), listing.city, listing.province].filter(Boolean).join(', ') : 'Property listing is no longer available'}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: neutral[600], lineHeight: 1.6, mb: 2.5, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>{listing?.description ?? 'Deal details remain available even though listing details are unavailable.'}</Typography>
                    {listing && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5, '& > span': { display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: neutral[100], px: 1.25, py: 0.75, borderRadius: radius.sm, color: neutral[600] } }}>
                            <Typography component="span" variant="caption"><IconBed />{listing.bedrooms} beds</Typography>
                            <Typography component="span" variant="caption"><IconBath />{listing.bathrooms} baths</Typography>
                            <Typography component="span" variant="caption"><IconSqft />{listing.square_feet.toLocaleString()} sqft</Typography>
                        </Box>
                    )}
                    <Box sx={{ borderTop: `1px solid ${neutral[200]}`, pt: 2.5, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 3 }}>
                        <Box>
                            <Typography variant="caption" sx={{ color: neutral[600] }}>Offer amount</Typography>
                            <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: primary[900], fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(deal.amount)}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: neutral[600] }}>Original price</Typography>
                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: neutral[600], fontVariantNumeric: 'tabular-nums', pb: 0.5 }}>{listing ? formatCurrency(listing.price) : 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ gridColumn: { md: '1 / -1', xl: 'auto' }, bgcolor: neutral[100], border: `1px solid ${neutral[200]}`, borderRadius: radius.md, p: 2.5, minWidth: 0 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: primary[100], color: primary[700], borderRadius: radius.sm, fontSize: '1rem', fontWeight: 600 }}>{counterparty?.name?.charAt(0).toUpperCase() ?? '?'}</Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="caption" sx={{ color: neutral[600], textTransform: 'capitalize' }}>{counterparty?.role ?? 'Counterparty'}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: neutral[800], overflowWrap: 'anywhere' }}>{counterparty?.name ?? 'Unknown user'}</Typography>
                        </Box>
                    </Stack>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2, mb: 2.5 }}>
                        {[
                            { label: 'Submitted', value: format(parseISO(deal.created_at), 'MMM d, yyyy') },
                            { label: 'Possession day', value: deal.possession_day ? format(parseISO(deal.possession_day), 'MMM d, yyyy') : 'Not set yet' },
                        ].map((date) => (
                            <Box key={date.label}>
                                <Typography variant="caption" sx={{ color: neutral[600] }}>{date.label}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 0.5, color: neutral[700], '& svg': { width: 16, height: 16, flexShrink: 0, mt: '2px' } }}><IconAppointments /><Typography variant="caption" sx={{ fontWeight: 600 }}>{date.value}</Typography></Box>
                            </Box>
                        ))}
                    </Box>
                    {deal.deal_message && (
                        <Box sx={{ p: 1.5, bgcolor: neutral[50], borderRadius: radius.sm, mb: 2.5, border: `1px solid ${neutral[200]}` }}>
                            <Typography variant="caption" sx={{ color: primary[700], fontWeight: 700 }}>Latest update</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: neutral[600], mt: 0.5, lineHeight: 1.6 }}>{deal.deal_message}</Typography>
                        </Box>
                    )}
                    <Button version="primary" text="View details" link href={route('deals.show', deal.id)} icon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />} />
                </Box>
            </Box>
        </Paper>
    );
};
