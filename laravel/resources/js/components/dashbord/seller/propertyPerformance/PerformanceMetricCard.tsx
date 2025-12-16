import React, { ReactNode } from 'react';
import { Paper, Box, Typography, alpha } from '@mui/material';

interface PerformanceMetricCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    // Expanded color palette to match the target design
    color: 'indigo' | 'pink' | 'emerald' | 'blue' | 'orange';
}

export default function PerformanceMetricCard({ title, value, icon, color }: PerformanceMetricCardProps) {

    // 1. Define base colors. We will use MUI's 'alpha' helper to create lighter shades dynamically.
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
            elevation={2} // Slightly increased elevation for better depth
            sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                bgcolor: '#fff',
                position: 'relative', // Needed for absolute positioning of the pseudo-element
                overflow: 'hidden',   // Ensures the top border doesn't spill out on corners
                transition: 'transform 0.2s, box-shadow 0.2s',
                // 2. The colored top border effect using a pseudo-element
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '6px', // Thickness of the top border
                    bgcolor: mainColor,
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8 // Deeper shadow on hover
                }
            }}
        >
            {/* 3. Flex container to separate left text and right icon */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">

                {/* Left Side: Number and Title */}
                <Box>
                    {/* Number first, larger and bolder */}
                    <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                        {new Intl.NumberFormat('en-US').format(value)}
                    </Typography>
                    {/* Title second, smaller */}
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                        {title}
                    </Typography>
                </Box>

                {/* Right Side: Icon Circle */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,  // Slightly larger icon container
                        height: 56,
                        borderRadius: '50%', // Circular shape
                        // Use alpha for a light, translucent background color based on the main color
                        bgcolor: alpha(mainColor, 0.15),
                        color: mainColor,
                    }}
                >
                    {/* Clone element to ensure consistent icon size */}
                    {React.cloneElement(icon as React.ReactElement, { fontSize: 'large' })}
                </Box>
            </Box>
        </Paper>
    );
}
