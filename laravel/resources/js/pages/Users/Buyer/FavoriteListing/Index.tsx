import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import { PageProps, PaginatedResponse, type RealEstateListing } from '@/types';
import React, { useState } from "react";
import ListingCard from "@/components/listing_new/ListingCard";
import Button from "@/components/common/Button";
import theme from "@/theme";
import { Box, Typography } from "@mui/material";
import IconContainer from "@/components/common/IconContainer";
import IconFavorite from "@/icons/IconFavorite";
import AppPagination from "@/components/common/AppPagination";

// ----------------------------------------------------------------------
//  Main Page Component
// ----------------------------------------------------------------------

interface Props extends PageProps {
    favoriteListings: PaginatedResponse<RealEstateListing>;
}

export default function ListingFavoritesPage({ favoriteListings }: Props) {
    const [localListings, setLocalListings] = useState<RealEstateListing[]>(favoriteListings.data);

    const handleRemoveItem = (id: number) => {
        setLocalListings((current) => current.filter(item => item.id !== id));
    };

    return (
        <AuthenticatedLayout
            header="My Favorites"
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Empty State */}
                    {localListings.length === 0 ? (
                        <Box
                            sx={{
                                mb: 3,
                                p: { xs: 3, md: 4 },
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.border.main}`,
                                background: `${theme.palette.background.white}`,
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { xs: 'flex-start', md: 'center' },
                                justifyContent: 'space-between',
                                gap: 3,
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, position: 'relative', zIndex: 1 }}>
                                <IconContainer bgColor={`${theme.palette.primary.main}12`}>
                                    <IconFavorite color={`${theme.palette.primary.main}`}/>
                                </IconContainer>

                                <Box>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            letterSpacing: '0.14em',
                                            color: theme.palette.primary.main,
                                            fontWeight: 700,
                                            display: 'block',
                                            mb: 0.75,
                                        }}
                                    >
                                        Saved Homes
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: 700,
                                            mb: 1,
                                        }}
                                    >
                                        You haven&apos;t added any favorites yet.
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            maxWidth: 520,
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        Start exploring properties and save the homes you want to revisit, compare, and follow more closely.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Button text={"Browse Listings"} version="primary" link={true} href={route('listings.index')} />
                            </Box>
                        </Box>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {localListings.map((listing) => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    isFavorite={true}
                                    isDisplayStatus={true}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>

                    )}

                    {favoriteListings.last_page > 1 && <AppPagination pagination={favoriteListings} />}


                </div>
            </div>
        </AuthenticatedLayout>
    );
}
