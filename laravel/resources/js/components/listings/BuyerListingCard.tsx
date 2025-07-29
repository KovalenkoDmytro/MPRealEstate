import { RealEstateListing } from "@/types";
import {Box, Button, Card, CardContent, CardMedia, Link, Typography } from "@mui/material";
import React from "react";

type ListingCardProps = {
    listing: RealEstateListing;
    isFavorite: (listingId: number) => boolean;
    toggleFavorite: (
        e: React.FormEvent,
        listingId: number,
        isCurrentlyFavorite: boolean
    ) => void;
};



export default  function BuyerListingCard ({listing, isFavorite, toggleFavorite,} : ListingCardProps){
    const favorite = isFavorite(listing.id);

    return (
        <Card elevation={3} sx={{borderRadius: 2}}>
            {/* RealEstateListing Image */}
            {listing.main_image ? (
                <CardMedia
                    component="img"
                    height="180"
                    image={listing.main_image.image_path}
                    alt={listing.title}
                />
            ) : (
                <Box
                    sx={{
                        height: 180,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'grey.300',
                    }}
                >
                    ❌ No Image Available
                </Box>
            )}

            {/* RealEstateListing Info */}
            <CardContent>
                {/* Title */}
                <Typography variant="h6" component="h2" fontWeight="bold" noWrap>
                    {listing.title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    📍 {listing.location}
                </Typography>
                <Typography color="primary" fontWeight="bold" sx={{mt: 1}}>
                    💰 ${listing.price.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                    👤 Seller: {listing.seller?.name || 'N/A'}
                </Typography>

                {/* Additional Details */}
                <Box sx={{mt: 2}}>
                    <Typography variant="body2" color="text.secondary">
                        🛏️ Bedrooms: {listing.bedrooms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        🛁 Bathrooms: {listing.bathrooms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        📐 Size: {listing.square_feet.toLocaleString()} sqft
                    </Typography>
                    {listing.lot_size && (
                        <Typography variant="body2" color="text.secondary">
                            🏡 Lot Size: {listing.lot_size.toLocaleString()} sqft
                        </Typography>
                    )}
                    {listing.year_built && (
                        <Typography variant="body2" color="text.secondary">
                            🏗️ Year Built: {listing.year_built}
                        </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                        🏷️ Status: {listing.status}
                    </Typography>
                    {listing.hoa_fees && (
                        <Typography variant="body2" color="text.secondary">
                            💸 HOA Fees: ${listing.hoa_fees.toLocaleString()}
                        </Typography>
                    )}
                    {listing.property_taxes && (
                        <Typography variant="body2" color="text.secondary">
                            📊 Property Taxes: ${listing.property_taxes.toLocaleString()}
                        </Typography>
                    )}
                </Box>

                {/* Favorite & View Details */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                    }}
                >
                    <form
                        onSubmit={(e) => toggleFavorite(e, listing.id, favorite)}
                    >
                        <Button
                            type="submit"
                            variant="text"
                            sx={{fontSize: 24, color: favorite ? 'red' : 'grey.500'}}
                        >
                            {favorite ? '💔' : '❤️'}
                        </Button>
                    </form>
                    <Link
                        href={`/buyer/listings/${listing.id}`}
                        style={{textDecoration: 'none'}}
                    >
                        <Button variant="contained" size="small" color="primary">
                            🔍 View Details
                        </Button>
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};
