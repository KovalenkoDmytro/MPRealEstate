import React from "react";
import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "@inertiajs/react";
import {RealEstateListing} from "@/types";

export default function SellerListingCard ({ listing } : { listing: RealEstateListing }) {
    return (
        <Card elevation={3} sx={{ borderRadius: 2 }}>
            {/* Image */}
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
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "grey.300",
                    }}
                >
                    ❌ No Image Available
                </Box>
            )}

            {/* Content */}
            <CardContent>
                {/* Title */}
                <Typography variant="h6" component="h2" fontWeight="bold" noWrap>
                    {listing.title}
                </Typography>

                {/* Location */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    📍 {listing.location}
                </Typography>

                {/* Price */}
                <Typography color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                    💰 ${listing.price.toLocaleString()}
                </Typography>

                {/* Property Details */}
                <Box sx={{ mt: 2 }}>
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

                {/* View Details (Edit) Link */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Link href={route("seller.listings.show", listing.id)} style={{ textDecoration: "none" }}>
                        <Button variant="contained" size="small" color="primary">
                            🔍 View Details
                        </Button>
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};
