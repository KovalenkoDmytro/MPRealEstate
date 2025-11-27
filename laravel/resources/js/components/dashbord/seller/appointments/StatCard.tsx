import React from 'react';
import { Paper, Box, Typography, LinearProgress, alpha } from '@mui/material';
import { AccessTime, CheckCircleOutline, HighlightOff, Timeline } from '@mui/icons-material';

interface StatCardProps {
    title: string;
    count: number;
    type: 'pending' | 'completed' | 'cancelled' | 'total';
}

export default function StatCard({ title, count, type }: StatCardProps) {
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
        // --- NEW TOTAL CONFIG ---
        total: {
            color: '#4F46E5', // Indigo 600
            bgColor: '#EEF2FF', // Indigo 50
            barColor: '#6366F1', // Indigo 500
            icon: <Timeline fontSize="small" />
        }
    };

    const style = config[type];
    const progressValue = type === 'total' ? 100 : 70;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -10px rgba(0,0,0,0.08)' }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" color="text.primary">
                        {count}
                    </Typography>
                </Box>
                <Box sx={{ bgcolor: style.bgColor, color: style.color, p: 1.2, borderRadius: 3, display: 'flex' }}>
                    {style.icon}
                </Box>
            </Box>

            <Box sx={{ width: '100%' }}>
                <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                        height: 6, borderRadius: 5, bgcolor: alpha(style.barColor, 0.15),
                        '& .MuiLinearProgress-bar': { bgcolor: style.barColor, borderRadius: 5 }
                    }}
                />
            </Box>
        </Paper>
    );
}
