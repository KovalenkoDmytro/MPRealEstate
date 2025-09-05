import React from "react";
import {
    Grid,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
    Box,
} from "@mui/material";
import CitySelector from "@/components/common/CitySelector";
import YearBuiltField from "@/components/listing/form/YearBuiltField";

interface Props {
    data: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function ListingDetails({ data, handleChange }: Props) {
    return (
        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 1 }}>
            {/* Section Title */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏠 Property & Financial Details
            </Typography>

            {/* Property & Financial Fields */}
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="title" label="Title" value={data.title} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CitySelector value={data.location} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        name="description"
                        label="Description"
                        value={data.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel>Property Type</InputLabel>
                        <Select name="property_type" value={data.property_type} onChange={handleChange as any}>
                            <MenuItem value="">Select Type</MenuItem>
                            <MenuItem value="house">House</MenuItem>
                            <MenuItem value="condo">Condo</MenuItem>
                            <MenuItem value="townhouse">Townhouse</MenuItem>
                            <MenuItem value="land">Land</MenuItem>
                            <MenuItem value="multi-family">Multi-family</MenuItem>
                            <MenuItem value="farm">Farm</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <YearBuiltField value={data.year_built} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="bedrooms" label="Bedrooms" type="number" value={data.bedrooms} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="bathrooms" label="Bathrooms" type="number" value={data.bathrooms} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="square_feet" label="Square Feet" type="number" value={data.square_feet} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="lot_size" label="Lot Size" type="number" value={data.lot_size} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="price" label="Price" type="number" value={data.price} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="hoa_fees" label="HOA Fees" type="number" value={data.hoa_fees} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="property_taxes" label="Property Taxes" type="number" value={data.property_taxes} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField name="keywords" label="Keywords" value={data.keywords} onChange={handleChange} fullWidth />
                </Grid>
            </Grid>

            {/* Features Section */}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }} gutterBottom>
                🧱 Features
            </Typography>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        control={<Checkbox name="has_garage" checked={data.has_garage} onChange={handleChange} />}
                        label="Has Garage"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField name="garage_spaces" label="Garage Spaces" type="number" value={data.garage_spaces} onChange={handleChange} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                        control={<Checkbox name="has_basement" checked={data.has_basement} onChange={handleChange} />}
                        label="Has Basement"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
