import React, { ReactNode } from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface PerformanceMetricCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    color: 'indigo' | 'pink' | 'emerald' | 'blue' | 'orange';
}

export default function PerformanceMetricCard({ title, value, icon, color }: PerformanceMetricCardProps) {

    // Color configurations matching your "Soft UI" theme
    const styles = {
        indigo: { bg: '#EEF2FF', text: '#4F46E5', iconBg: '#E0E7FF' },
        pink:   { bg: '#FDF2F8', text: '#DB2777', iconBg: '#FCE7F3' }, // For Favorites
        emerald:{ bg: '#ECFDF5', text: '#059669', iconBg: '#D1FAE5' }, // For Unique
        blue:   { bg: '#EFF6FF', text: '#2563EB', iconBg: '#DBEAFE' }, // For Total Views
        orange: { bg: '#FFF7ED', text: '#EA580C', iconBg: '#FFEDD5' }, // For Trends
    };

    const currentStyle = styles[color];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                bgcolor: '#fff',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }
            }}
        >
            <Box display="flex" alignItems="center" gap={2}>
                {/* Icon Box */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        bgcolor: currentStyle.iconBg,
                        color: currentStyle.text,
                    }}
                >
                    {icon}
                </Box>

                {/* Text Content */}
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                        {new Intl.NumberFormat('en-US').format(value)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}
