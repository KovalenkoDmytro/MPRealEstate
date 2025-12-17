import React from 'react';
import { FavoriteRounded } from '@mui/icons-material';
import { Paper, Box, Typography, alpha } from '@mui/material';
import { pink } from '@mui/material/colors';

export default function SavedPropertyCard({ favoritesTotal }: { favoritesTotal: number }) {
    const mainColor = pink[500];
    const bgColor = alpha(mainColor, 0.1);

    return (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderTop: `6px solid ${mainColor}`,
                borderRadius: 4,
                boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
            }}
        >
            <Box>
                <Typography variant="subtitle1" fontWeight={600} color="text.secondary" gutterBottom>
                    Saved Properties
                </Typography>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    {favoritesTotal}
                </Typography>

            </Box>

            <Box
                sx={{
                    backgroundColor: bgColor,
                    borderRadius: 4,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FavoriteRounded sx={{ color: mainColor, fontSize: 40 }} />
            </Box>
        </Paper>
    );
}
