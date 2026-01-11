import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import type {RealEstateListing} from "@/types";
import RecentlyViewedMiniCard from "@/components/dashboard/buyer/recentlyViewed/RecentlyViewedMiniCard";
import theme from "@/theme";

type ComponentProps = {
    recentlyViewedListings: RealEstateListing[]
    itemsToDisplay: number,
}

export function RecentlyViewedPreviewSection({recentlyViewedListings, itemsToDisplay}: ComponentProps) {

    return (
        <Paper
            elevation={0}
            sx={{
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                boxShadow: theme.shape.boxShadow,
            }}
        >
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{mb: 3}}>
                Recently Viewed
            </Typography>


            <Grid
                className="recently-properties-preview-section-wrapper"
                container
                spacing={2}
            >

                {recentlyViewedListings.slice(0, itemsToDisplay).map((listing) => (
                    <RecentlyViewedMiniCard key={listing.id} listing={listing}/>
                ))}
            </Grid>
        </Paper>
    );
}
