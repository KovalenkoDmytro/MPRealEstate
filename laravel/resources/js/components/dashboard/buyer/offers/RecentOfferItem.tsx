import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { Offer } from '@/types/offer';
import { formatCurrency } from "@/helpers/priceHelper";
import OfferStatusChip from "@/components/dashboard/buyer/offers/OfferStatusChip";

type RecentOfferItemProps = {
    offer: Offer;
};

export default function RecentOfferItem({ offer }: RecentOfferItemProps) {
    const isStrongOffer = offer.amount <= offer.listing.price;
    const percentage = Math.abs(((offer.amount - offer.listing.price) / offer.listing.price) * 100).toFixed(1);

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid #eaecf0',
                borderRadius: '16px',
                p: { xs: 2, sm: 3 },
                backgroundColor: '#fff',
                marginBottom: 2,
                minWidth: 0,
            }}
        >

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1.5, sm: 2 },
                    mb: { xs: 2, sm: 3 },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: '#101828',
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            lineHeight: 1.3,
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {offer.listing.title}
                    </Typography>

                    {isStrongOffer ? (
                        <TrendingUpRoundedIcon sx={{ color: '#12b76a', fontSize: '1.2rem' }}/>
                    ) : (
                        <TrendingDownRoundedIcon sx={{ color: '#d92d20', fontSize: '1.2rem' }}/>
                    )}

                    <Typography
                        component="span"
                        variant="body2"
                        sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                        {isStrongOffer ? '-' : '+'}{percentage}%
                    </Typography>
                </Box>

                <Box sx={{ flexShrink: 0 }}>
                    <OfferStatusChip status={offer.status} />
                </Box>
            </Box>


            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))' },
                    gap: { xs: 2, sm: 3 },
                    mb: { xs: 1, sm: 3 },
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" display="block" sx={{ color: '#667085', mb: 0.5 }}>
                        Listing Price
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#101828' }}>
                        {formatCurrency(offer.listing.price)}
                    </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" display="block" sx={{ color: '#667085', mb: 0.5 }}>
                        Your Offer
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#101828' }}>
                        {formatCurrency(offer.amount)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}
