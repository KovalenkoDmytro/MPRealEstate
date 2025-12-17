import React from 'react';
import { Card, CardActionArea, Box, Typography, Grid } from '@mui/material';
import { ArrowForwardRounded } from '@mui/icons-material';
import { Link } from '@inertiajs/react';

interface SeeMoreGridCardProps {
    totalCount: number;
    href: string;
    itemLabel?: string;
}

export default function SeeMoreGridCard({ totalCount, href, itemLabel = 'favorites' }: SeeMoreGridCardProps) {
    return (
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'divider',
                    height: '100%', // Ensure it matches the height of neighbor cards
                    bgcolor: 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                    }
                }}
            >
                <CardActionArea
                    component={Link}
                    href={href}
                    sx={{ height: '100%' }}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        p={3}
                        height="100%"
                        color="text.secondary"
                        sx={{ minHeight: 180 }}
                    >
                        <ArrowForwardRounded sx={{ fontSize: 48, mb: 2, color: 'primary.light' }} />
                        <Typography variant="h6" fontWeight={700} color="text.primary">
                            See More
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                            View all {totalCount} {itemLabel}
                        </Typography>
                    </Box>
                </CardActionArea>
            </Card>
        </Grid>
    );
}
