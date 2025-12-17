import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from '@inertiajs/react';
import { RealEstateListing } from "@/types";

export default function SavedPropertyMiniCard({ listing }: { listing: RealEstateListing }) {
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
    }).format(listing.price);

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                height: '100%',
            }}
        >
            <CardActionArea
                component={Link}
                href={route('buyer.listings.show', listing.id)}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main',
                    }
                }}
            >
                <CardMedia
                    component="img"
                    height="120"
                    image={listing.main_image?.image_path || 'https://placehold.co/600x400?text=No+Image'}
                    alt={listing.title}
                    sx={{ objectFit: 'cover' }}
                />

                <CardContent sx={{ p: 2, pb: '16px !important', flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {listing.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {formattedPrice}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
