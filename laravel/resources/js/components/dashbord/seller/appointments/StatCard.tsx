import React from 'react';
import { Paper, Box, Typography, alpha } from '@mui/material';
import { AccessTimeRounded, CheckCircleOutlineRounded, HighlightOffRounded, TimelineRounded } from '@mui/icons-material';

interface StatCardProps {
    title: string;
    count: number;
    type: 'pending' | 'completed' | 'cancelled' | 'total';
}

export default function StatCard({ title, count, type }: StatCardProps) {
    const config = {
        pending: {
            color: '#F97316', // Orange
            icon: <AccessTimeRounded fontSize="large" />
        },
        completed: {
            color: '#10B981', // Green
            icon: <CheckCircleOutlineRounded fontSize="large" />
        },
        cancelled: {
            color: '#EF4444', // Red
            icon: <HighlightOffRounded fontSize="large" />
        },
        total: {
            color: '#8B5CF6', // Purple
            icon: <TimelineRounded fontSize="large" />
        }
    };

    const style = config[type];

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
                // The colored top border effect
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '6px',
                    bgcolor: style.color,
                },
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">

                <Box>
                    <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                        {new Intl.NumberFormat('en-US').format(count)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
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
                        borderRadius: 4,
                        bgcolor: alpha(style.color, 0.15),
                        color: style.color,
                    }}
                >
                    {style.icon}
                </Box>
            </Box>
        </Paper>
    );
}
