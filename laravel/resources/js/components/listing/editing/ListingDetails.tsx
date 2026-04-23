import {
    Grid,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    MenuItem
} from "@mui/material";
import YearBuiltField from "@/components/listing/form/YearBuiltField";
import sanitizeField from "@/helpers/validationFieldsHelper";
import PropertyTypeSelect from "@/components/listing/form/PropertyTypeSelect";
import KeywordsInput from "@/components/listing/form/KeywordsInput";
import { ListingFormFieldValue, ListingFormValues, ValidationErrors } from "@/types";
import AddressAutocomplete, { type MapboxAddressData } from "@/components/listing/form/AddressAutocomplete";
import IconHome from "@/icons/IconHome";
import IconContainer from "@/components/common/IconContainer";
import theme from "@/theme";
import ListingAddressMapPicker from "@/components/maps/ListingAddressMapPicker";

interface ListingDetailsFormProps {
    data: ListingFormValues;
    errors: ValidationErrors;
    handleChange: (name: string, value: ListingFormFieldValue) => void;
}

export default function ListingDetails({ data, handleChange, errors }: ListingDetailsFormProps) {

    const processChange = (name: string, value: ListingFormFieldValue) => {
        let localValue = value;

        if (typeof localValue === "string") {
            localValue = sanitizeField(localValue);
        }

        handleChange(name, localValue);
    };

    const getFullAddress = (listing: ListingFormValues) => {
        const parts = [
            listing.street_number && listing.street_name ? `${listing.street_number} ${listing.street_name}` : null,
            listing.city,
            listing.province,
            listing.postal_code,
            listing.country
        ].filter(Boolean);

        return parts.join(", ");
    };

    const applySelectedAddress = (place: MapboxAddressData) => {
        handleChange("street_number", place.streetNumber ?? data.street_number ?? "");
        handleChange("street_name", place.streetName ?? data.street_name ?? "");
        handleChange("city", place.city ?? data.city ?? "");
        handleChange("province", place.province ?? data.province ?? "");
        handleChange("postal_code", place.postalCode ?? data.postal_code ?? "");
        handleChange("country", place.country ?? data.country ?? "");
        handleChange("latitude", place.latitude);
        handleChange("longitude", place.longitude);
    };

    return (
        <Box sx={{
            p: theme.shape.padding,
            backgroundColor: theme.palette.background.white,
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.border.main}`,
        }}>

            <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <IconContainer>
                    <IconHome/>
                </IconContainer>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Property & Financial Details
                </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
                Accepted characters: A-Z, a-z, 0-9 (spaces are also allowed).
            </Typography>

            <Grid container spacing={4} sx={{ width: "100%" }}>
                {/* Title */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="title"
                        label="Title"
                        value={data.title ?? ""}
                        onChange={(e) => processChange("title", e.target.value)}
                        fullWidth
                        error={!!errors?.title}
                        helperText={errors?.title?.[0]}
                    />
                </Grid>

                {/* Address Autocomplete */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Address
                    </Typography>

                    <AddressAutocomplete
                        value={getFullAddress(data)}
                        onSelect={applySelectedAddress}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <ListingAddressMapPicker
                        latitude={data.latitude}
                        longitude={data.longitude}
                        fullAddress={getFullAddress(data)}
                        onSelect={applySelectedAddress}
                    />
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12 }}>
                    <TextField
                        name="description"
                        label="Description"
                        value={data.description}
                        onChange={(e) => processChange("description", e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors?.description}
                        helperText={errors?.description?.[0]}
                    />
                </Grid>

                {/* Property Type */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <PropertyTypeSelect
                        value={data.property_type}
                        error={!!errors?.property_type}
                        helperText={errors?.property_type?.[0]}
                        onChange={(value) => processChange("property_type", value)}
                    />
                </Grid>

                {/* Year Built */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <YearBuiltField
                        value={data.year_built ?? ""}
                        error={!!errors?.year_built}
                        helperText={errors?.year_built?.[0]}
                        onChange={(value) => processChange("year_built", value)}
                    />
                </Grid>

                {/* Bedrooms */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        name="bedrooms"
                        label="Bedrooms"
                        value={data.bedrooms ?? ""}
                        fullWidth
                        error={!!errors?.bedrooms}
                        helperText={errors?.bedrooms?.[0]}
                        onChange={(e) => processChange("bedrooms", e.target.value)}
                    >
                        {[1, 2, 3, 4, 5].map((n) => (
                            <MenuItem key={n} value={n}>{n}</MenuItem>
                        ))}
                        <MenuItem value="5+">5+</MenuItem>
                    </TextField>
                </Grid>

                {/* Bathrooms */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        name="bathrooms"
                        label="Bathrooms"
                        value={data.bathrooms ?? ""}
                        fullWidth
                        error={!!errors?.bathrooms}
                        helperText={errors?.bathrooms?.[0]}
                        onChange={(e) => processChange("bathrooms", e.target.value)}
                    >
                        {[1, 2, 3, 4, 5].map((n) => (
                            <MenuItem key={n} value={n}>{n}</MenuItem>
                        ))}
                        <MenuItem value="5+">5+</MenuItem>
                    </TextField>
                </Grid>

                {/* Square Feet */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="square_feet"
                        label="Square Feet"
                        type="number"
                        value={data.square_feet ?? ""}
                        fullWidth
                        error={!!errors?.square_feet}
                        helperText={errors?.square_feet?.[0]}
                        onChange={(e) => processChange("square_feet", e.target.value)}
                    />
                </Grid>

                {/* Lot Size */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="lot_size"
                        label="Lot Size"
                        type="number"
                        value={data.lot_size ?? ""}
                        fullWidth
                        onChange={(e) => processChange("lot_size", e.target.value)}
                    />
                </Grid>

                {/* Price */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        value={data.price ?? ""}
                        fullWidth
                        error={!!errors?.price}
                        helperText={errors?.price?.[0]}
                        onChange={(e) => processChange("price", e.target.value)}
                    />
                </Grid>

                {/* HOA Fees */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="hoa_fees"
                        label="HOA Fees"
                        type="number"
                        value={data.hoa_fees ?? ""}
                        fullWidth
                        onChange={(e) => processChange("hoa_fees", e.target.value)}
                    />
                </Grid>

                {/* Property Taxes */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="property_taxes"
                        label="Property Taxes"
                        type="number"
                        value={data.property_taxes ?? ""}
                        fullWidth
                        error={!!errors?.property_taxes}
                        helperText={errors?.property_taxes?.[0]}
                        onChange={(e) => processChange("property_taxes", e.target.value)}
                    />
                </Grid>

                {/* Keywords */}
                <Grid size={{ xs: 12 }}>
                    <KeywordsInput
                        value={data.keywords || []}
                        onChange={(keywords) => processChange("keywords", keywords)}
                    />
                </Grid>
            </Grid>

            {/*  FEATURES SECTION */}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }} gutterBottom>
                Features
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.has_garage}
                                onChange={(e) => processChange("has_garage", e.target.checked)}
                            />
                        }
                        label="Has Garage"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="garage_spaces"
                        label="Garage Spaces"
                        type="number"
                        value={data.garage_spaces ?? ""}
                        fullWidth
                        onChange={(e) => processChange("garage_spaces", e.target.value)}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.has_basement}
                                onChange={(e) => processChange("has_basement", e.target.checked)}
                            />
                        }
                        label="Has Basement"
                    />
                </Grid>
            </Grid>

        </Box>
    );
}
