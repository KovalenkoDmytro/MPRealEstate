import { Box, Typography, Chip, Alert, AlertTitle } from '@mui/material';
import { Offer } from '@/types';
import theme from "@/theme";

type UserOfferStatusProps = {
    offer: Offer;
};

export const UserOfferStatus = ({ offer }: UserOfferStatusProps) => {

    // 1. Map offer status to Alert severity and content
    const statusConfig: Record<string, {
        severity: 'success' | 'error' | 'info';
        title: string;
        message: string;
    }> = {
        accepted: {
            severity: 'success',
            title: 'Offer Accepted!',
            message: 'Congratulations! The seller has accepted your offer.',
        },
        rejected: {
            severity: 'error',
            title: 'Offer Declined',
            message: 'The seller has decided not to proceed with this offer.',
        },
        pending: {
            severity: 'info',
            title: 'Offer Pending',
            message: 'Offer submitted. Awaiting seller response.',
        }
    };

    // 2. Get current config or fallback to pending
    const config = statusConfig[offer.status] || statusConfig.pending;

    return (
        <Alert
            severity={config.severity}
            variant="standard"
            sx={{
                p: theme.shape.padding, borderRadius: theme.shape.borderRadius,
                '& .MuiAlert-message': { width: '100%' },
                alignItems: 'flex-start',
            }}
        >

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">

                <Box>
                    <AlertTitle sx={{ fontWeight: 'bold' }}>
                        {config.title}
                    </AlertTitle>

                    <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                        ${parseFloat(String(offer.amount)).toLocaleString()}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {config.message}
                    </Typography>
                </Box>

                <Chip
                    label={offer.status.toUpperCase()}
                    color={config.severity}
                    size="small"
                    variant="filled"
                    sx={{ fontWeight: 600, ml: 2 }}
                />
            </Box>
        </Alert>
    );
};
