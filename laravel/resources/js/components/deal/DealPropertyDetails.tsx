import { RealEstateListing } from "@/types";
import { Box, Typography, Stack, Paper } from "@mui/material";
import theme from "@/theme";
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import IconHome from "@/icons/IconHome";
import IconContainer from "@/components/common/IconContainer";

export default function DealPropertyDetails({ listing }: { listing: RealEstateListing }) {

    return (
        <Paper
            elevation={0}
            sx={{
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
            }}
        >
            {/* Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" mb={4}>
                <IconContainer>
                    <IconHome/>
                </IconContainer>
                <Typography variant="h5" fontWeight="bold" >
                    Property Details
                </Typography>
            </Stack>

            {/* Property Gallery */}
            <Box mb={3}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: `${theme.palette.primary.main}`, mb: 1.5 }}>
                    Property Gallery
                </Typography>

                <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>

                    {listing.main_image && (
                        <Box
                            component="img"
                            src={listing.main_image.image_path}
                            alt="Main property"
                            sx={{
                                width: 120,
                                height: 120,
                                objectFit: "cover",
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.border.main}`,
                            }}
                        />
                    )}


                    {listing.images?.map((img, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={img.image_path}
                            alt={`Property ${index + 1}`}
                            sx={{
                                width: 120,
                                height: 120,
                                objectFit: "cover",
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.border.main}`,
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            {/* Title */}
            <Box mb={3}>
                <Typography variant="body2" fontWeight="bold">
                    Title:
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: `${theme.palette.primary.main}` }}>
                    {listing.title}
                </Typography>
            </Box>

            {/* Description */}
            <Box mb={4}>
                <Typography variant="body2" fontWeight="bold" sx={{mb: 0.5 }}>
                    Description:
                </Typography>
                <Typography variant="body2" sx={{ color: `${theme.palette.primary.main}`, lineHeight: 1.6 }}>
                    {listing.description}
                </Typography>
            </Box>

            {/* Stats Row */}
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }}
                gap={3}
            >
                {/* Location */}
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconLocationMark/>
                    <Box>
                        <Typography variant="caption" sx={{  display: "block", mb: 0.2 }}>
                            Location:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: `${theme.palette.primary.main}` }}>
                            {listing.city}, {listing.province} {listing.postal_code}
                        </Typography>
                    </Box>
                </Stack>

                {/* Bedrooms */}
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconBed/>
                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Bedrooms:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: `${theme.palette.primary.main}` }}>
                            {listing.bedrooms}
                        </Typography>
                    </Box>
                </Stack>

                {/* Bathrooms */}
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconBath/>
                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Bathrooms:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: `${theme.palette.primary.main}` }}>
                            {listing.bathrooms}
                        </Typography>
                    </Box>
                </Stack>

                {/* Square Feet */}
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconSqft/>
                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Square Feet:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: `${theme.palette.primary.main}` }}>
                            {listing.square_feet}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}
