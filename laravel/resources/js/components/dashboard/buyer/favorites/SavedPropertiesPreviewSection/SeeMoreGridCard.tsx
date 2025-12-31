import React from 'react';
import { Card, CardActionArea, Box, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';

interface SeeMoreGridCardProps {
    totalCount: number;
    href: string;
    itemLabel?: string;
}

export default function SeeMoreGridCard({ totalCount, href, itemLabel = 'favorites' }: SeeMoreGridCardProps) {
    return (

            <Card
                elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'divider',
                    height: '100%',
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
                        <Typography variant="body2" fontWeight={500}>
                            View all {totalCount} {itemLabel}
                        </Typography>
                    </Box>
                </CardActionArea>
            </Card>

    );
}
