import { RealEstateListing } from "@/types";
import { Box, Button, Card, CardContent, CardMedia, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { listingService } from "@/services/listingService";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// Make sure you have this context available, or replace with your alert logic
import { useNotification } from "@/context/NotificationContext";

type ListingCardProps = {
    listing: RealEstateListing;
    isFavorite: (listingId: number) => boolean;
};

export function BuyerListingCard({ listing, isFavorite }: ListingCardProps) {

    const [isFav, setIsFav] = useState(isFavorite(listing.id));
    const [loadingFavorite, setLoadingFavorite] = useState(false);

    // 1. Get notification hook
    const { showNotification } = useNotification();

    const toggleFavorite = async (e: React.FormEvent) => {
        e.preventDefault();

        // 2. Snapshot the current state (in case we need to revert)
        const previousState = isFav;

        // 3. OPTIMISTIC UPDATE: Switch immediately
        setIsFav(!previousState);
        setLoadingFavorite(true);

        try {
            // Pass the ID and the PREVIOUS state (so the backend knows what to toggle)
            const response = await listingService.toggleFavorite(listing.id, previousState);

            // Optional: Ensure state matches server response exactly
            // (Usually unnecessary if optimistic update worked, but good for data integrity)
            if (response.data && typeof response.data.favorite === 'boolean') {
                setIsFav(response.data.favorite);
            } else if (typeof response.favorite === 'boolean') {
                setIsFav(response.favorite);
            }

        } catch (error) {
            console.error("Failed to toggle favorite", error);

            // 4. ROLLBACK: Revert to previous state on error
            setIsFav(previousState);

            // 5. Show Error Notification
            showNotification("Failed to update favorite. Please try again.", "error");
        } finally {
            setLoadingFavorite(false);
        }
    };

    return (
        <Card elevation={3} sx={{ borderRadius: 2 }}>
            {/* Image Section */}
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

            <CardContent>
                <Typography variant="h6" fontWeight="bold" noWrap>
                    {listing.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                    📍 {listing.location}
                </Typography>

                <Typography color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                    💰 ${listing.price.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    👤 Seller: {listing.seller?.name || 'N/A'}
                </Typography>

                {/* Additional Details */}
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        🛏️ Bedrooms: {listing.bedrooms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        🛁 Bathrooms: {listing.bathrooms}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        📐 Size: {listing.square_feet.toLocaleString()} sqft
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>

                    <form onSubmit={toggleFavorite}>
                        <Button
                            type="submit"
                            variant="text"
                            disabled={loadingFavorite}
                            sx={{ fontSize: 24, color: isFav ? "red" : "grey.500", minWidth: 0 }}
                        >
                            {isFav ? (
                                <FavoriteIcon color="error" />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </Button>
                    </form>

                    <Link
                        href={route("buyer.listings.show", listing.id)}
                        style={{ textDecoration: "none" }}>
                        <Button variant="contained" size="small" color="primary">
                            🔍 View Details
                        </Button>
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
}
