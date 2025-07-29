import React from "react";
import { Link } from "@inertiajs/react";
import { RealEstateListing } from "@/types";
import { Box, Typography, Divider, Stack, Button } from "@mui/material";

export const ListingDetails = ({ listing }: { listing: RealEstateListing }) => (
    <Box mt={4}>
        {/* Title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
            {listing.title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Property Info */}
        <Stack spacing={1}>
            <Typography variant="body1">
                <strong>Price:</strong> ${listing.price.toLocaleString()}
            </Typography>
            <Typography variant="body1">
                <strong>Location:</strong> {listing.location}
            </Typography>
            <Typography variant="body1">
                <strong>Type:</strong> {listing.property_type}
            </Typography>
            <Typography variant="body1">
                <strong>Status:</strong> {listing.status}
            </Typography>
            <Typography variant="body1">
                <strong>Bedrooms:</strong> {listing.bedrooms}
            </Typography>
            <Typography variant="body1">
                <strong>Bathrooms:</strong> {listing.bathrooms}
            </Typography>
            <Typography variant="body1">
                <strong>Square Feet:</strong> {listing.square_feet.toLocaleString()}
            </Typography>
            <Typography variant="body1">
                <strong>Lot Size:</strong>{" "}
                {listing.lot_size ? `${listing.lot_size.toLocaleString()} sqft` : "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Year Built:</strong> {listing.year_built ?? "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Garage:</strong>{" "}
                {listing.has_garage
                    ? `${listing.garage_spaces || 0} space(s)`
                    : "No"}
            </Typography>
            <Typography variant="body1">
                <strong>Basement:</strong> {listing.has_basement ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1">
                <strong>HOA Fees:</strong>{" "}
                {listing.hoa_fees ? `$${listing.hoa_fees.toLocaleString()}` : "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Property Taxes:</strong> ${listing.property_taxes.toLocaleString()}
            </Typography>
            <Typography variant="body1">
                <strong>Price Reduced:</strong> {listing.price_reduced ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1">
                <strong>Keywords:</strong> {listing.keywords || "None"}
            </Typography>
        </Stack>

        {/* Back Button */}
        <Box mt={3}>
            <Link href={route("buyer.listings.index")}>
                <Button variant="outlined" color="primary">
                    Back to Listings
                </Button>
            </Link>
        </Box>
    </Box>
);
