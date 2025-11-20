import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Grid, Card, CardMedia, Box, CardContent, Typography, Button } from "@mui/material";
import { PageProps, type RealEstateListing } from '@/types';
import React, { useState } from "react";
import { listingService } from "@/services/listingService";

// ----------------------------------------------------------------------
// 1. Local "Analog" Card Component
// ----------------------------------------------------------------------
// This looks like BuyerListingCard but is customized for this page to
// handle the "Remove" action properly.
type SimpleCardProps = {
    listing: RealEstateListing;
    onRemove: (id: number) => void;
};

const SimpleFavoriteCard = ({ listing, onRemove }: SimpleCardProps) => {

    const handleRemoveClick = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Optimistic UI: Tell parent to remove it immediately
        onRemove(listing.id);

        try {
            // 2. Send request to server (isFavorite is true, so this will DELETE)
            await listingService.toggleFavorite(listing.id, true);
        } catch (error) {
            console.error("Failed to remove favorite", error);
            // Ideally, show an error notification here.
            // Since the item is already gone from the UI, handling rollback is tricky
            // without a global store, but for 99% of cases, this is fine.
        }
    };

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
                <Box sx={{ height: 180, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey.300' }}>
                    ❌ No Image
                </Box>
            )}

            {/* Content */}
            <CardContent>
                <Typography variant="h6" fontWeight="bold" noWrap>{listing.title}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>📍 {listing.location}</Typography>
                <Typography color="primary" fontWeight="bold" sx={{ mt: 1 }}>${listing.price.toLocaleString()}</Typography>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <form onSubmit={handleRemoveClick}>
                        <Button
                            type="submit"
                            variant="text"
                            sx={{ fontSize: 24, color: 'red', '&:hover': { transform: 'scale(1.1)' } }}
                            title="Remove from favorites"
                        >
                            ❤️
                        </Button>
                    </form>

                    <Link href={route('buyer.listings.show', listing.id)}>
                        <Button variant="contained" size="small" color="primary">
                            View Details
                        </Button>
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};


// ----------------------------------------------------------------------
// 2. Main Page Component
// ----------------------------------------------------------------------

interface Props extends PageProps {
    favoriteListings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
}

export default function ListingFavoritesPage({ favoriteListings }: Props) {

    // Initialize local state so we can remove items without refreshing
    const [localListings, setLocalListings] = useState<RealEstateListing[]>(favoriteListings.data);

    // Handler to remove item from state
    const handleRemoveItem = (id: number) => {
        setLocalListings((current) => current.filter(item => item.id !== id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Favorites</h2>}
        >
            <Head title="My Favorites" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Empty State */}
                    {localListings.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center text-gray-500">
                            <p className="text-lg mb-4">You haven't added any favorites yet.</p>
                            <Link
                                href={route('buyer.listings.index')}
                                className="text-indigo-600 hover:underline"
                            >
                                Browse Listings
                            </Link>
                        </div>
                    ) : (
                        /* Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {localListings.map((listing) => (
                                <Grid size={{xs:12, sm:6, md:3}} key={listing.id}>
                                    {/* Use our Local Simple Card */}
                                    <SimpleFavoriteCard
                                        listing={listing}
                                        onRemove={handleRemoveItem}
                                    />
                                </Grid>
                            ))}
                        </div>
                    )}

                    {/* Pagination (Based on server props) */}
                    {favoriteListings.data.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            {favoriteListings.links.map((link, key) => (
                                <Link
                                    key={key}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 border rounded mx-1 ${
                                        link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
