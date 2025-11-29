import React, { ReactNode } from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface DealMetricCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    type: 'total' | 'completed' | 'broken' | 'pending';
}

export default function DealMetricCard({ title, value, icon, type }: DealMetricCardProps) {

    // Semantic Colors
    const config = {
        total:     { bg: '#F3F4F6', text: '#374151', iconBg: '#E5E7EB', iconColor: '#4B5563' }, // Gray
        completed: { bg: '#ECFDF5', text: '#059669', iconBg: '#D1FAE5', iconColor: '#059669' }, // Green
        broken:    { bg: '#FEF2F2', text: '#DC2626', iconBg: '#FEE2E2', iconColor: '#DC2626' }, // Red
        pending:   { bg: '#EFF6FF', text: '#2563EB', iconBg: '#DBEAFE', iconColor: '#2563EB' }, // Blue
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
