import React from "react";
import {
    Grid,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    MenuItem
} from "@mui/material";
import CitySelector from "@/components/common/CitySelector";
import YearBuiltField from "@/components/listing/form/YearBuiltField";
import sanitizeField from "@/helpers/validationFieldsHelper";
import PropertyTypeSelect from "@/components/listing/form/PropertyTypeSelect";
import KeywordsInput from "@/components/listing/form/KeywordsInput";
import {ValidationErrors} from "@/types/validationErrors";


interface Props {
    data: any;
    errors: ValidationErrors,
    handleChange: (name: string, value: string[] | string | number | boolean) => void;
}

export default function ListingDetails({ data, handleChange, errors }: Props) {

    const processChange = (name: string, value: string[] | string | number | boolean) => {
        let localValue = value;

        if (typeof localValue === "string") {
            localValue = sanitizeField(localValue);
        }

        handleChange(name, localValue);
    };

    return (
        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 1 }}>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏠 Property & Financial Details
            </Typography>

            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="title"
                        label="Title"
                        value={data.title ?? ""}
                        onChange={(e) => processChange("title", e.target.value)}
                        fullWidth
                        error={errors?.title && true}
                        helperText={errors?.title?.[0]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CitySelector
                        value={data.location}
                        error={errors?.location && true}
                        helperText={errors?.location?.[0]}
                        onChange={(value) => { processChange("location", value); }}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        name="description"
                        label="Description"
                        error={errors?.description && true}
                        helperText={errors?.description?.[0]}
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
                        error={errors?.property_type && true}
                        helperText={errors?.property_type?.[0]}
                        onChange={(value) => processChange("property_type", value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <YearBuiltField
                        value={data.year_built ?? ''}
                        error={errors?.year_built && true}
                        helperText={errors?.year_built?.[0]}
                        onChange={(value) => { processChange("year_built", value); }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        name="bedrooms"
                        label="Bedrooms"
                        type="number"
                        value={data.bedrooms ?? ''}
                        error={errors?.bedrooms && true}
                        helperText={errors?.bedrooms?.[0]}
                        onChange={(e) => processChange("bedrooms", e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="5+">5+</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        name="bathrooms"
                        label="Bathrooms"
                        type="number"
                        value={data.bathrooms ?? ''}
                        error={errors?.bathrooms && true}
                        helperText={errors?.bathrooms?.[0]}
                        onChange={(e) => processChange("bathrooms", e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="5+">5+</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="square_feet"
                        label="Square Feet"
                        type="number"
                        error={errors?.square_feet && true}
                        helperText={errors?.square_feet?.[0]}
                        value={data.square_feet ?? ""}
                        onChange={(e) => processChange("square_feet", e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="lot_size"
                        label="Lot Size"
                        type="number"
                        value={data.lot_size ?? ""}
                        onChange={(e) => processChange("lot_size", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        value={data.price ?? "" }
                        error={errors?.price && true}
                        helperText={errors?.price?.[0]}
                        onChange={(e) => processChange("price", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="hoa_fees"
                        label="HOA Fees"
                        type="number"
                        value={data.hoa_fees ?? ""}
                        onChange={(e) => processChange("hoa_fees", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        name="property_taxes"
                        label="Property Taxes"
                        type="number"
                        error={errors?.property_taxes && true}
                        helperText={errors?.property_taxes?.[0]}
                        value={data.property_taxes ?? ""}
                        onChange={(e) => processChange("property_taxes", e.target.value)}
                        fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <KeywordsInput
                        value={data.keywords || []}
                        onChange={(keywords) => processChange("keywords", keywords)}
                    />
                </Grid>
            </Grid>


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
                        value={data.garage_spaces ?? ""}
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
