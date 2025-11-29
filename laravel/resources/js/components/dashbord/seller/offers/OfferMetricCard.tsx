import React, { ReactNode } from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface OfferMetricCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    type: 'total' | 'accepted' | 'rejected' | 'pending';
}

export default function OfferMetricCard({ title, value, icon, type }: OfferMetricCardProps) {

    // Visual Configuration
    const config = {
        total:    { bg: '#F8FAFC', text: '#475569', iconBg: '#E2E8F0', iconColor: '#64748B' }, // Slate
        pending:  { bg: '#FFF7ED', text: '#C2410C', iconBg: '#FFEDD5', iconColor: '#F97316' }, // Orange
        accepted: { bg: '#F0FDF4', text: '#15803D', iconBg: '#DCFCE7', iconColor: '#22C55E' }, // Green
        rejected: { bg: '#FEF2F2', text: '#B91C1C', iconBg: '#FEE2E2', iconColor: '#EF4444' }, // Red
    };

    const style = config[type];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} mb={0.5}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color: style.text }}>
                        {value}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: style.iconBg,
                        color: style.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </Paper>
    );
}
