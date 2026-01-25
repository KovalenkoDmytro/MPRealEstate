import React from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Offer } from '@/types';
import theme from "@/theme";

type UserOfferStatusProps = {
    offer: Offer;
};

export const UserOfferStatus = ({ offer }: UserOfferStatusProps) => {
    // 1. Define the UI configuration for each status
    const statusConfig: Record<string, {
        color: string;
        title: string;
        message: string;
        icon: React.ReactNode;
        borderColor: string;
        bgColor: string;
    }> = {
        accepted: {
            color: 'success.main', // Green
            title: 'Offer Accepted!',
            message: 'Congratulations! The seller has accepted your offer.',
            icon: <CheckCircleIcon color="success" />,
            borderColor: '#c3e6cb',
            bgColor: '#f0fff4'
        },
        rejected: {
            color: 'error.main', // Red
            title: 'Offer Declined',
            message: 'The seller has decided not to proceed with this offer.',
            icon: <CancelIcon color="error" />,
            borderColor: '#feb2b2',
            bgColor: '#fff5f5'
        },
        pending: {
            color: 'info.main', // Blue
            title: 'Offer Pending',
            message: 'Offer submitted. Awaiting seller response.',
            icon: <HourglassEmptyIcon color="info" />,
            borderColor: '#bbdefb',
            bgColor: '#e3f2fd'
        }
    };

    // 2. Get current config or fallback to pending
    const currentStatus = statusConfig[offer.status] || statusConfig.pending;

    return (
        <Box
            sx={{
                backgroundColor: currentStatus.bgColor,
                border: `1px solid ${currentStatus.borderColor}`,
                borderRadius: theme.shape.borderRadius,
                p: theme.shape.padding,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        {currentStatus.icon}
                        <Typography variant="h6" sx={{ color: currentStatus.color, fontWeight: 'bold' }}>
                            {currentStatus.title}
                        </Typography>
                    </Stack>

                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: currentStatus.color }}>
                        ${parseFloat(String(offer.amount)).toLocaleString()}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {currentStatus.message}
                    </Typography>
                </Box>

                {/* Optional: Status Chip for explicit clarity */}
                <Chip
                    label={offer.status.toUpperCase()}
                    color={offer.status === 'accepted' ? 'success' : offer.status === 'rejected' ? 'error' : 'info'}
                    size="small"
                    variant="outlined"
                />
            </Stack>
        </Box>
    );
};
