// components/dashboard/SavedPropertiesSummaryCard.tsx
import React from 'react';
import { Paper, Box, Typography, alpha } from '@mui/material';
import { FavoriteRounded } from '@mui/icons-material';
import { pink } from '@mui/material/colors';

interface SavedPropertiesSummaryCardProps {
    count: number;
}

export default function SavedPropertiesSummaryCard({ count }: SavedPropertiesSummaryCardProps) {
    // Color theme based on image_24.png
    const mainColor = pink[500]; // #e91e63
    const iconBgColor = alpha(mainColor, 0.15);

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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                transition: 'transform 0.2s, box-shadow 0.2s',
                // The colored top border effect
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '6px',
                    bgcolor: mainColor,
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8,
                }
            }}
        >
            {/* Left Text Section */}
            <Box>
                <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                    Saved Properties
                </Typography>
                {/* Big Number */}
                <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                    {count}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Saved Homes
                </Typography>
            </Box>

            {/* Right Icon Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: 4, // Rounded square
                    bgcolor: iconBgColor,
                    color: mainColor,
                }}
            >
                <FavoriteRounded fontSize="large" />
            </Box>
        </Paper>
    );
}
