import React from 'react';
import { Paper, Box, Typography, LinearProgress, alpha } from '@mui/material';
import { AccessTime, CheckCircleOutline, HighlightOff, Timeline } from '@mui/icons-material';

interface StatCardProps {
    title: string;
    count: number;
    type: 'pending' | 'completed' | 'cancelled' | 'total';
    progressValue: number;
}

export default function StatCard({ title, count, type, progressValue }: StatCardProps) {
    // Your existing config is great, keeping it as is.
    const config = {
        pending: {
            color: '#059669', bgColor: '#ECFDF5', barColor: '#10B981',
            icon: <AccessTime fontSize="small" />
        },
        completed: {
            color: '#2563EB', bgColor: '#EFF6FF', barColor: '#3B82F6',
            icon: <CheckCircleOutline fontSize="small" />
        },
        cancelled: {
            color: '#DC2626', bgColor: '#FEF2F2', barColor: '#EF4444',
            icon: <HighlightOff fontSize="small" />
        },
        total: {
            color: '#4F46E5', bgColor: '#EEF2FF', barColor: '#6366F1',
            icon: <Timeline fontSize="small" />
        }
    };

    const style = config[type];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: style.color,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'box-shadow 0.3s ease',
                '&:hover': { boxShadow: `0 8px 24px ${alpha(style.color, 0.15)}` }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    {title}
                </Typography>
                <Box sx={{ bgcolor: style.bgColor, color: style.color, p: 1, borderRadius: '50%', display: 'flex' }}>
                    {style.icon}
                </Box>
            </Box>

            <Typography variant="h4" color="text.primary" fontWeight={700} mb={3}>
                {count}
            </Typography>

            <Box sx={{ width: '100%' }}>
                <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: alpha(style.barColor, 0.15),
                        '& .MuiLinearProgress-bar': { bgcolor: style.barColor, borderRadius: 5 }
                    }}
                />
            </Box>
        </Paper>
    );
}
