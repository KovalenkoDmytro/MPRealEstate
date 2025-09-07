import React from "react";
import {
    Grid,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
} from "@mui/material";
import CitySelector from "@/components/common/CitySelector";
import YearBuiltField from "@/components/listing/form/YearBuiltField";
import sanitizeField from "@/helpers/validationFieldsHelper";
import PropertyTypeSelect from "@/components/listing/form/PropertyTypeSelect";


interface Props {
    data: any;
    handleChange: (name: string, value: string | number | boolean) => void;
}

export default function ListingDetails({ data, handleChange }: Props) {

    const processChange = (name: string, value: string | number | boolean) => {
        let localValue = value;

        if (typeof localValue === "string") {
            localValue = sanitizeField(localValue);
        }

        handleChange(name, localValue);
    };

    return (
        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 1 }}>
            {/* Section Title */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏠 Property & Financial Details
            </Typography>

            {/* Property & Financial Fields */}
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="title"
                        label="Title"
                        value={data.title ?? ""}
                        onChange={(e) => processChange("title", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CitySelector
                        value={data.location}
                        onChange={(value) => { processChange("location", value); }}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        name="description"
                        label="Description"
                        value={data.description}
                        onChange={(e) => processChange("description", e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <PropertyTypeSelect
                        value={data.property_type}
                        onChange={(value) => processChange("property_type", value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <YearBuiltField
                        value={data.year_built}
                        onChange={(value) => { processChange("year_built", value); }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="bedrooms"
                        label="Bedrooms"
                        type="number"
                        value={data.bedrooms}
                        onChange={(e) => processChange("bedrooms", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="bathrooms"
                        label="Bathrooms"
                        type="number"
                        value={data.bathrooms}
                        onChange={(e) => processChange("bathrooms", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="square_feet"
                        label="Square Feet"
                        type="number"
                        value={data.square_feet}
                        onChange={(e) => processChange("square_feet", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="lot_size"
                        label="Lot Size"
                        type="number"
                        value={data.lot_size}
                        onChange={(e) => processChange("lot_size", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        value={data.price}
                        onChange={(e) => processChange("price", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="hoa_fees"
                        label="HOA Fees"
                        type="number"
                        value={data.hoa_fees}
                        onChange={(e) => processChange("hoa_fees", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="property_taxes"
                        label="Property Taxes"
                        type="number"
                        value={data.property_taxes}
                        onChange={(e) => processChange("property_taxes", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        name="keywords"
                        label="Keywords"
                        value={data.keywords}
                        onChange={(e) => processChange("keywords", e.target.value)}
                        fullWidth />
                </Grid>
            </Grid>

            {/* Features Section */}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }} gutterBottom>
                🧱 Features
            </Typography>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="has_garage"
                                checked={data.has_garage}
                                onChange={(e) => processChange("has_garage", e.target.checked)}
                            />}
                        label="Has Garage"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="garage_spaces"
                        label="Garage Spaces"
                        type="number"
                        value={data.garage_spaces}
                        onChange={(e) => processChange("garage_spaces", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="has_basement"
                                checked={data.has_basement}
                                onChange={(e) => processChange("has_basement", e.target.checked)}
                            />}
                        label="Has Basement"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
