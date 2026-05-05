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
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                '& .MuiAlert-message': { width: '100%', minWidth: 0 },
                alignItems: 'flex-start',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'flex-start' },
                    gap: { xs: 1.5, sm: 0 },
                    width: '100%',
                    minWidth: 0,
                }}
            >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <AlertTitle sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                        {config.title}
                    </AlertTitle>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            my: 1,
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                            wordBreak: 'break-word',
                        }}
                    >
                        ${parseFloat(String(offer.amount)).toLocaleString()}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.9, wordBreak: 'break-word' }}>
                        {config.message}
                    </Typography>
                </Box>

                <Chip
                    label={offer.status.toUpperCase()}
                    color={config.severity}
                    size="small"
                    variant="filled"
                    sx={{
                        fontWeight: 600,
                        flexShrink: 0,
                        ml: { xs: 0, sm: 2 },
                        alignSelf: { xs: 'flex-start', sm: 'flex-start' },
                    }}
                />
            </Box>
        </Alert>
    );
};
