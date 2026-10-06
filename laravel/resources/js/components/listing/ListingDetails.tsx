import { RealEstateListing } from "@/types";
import {
    Box,
    Typography,
    Divider,
    Stack,
    Chip,
} from "@mui/material";
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
import SectionCard from "@/design/SectionCard";
import { neutral, primary, radius } from "@/design/tokens";
import IconKeywords from "@/icons/IconKeywords";

type ListingDetailsProps = {
    listing: RealEstateListing;
    role: 'seller' | 'buyer';
};


const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | React.ReactNode }) => (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', minWidth: 0, p: 1.5, bgcolor: neutral[50], border: `1px solid ${neutral[200]}`, borderRadius: radius.md }}>
        <Box sx={{ color: 'primary.main', display: 'flex', flexShrink: 0 }}>
            {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ overflowWrap: 'anywhere', textTransform: label === 'Type' ? 'capitalize' : 'none' }}>
                {value}
            </Typography>
        </Box>
    </Box>
);

export const ListingDetails = ({ listing }: ListingDetailsProps) => {
    return (
        <SectionCard tone="elevated" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom >
                    About this property
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                    {listing.description}
                </Typography>
            </Box>


            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Property details
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
                    gap: 1.5
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
            <Divider sx={{ my: { xs: 3, md: 4 } }} />
            <Box mb={{ xs: 0, md: 1 }}>
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
                                    bgcolor: primary[50],
                                    color: primary[700],
                                    borderRadius: radius.sm
                                }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">None</Typography>
                    )}
                </Stack>
            </Box>
        </SectionCard>
    );
};
