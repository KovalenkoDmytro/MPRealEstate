import { Link } from "@inertiajs/react";
import { RealEstateListing, Offer } from "@/types";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Stack,
    Tooltip,
} from "@mui/material";
import {ImageGallery} from "@/components/listing/ImageGallery";
import {ListingDetails} from "@/components/listing/ListingDetails";
import {FavoriteBorder, PersonOutline, Visibility } from "@mui/icons-material";

interface PageProps {
    listing: RealEstateListing & {
        offers: Offer[];
        favorite_by_buyer_count: number;
    };
}

export default function ListingShowPage({ listing }: PageProps) {

    return (
        <AuthenticatedLayout
            header={<Typography variant="h5" fontWeight="bold">Listing</Typography>}
            title="Listings"
        >

            <Box p={3}>

                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {listing.title}
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 1, mb: 3, color: 'text.secondary' }}
                    divider={<Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: 'center' }} />}
                >

                    <Tooltip title="Total times this listing was viewed">
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Visibility fontSize="small" sx={{ color: '#6B7280' }} />
                            <Typography variant="body2">
                                <strong>{listing.views_count ?? 0}</strong> Views
                            </Typography>
                        </Box>
                    </Tooltip>


                    <Tooltip title="Distinct users who viewed this listing">
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <PersonOutline fontSize="small" sx={{ color: '#6B7280' }} />
                            <Typography variant="body2">
                                <strong>{listing.unique_viewers_count ?? 0}</strong> Unique
                            </Typography>
                        </Box>
                    </Tooltip>


                    <Tooltip title="Number of buyers who saved this listing">
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <FavoriteBorder fontSize="small" sx={{ color: '#EC4899' }} /> {/* Pink/Red Icon */}
                            <Typography variant="body2" sx={{ color: '#BE185D', fontWeight: 500 }}>
                                <strong>{listing.favorite_by_buyer_count ?? 0}</strong> Saves
                            </Typography>
                        </Box>
                    </Tooltip>
                </Stack>

                <ImageGallery mainImage={listing.main_image} images={listing.images} />


                <ListingDetails listing={listing} role={'seller'}/>


                <Divider sx={{ my: 3 }} />


                <Stack direction="row" spacing={2} mb={2}>
                    {listing.offers?.length === 0 && (
                        <Link href={route("listings.edit", listing.id)}>
                            <Button variant="outlined">✏️ Edit Listing</Button>
                        </Link>
                    )}
                </Stack>


                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            📑 Offers Received
                        </Typography>

                        {/*<ReceivedOffers offers={offers} onUpdateStatus={handleUpdateStatus} />*/}
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
}
