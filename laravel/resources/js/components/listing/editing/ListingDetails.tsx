import {
    Grid,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    MenuItem,
    Stack,
    InputAdornment
} from "@mui/material";
import YearBuiltField from "@/components/listing/form/YearBuiltField";
import sanitizeField from "@/helpers/validationFieldsHelper";
import PropertyTypeSelect from "@/components/listing/form/PropertyTypeSelect";
import KeywordsInput from "@/components/listing/form/KeywordsInput";
import { ListingFormFieldValue, ListingFormValues, ValidationErrors } from "@/types";
import AddressAutocomplete, { type MapboxAddressData } from "@/components/listing/form/AddressAutocomplete";
import SectionCard from "@/design/SectionCard";
import { neutral, primary, radius } from "@/design/tokens";
import type { ReactNode } from "react";
import ListingAddressMapPicker from "@/components/maps/ListingAddressMapPicker";

interface ListingDetailsFormProps {
    data: ListingFormValues;
    errors: ValidationErrors;
    handleChange: (name: string, value: ListingFormFieldValue) => void;
}

function FormSection({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
    return (
        <SectionCard tone="elevated" sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 3 }}>
                <Box sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: radius.md, bgcolor: primary[50], color: 'primary.main', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{number}</Box>
                <Box>
                    <Typography component="h2" variant="h6" fontWeight={700}>{title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{description}</Typography>
                </Box>
            </Stack>
            {children}
        </SectionCard>
    );
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
        <Stack spacing={3} sx={{ width: '100%' }}>
            <FormSection number="01" title="Property overview" description="Introduce your property with a clear title and description.">
                <Grid container spacing={{ xs: 2.5, md: 3 }}>
                {/* Title */}
                <Grid size={{ xs: 12 }}>
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

                {/* Keywords */}
                <Grid size={{ xs: 12 }}>
                    <KeywordsInput
                        value={data.keywords || []}
                        onChange={(keywords) => processChange("keywords", keywords)}
                    />
                </Grid>
                </Grid>
            </FormSection>
            <FormSection number="02" title="Location" description="Search for the address and confirm the property on the map.">
                <Grid container spacing={{ xs: 2.5, md: 3 }}>
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

                </Grid>
            </FormSection>
            <FormSection number="03" title="Details & features" description="Add the key details buyers need to know.">
                <Grid container spacing={{ xs: 2.5, md: 3 }}>
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

                </Grid>
            {/*  FEATURES SECTION */}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }} gutterBottom>
                Features
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        sx={{ m: 0, p: 1, width: '100%', boxSizing: 'border-box', bgcolor: neutral[50], borderRadius: radius.md, border: `1px solid ${neutral[200]}` }}
                        control={
                            <Checkbox
                                checked={data.has_garage}
                                onChange={(e) => processChange("has_garage", e.target.checked)}
                            />
                        }
                        label="Garage"
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
                        sx={{ m: 0, p: 1, width: '100%', boxSizing: 'border-box', bgcolor: neutral[50], borderRadius: radius.md, border: `1px solid ${neutral[200]}` }}
                        control={
                            <Checkbox
                                checked={data.has_basement}
                                onChange={(e) => processChange("has_basement", e.target.checked)}
                            />
                        }
                        label="Basement"
                    />
                </Grid>
            </Grid>

            </FormSection>
            <FormSection number="04" title="Pricing & costs" description="Set your asking price and include property expenses.">
                <Grid container spacing={{ xs: 2.5, md: 3 }}>
                {/* Price */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="price"
                        label="Price"
                        slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
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
                        slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
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
                        slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
                        type="number"
                        value={data.property_taxes ?? ""}
                        fullWidth
                        error={!!errors?.property_taxes}
                        helperText={errors?.property_taxes?.[0]}
                        onChange={(e) => processChange("property_taxes", e.target.value)}
                    />
                </Grid>

                </Grid>
            </FormSection>
        </Stack>
    );
}
