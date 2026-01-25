import React from "react";
import { RealEstateListing } from "@/types";
import {
    Box,
    Typography,
    Divider,
    Stack,
    Grid,
    Paper,
    Chip,
    useTheme
} from "@mui/material";
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import IconGarage from "@/icons/IconGarage";
import IconDollar from "@/icons/IconDollar";
import { formatCurrency } from "@/helpers/priceHelper";
import IconHome from "@/icons/IconHome";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconBasement from "@/icons/IconBasement";
import IconLotSpace from "@/icons/IconLotSpace";
import IconKeywords from "@/icons/IconKeywords";

type ListingDetailsProps = {
    listing: RealEstateListing;
    role: 'seller' | 'buyer';
};


const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | React.ReactNode }) => (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', alignContent: 'center'}}>
        <Box sx={{ color: 'text.secondary', mt: 0.5 }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body1" fontWeight={600} color="text.primary">
                {value}
            </Typography>
        </Box>
    </Box>
);

export const ListingDetails = ({ listing }: ListingDetailsProps) => {
    const theme = useTheme();

    return (
        <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>


            <Box
                className="listing-gallery"
                sx={{ width: "100%",
                    position: "relative",
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shape.boxShadow,
                    padding: theme.shape.padding,
                }}>

                {/* --- PROPERTY DETAILS HEADER --- */}
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                    Property Details
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: 4
                    }}
                >

                    <DetailItem
                        icon={<IconBed />}
                        label="Bedrooms"
                        value={listing.bedrooms}
                    />

                    <DetailItem
                        icon={<IconBath />}
                        label="Bathrooms"
                        value={listing.bathrooms}
                    />

                    <DetailItem
                        icon={<IconSqft />}
                        label="Sq Ft"
                        value={listing.square_feet.toLocaleString()}
                    />


                    <DetailItem
                        icon={<IconGarage />}
                        label="Garage"
                        value={listing.garage_spaces || 0}
                    />

                    <DetailItem
                        icon={<IconDollar />}
                        label="Price"
                        value={formatCurrency(listing.price)}
                    />
                    <DetailItem
                        icon={<IconHome />}
                        label="Type"
                        value={listing.property_type}
                    />

                    <DetailItem
                        icon={<IconCalendarToday />}
                        label="Year Built"
                        value={listing.year_built}
                    />
                    <DetailItem
                        icon={<IconBasement />}
                        label="Basement"
                        value={listing.has_basement ? "Yes" : "No"}
                    />
                    <DetailItem
                        icon={<IconDollar />}
                        label="Property Taxes"
                        value={formatCurrency(listing.property_taxes)}
                    />
                    <DetailItem
                        icon={<IconLotSpace />}
                        label="Lot Size"
                        value={listing.lot_size ? `${listing.lot_size.toLocaleString()} sqft` : "N/A"}
                    />
                    <DetailItem
                        icon={<IconDollar />}
                        label="HOA Fees"
                        value={listing.hoa_fees ? formatCurrency(listing.hoa_fees) : "N/A"}
                    />

                </Box>
                <Divider sx={{ my: 4 }} />
                <Box mb={4}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <IconKeywords/>
                        <Typography variant="body1" fontWeight="bold">
                            Keywords
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {listing.keywords && listing.keywords.length > 0 ? (
                            listing.keywords.map((keyword, index) => (
                                <Chip
                                    key={index}
                                    label={keyword}
                                    sx={{
                                        bgcolor: "#CB9A9F1A",
                                        color: theme.palette.primary.main,
                                        borderRadius: '10px'
                                    }}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">None</Typography>
                        )}
                    </Stack>
                </Box>
            </Box>

        </Paper>
    );
};
