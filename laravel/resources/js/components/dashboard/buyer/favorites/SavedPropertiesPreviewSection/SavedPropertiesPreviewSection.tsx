import { Grid, Typography, Paper } from '@mui/material';
import { FavoriteListings } from "@/types/favoriteListings";
import SavedPropertyMiniCard
    from "@/components/dashboard/buyer/favorites/SavedPropertiesPreviewSection/SavedPropertyMiniCard";
import Button from "@/components/common/Button";
import theme from "@/theme";


export default function SavedPropertiesPreviewSection({ favoriteListing, itemsToDisplay}: { favoriteListing: FavoriteListings, itemsToDisplay : number }) {

    return (
        <Paper className="saved-properties-preview-section"
               elevation={0}
               sx={{
                   p: theme.shape.padding,
                   borderRadius: theme.shape.borderRadius,
                   bgcolor: theme.palette.background.white,
                   border: `1px solid ${theme.palette.border.main}`,
               }}
        >
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                Saved Properties
            </Typography>


            <Grid
                className="saved-properties-preview-section-wrapper"
                container
                spacing={2}
            >

                {favoriteListing.data.slice(0, itemsToDisplay).map((listing) => (
                    <SavedPropertyMiniCard  key={listing.id} listing={listing} />
                ))}


                {favoriteListing.total > 3 && (
                    <Button
                        className="footer-button"
                        version='secondary'
                        text={`View all ${favoriteListing.total} favorites`}
                        link={true}
                        href={route('buyer.listings.favorites.index')}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M22.1666 16.3333C23.905 14.63 25.6666 12.5883 25.6666 9.91667C25.6666 8.21486 24.9906 6.58276 23.7873 5.3794C22.5839 4.17604 20.9518 3.5 19.25 3.5C17.1966 3.5 15.75 4.08333 14 5.83333C12.25 4.08333 10.8033 3.5 8.74998 3.5C7.04817 3.5 5.41607 4.17604 4.21271 5.3794C3.00935 6.58276 2.33331 8.21486 2.33331 9.91667C2.33331 12.6 4.08331 14.6417 5.83331 16.3333L14 24.5L22.1666 16.3333Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>}
                    />
                )}
            </Grid>
        </Paper>
    );
}
