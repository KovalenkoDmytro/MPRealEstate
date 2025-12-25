import React from 'react';
import { Paper, Box, Typography, Stack, alpha } from '@mui/material';
import { BusinessCenterRounded } from '@mui/icons-material';
import { OfferStats } from "@/types/models";

interface BuyerOffersCardProps {
    data: OfferStats;
}

export default function BuyerOffersCard({ data }: BuyerOffersCardProps) {

    const mainColor = '#3B82F6';
    const iconBgColor = alpha(mainColor, 0.15);

    const activeOffers = data.accepted + data.pending;

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                bgcolor: '#fff',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '6px',
                    bgcolor: mainColor,
                },

            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                    My Offers
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        bgcolor: iconBgColor,
                        color: mainColor,
                    }}
                >
                    <BusinessCenterRounded fontSize="medium" />
                </Box>
            </Stack>

            <Box mb={3}>
                <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                    {activeOffers}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Active Offers
                </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {data.accepted} Accepted, {data.pending} Pending
            </Typography>
        </Paper>
    );
}
