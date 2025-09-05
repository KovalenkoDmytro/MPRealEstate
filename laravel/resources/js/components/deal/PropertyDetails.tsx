import { RealEstateListing } from "@/types";
import {
    Box,
    Typography,
    ImageList, ImageListItem,
    Divider,
} from "@mui/material";

export default function PropertyDetails({ listing }: { listing: RealEstateListing }) {
    return (
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            {/* Section Title */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏡 Property Details
            </Typography>

            {listing.images?.length > 0 && (
                <ImageList sx={{ width: '100%', maxWidth: 500, height: 'auto' }} cols={3} rowHeight={164} gap={8}>
                    {listing.images.map((img) => (
                        <ImageListItem key={img.id}>
                            <img
                                src={`${img.image_path}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${img.image_path}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                alt="Property Gallery"
                                loading="lazy"
                                style={{ borderRadius: 8 }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            )}
            {listing.images?.length > 0 && <Divider sx={{ my: 2 }} />}

            {/* Property Info */}
            <Typography><strong>Title:</strong> {listing.title}</Typography>
            <Typography><strong>Description:</strong> {listing.description}</Typography>
            <Typography><strong>Location:</strong> {listing.location}</Typography>
            <Typography><strong>Price:</strong> ${listing.price.toLocaleString()}</Typography>
            <Typography><strong>Bedrooms:</strong> {listing.bedrooms}</Typography>
            <Typography><strong>Bathrooms:</strong> {listing.bathrooms}</Typography>
            <Typography><strong>Square Feet:</strong> {listing.square_feet}</Typography>



        </Box>
    );
}
