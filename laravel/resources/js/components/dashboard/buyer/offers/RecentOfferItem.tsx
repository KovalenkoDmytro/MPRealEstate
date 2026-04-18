import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Offer } from '@/types/offer';
import { formatCurrency } from "@/helpers/priceHelper";
import OfferStatusChip from "@/components/dashboard/buyer/offers/OfferStatusChip";
import Button from "@/components/common/Button";

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
                padding: 3,
                backgroundColor: '#fff',
                marginBottom: 2
            }}
        >

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#101828' }}>
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
                        sx={{ fontWeight: 700 }}
                    >
                        {isStrongOffer ? '-' : '+'}{percentage}%
                    </Typography>
                </Box>

                <OfferStatusChip status={offer.status} />
            </Box>


            <Box sx={{ display: 'flex', gap: 6, mb: 3 }}>
                <Box>
                    <Typography variant="caption" display="block" sx={{ color: '#667085', mb: 0.5 }}>
                        Listing Price
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#101828' }}>
                        {formatCurrency(offer.listing.price)}
                    </Typography>
                </Box>

                <Box>
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
