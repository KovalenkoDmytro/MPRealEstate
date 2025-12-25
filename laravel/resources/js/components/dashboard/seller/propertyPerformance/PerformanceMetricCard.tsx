import React, { ReactNode } from 'react';
import { Paper, Box, Typography, alpha } from '@mui/material';

interface PerformanceMetricCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    color: 'indigo' | 'pink' | 'emerald' | 'blue' | 'orange';
}

export default function PerformanceMetricCard({ title, value, icon, color }: PerformanceMetricCardProps) {

    const colorMap: Record<PerformanceMetricCardProps['color'], string> = {
        blue:   '#3B82F6',
        emerald:'#10B981',
        pink:   '#EC4899',
        orange: '#F59E0B',
        indigo: '#8B5CF6',
    };

    const mainColor = colorMap[color];

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
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">

                <Box>
                    <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                        {new Intl.NumberFormat('en-US').format(value)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                        {title}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: alpha(mainColor, 0.15),
                        color: mainColor,
                    }}
                >
                    {React.cloneElement(icon as React.ReactElement, { fontSize: 'large' })}
                </Box>
            </Box>
        </Paper>
    );
}
