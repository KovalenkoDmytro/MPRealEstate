import React from 'react';
import { Box, Grid, Typography, Button, Paper } from '@mui/material';
import { History, Search } from '@mui/icons-material';
import ListingCard from './ListingCard';
import {RealEstateListing} from "@/types";

interface RecentlyViewedProps {
    listings: RealEstateListing[];
}

export default function RecentlyViewed({ listings }: RecentlyViewedProps) {

    // --- Empty State ---
    if (!listings || listings.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: '#F9FAFB',
                    borderRadius: 4,
                    border: '2px dashed #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{ color: '#9CA3AF', mb: 2, bgcolor: '#fff', p: 2, borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <History sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                    No recently viewed properties
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3} maxWidth={400}>
                    Properties you view will appear here so you can easily find your way back to them.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Search />}
                    href="/listings"
                    sx={{
                        bgcolor: '#4F46E5',
                        '&:hover': { bgcolor: '#4338CA' },
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 4
                    }}
                >
                    Start Browsing
                </Button>
            </Paper>
        );
    }

    // --- Grid State ---
    return (
        <Box sx={{ mb: 6 }}>
            {/* Section Header */}
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Box sx={{ p: 1, bgcolor: '#EEF2FF', borderRadius: 2, color: '#4F46E5', display: 'flex' }}>
                    <History fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Recently Viewed
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {listings.map((listing) => (
                    <Grid size={{xs:12, sm:6, md:4}} key={listing.id}>
                        <ListingCard listing={listing} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
