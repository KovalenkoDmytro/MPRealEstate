import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Timeline } from '@mui/icons-material';

export default function TotalSummaryPill({ total }: { total: number }) {
    return (
        <Paper
            elevation={0}
            sx={{
                display: 'flex', alignItems: 'center', gap: 2.5,
                background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                border: '1px solid #C7D2FE',
                py: 1.5, px: 3, borderRadius: 4,
            }}
        >
            <Box sx={{ bgcolor: '#fff', p: 1.2, borderRadius: '50%', color: '#4F46E5', boxShadow: '0 4px 6px -1px rgba(79,70,229,0.1)' }}>
                <Timeline />
            </Box>
            <Box>
                <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ letterSpacing: 0.8, textTransform: 'uppercase', opacity: 0.8 }}>
                    Total (30 Days)
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#312E81', lineHeight: 1 }}>
                    {total}
                </Typography>
            </Box>
        </Paper>
    );
}
