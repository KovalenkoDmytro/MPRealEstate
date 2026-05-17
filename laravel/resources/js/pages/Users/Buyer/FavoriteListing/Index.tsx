import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import { PageProps, PaginatedResponse, type RealEstateListing } from '@/types';
import { useState } from "react";
import ListingCard from "@/components/listing_new/ListingCard";
import Button from "@/components/common/Button";
import theme from "@/theme";
import { Box, Grid, Typography } from "@mui/material";
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
        <AuthenticatedLayout header="My Favorites">
            {/* Empty State */}
                    {localListings.length === 0 ? (
                        <Box
                            sx={{
                                mb: 3,
                                p: theme.shape.padding,
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
                                <IconContainer bgColor={`${theme.palette.primary.main}`}>
                                    <IconFavorite />
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
                        <Grid container spacing={3}>
                            {localListings.map((listing) => (
                                <Grid key={listing.id} size={{ xs: 12, md: 6, xl: 4 }}>
                                    <ListingCard
                                        listing={listing}
                                        isFavorite={true}
                                        isDisplayStatus={true}
                                        onRemove={handleRemoveItem}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {favoriteListings.last_page > 1 && <AppPagination pagination={favoriteListings} />}
        </AuthenticatedLayout>
    );
}
