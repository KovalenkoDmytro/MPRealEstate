import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import type {RealEstateListing} from "@/types";
import RecentlyViewedMiniCard from "@/components/dashboard/buyer/recentlyViewed/RecentlyViewedMiniCard";

type ComponentProps = {
    recentlyViewedListings: RealEstateListing[]
    itemsToDisplay: number,
}

export function RecentlyViewedPreviewSection({recentlyViewedListings, itemsToDisplay}: ComponentProps) {

    return (
        <Paper
            elevation={0}
            sx={{p: 3, borderRadius: 4, bgcolor: '#fff', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',}}
        >
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{mb: 3}}>
                Recently Viewed
            </Typography>


            <Grid container spacing={2}>
                {recentlyViewedListings.slice(0, itemsToDisplay).map((listing) => (
                    <Grid key={listing.id}>
                        <RecentlyViewedMiniCard listing={listing}/>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}
