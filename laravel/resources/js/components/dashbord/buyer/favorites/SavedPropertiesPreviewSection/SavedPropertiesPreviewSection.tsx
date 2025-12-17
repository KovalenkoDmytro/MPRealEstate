import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import {FavoriteListings} from "@/types/favoriteListings";
import SavedPropertyMiniCard
    from "@/components/dashbord/buyer/favorites/SavedPropertiesPreviewSection/SavedPropertyMiniCard";
import SeeMoreGridCard from "@/components/dashbord/buyer/favorites/SavedPropertiesPreviewSection/SeeMoreGridCard";


export default function SavedPropertiesPreviewSection({favoriteListing} : { favoriteListing: FavoriteListings }) {

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#f8fafc' /* Light gray bg like image_25 */ }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                Saved Properties
            </Typography>



            <Grid container spacing={2}>
                {favoriteListing.data.slice(0, 3).map((listing) => (
                    <Grid size={{ xs: 12, sm: 6, md: 6 }} key={listing.id}>
                        <SavedPropertyMiniCard listing={listing} />
                    </Grid>
                ))}


                {favoriteListing.total > 3 && (
                    <SeeMoreGridCard
                        totalCount={favoriteListing.total}
                        href={route('buyer.listings.favorites.index')}
                        itemLabel="favorites"
                    />
                )}
            </Grid>
        </Paper>
    );
}
