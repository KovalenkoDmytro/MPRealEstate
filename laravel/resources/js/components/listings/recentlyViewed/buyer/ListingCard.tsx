import React from 'react';
import { Paper, Box, Typography, Chip, CardMedia, Button } from '@mui/material';
import { Bed, Bathtub, SquareFoot, ArrowForward, LocationOn } from '@mui/icons-material';
import {RealEstateListing} from "@/types";


export default function ListingCard({ listing }: { listing: RealEstateListing }) {
    // 1. Format Price
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(listing.price);

    // 2. Handle Image URL (Fallback to placeholder)
    const imageUrl = listing.main_image?.image_path
        ? listing.main_image.image_path
        : 'https://placehold.co/600x400?text=No+Image';

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            {/* Image Section */}
            <Box position="relative">
                <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={listing.title}
                    sx={{ objectFit: 'cover' }}
                />
                {/* Price Tag Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(4px)',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        color: '#111827',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    {formattedPrice}
                </Box>
            </Box>

            {/* Content Section */}
            <Box p={2.5} flexGrow={1} display="flex" flexDirection="column">
                <Typography variant="h6" fontWeight={700} noWrap title={listing.title} gutterBottom>
                    {listing.title}
                </Typography>

                <Box display="flex" alignItems="center" gap={0.5} mb={2} color="text.secondary">
                    <LocationOn sx={{ fontSize: 16, color: '#9CA3AF' }} />

                </Box>

                {/* Specs Chips */}
                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                    <Chip
                        icon={<Bed style={{ fontSize: 16 }} />}
                        label={`${listing.bedrooms} Beds`}
                        size="small"
                        sx={{ bgcolor: '#F3F4F6', fontWeight: 600, color: '#4B5563' }}
                    />
                    <Chip
                        icon={<Bathtub style={{ fontSize: 16 }} />}
                        label={`${Number(listing.bathrooms)} Bath`}
                        size="small"
                        sx={{ bgcolor: '#F3F4F6', fontWeight: 600, color: '#4B5563' }}
                    />
                    <Chip
                        icon={<SquareFoot style={{ fontSize: 16 }} />}
                        label={`${listing.square_feet} sqft`}
                        size="small"
                        sx={{ bgcolor: '#F3F4F6', fontWeight: 600, color: '#4B5563' }}
                    />
                </Box>

                {/* Action Button */}
                <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowForward />}
                    href={`/listings/${listing.id}`} // Uses standard link, or replace with Inertia Link
                    sx={{
                        mt: 'auto',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: '#E5E7EB',
                        color: '#374151',
                        '&:hover': {
                            borderColor: '#4F46E5',
                            color: '#4F46E5',
                            bgcolor: '#EEF2FF'
                        }
                    }}
                >
                    View Details
                </Button>
            </Box>
        </Paper>
    );
}
