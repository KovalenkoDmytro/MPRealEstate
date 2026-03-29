import React from 'react';
import {
    Box,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CitySelector from "@/components/common/CitySelector";
import PropertyTypeSelect from "@/components/listing/form/PropertyTypeSelect";
import YearBuiltField from "@/components/listing/form/YearBuiltField";
import {formatCurrency, formatNumber} from "@/helpers/priceHelper";

const selectMenuProps = {
    PaperProps: {
        sx: {
            maxHeight: 450,
        },
    },
};

// Define SqFt options for the dropdowns
const SQFT_OPTIONS = [
    500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500,
    3000, 3500, 4000, 5000, 7500, 10000
];

// Options for Property Tax (Yearly)
const PROPERTY_TAX_OPTIONS = [
    250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000,
    3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000,
    12000, 15000, 20000, 25000
];

// Options for Maintenance Fees (Monthly)
const MAINTENANCE_FEE_OPTIONS = [
    200, 300, 400, 500, 600, 700, 800, 900, 1000,
    1200, 1400, 1600, 1800, 2000
];

type FilterFormProps = {
    form:  {
        location: string;
        min_price?: number;
        max_price?: number;
        bedrooms?: number;
        bathrooms?: number;
        property_type?: string;
        square_feet_min?: number;
        square_feet_max?: number;
        year_built_min?: number;
        year_built_max?: number;
        days_on_market?: string;
        min_property_tax?: number;
        max_property_tax?: number;
        min_maintenance_fee?: number;
        max_maintenance_fee?: number;
        has_garage?: boolean;
        has_basement?: boolean;
        keywords?: string;
    };
    updateFilter: (key: string, value: string | number | boolean) => void;
    onApplyFilters: (e: React.FormEvent) => void;
    isSubmitting?: boolean;
};

export const FilterForm: React.FC<FilterFormProps> = ({
    form,
    updateFilter,
    onApplyFilters,
    isSubmitting = false,
}) => {


    return (
        <Box component="form" onSubmit={onApplyFilters}>
            <Grid container spacing={2}>

                {/* Location & Property Type */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <CitySelector
                        value={form.location}
                        onChange={(value) => updateFilter('location', value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <PropertyTypeSelect
                        value={form.property_type}
                        onChange={(value) => updateFilter("property_type", value)}
                    />
                </Grid>

                {/* --- GROUP 1: PRICE (Reverted to Text Fields) --- */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Min Price"
                            type="number"
                            value={form.min_price}
                            onChange={(e) => updateFilter('min_price', e.target.value)}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Max Price"
                            type="number"
                            value={form.max_price}
                            onChange={(e) => updateFilter('max_price', e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                </Grid>

                {/* --- GROUP 2: SIZE (SqFt) (Updated to Selectors) --- */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Min SqFt</InputLabel>
                            <Select
                                value={form.square_feet_min || ''}
                                onChange={(e) => updateFilter('square_feet_min', e.target.value)}
                                label="Min SqFt"
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value="">No Min</MenuItem>
                                {SQFT_OPTIONS.map((sqft) => (
                                    <MenuItem key={`min-${sqft}`} value={sqft}>
                                        {formatNumber(sqft)} sqft
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Max SqFt</InputLabel>
                            <Select
                                value={form.square_feet_max || ''}
                                onChange={(e) => updateFilter('square_feet_max', e.target.value)}
                                label="Max SqFt"
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value="">No Max</MenuItem>
                                {SQFT_OPTIONS.map((sqft) => (
                                    <MenuItem key={`max-${sqft}`} value={sqft}>
                                        {formatNumber(sqft)} sqft
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Beds & Baths (Selectors) */}
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Min Beds</InputLabel>
                        <Select
                            value={form.bedrooms || ''}
                            onChange={(e) => updateFilter('bedrooms', e.target.value)}
                            label="Min Beds"
                            MenuProps={selectMenuProps}
                        >
                            <MenuItem value="">Any</MenuItem>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <MenuItem key={num} value={num}>
                                    {num}+
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Min Baths</InputLabel>
                        <Select
                            value={form.bathrooms || ''}
                            onChange={(e) => updateFilter('bathrooms', e.target.value)}
                            label="Min Baths"
                            MenuProps={selectMenuProps}
                        >
                            <MenuItem value="">Any</MenuItem>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <MenuItem key={num} value={num}>
                                    {num}+
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* --- GROUP 4: YEAR BUILT --- */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <YearBuiltField
                                value={form.year_built_min ?? ''}
                                onChange={(value) => { updateFilter("year_built_min", value) }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <YearBuiltField
                                value={form.year_built_max ?? ''}
                                onChange={(value) => { updateFilter("year_built_max", value)}}
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* --- DAYS ON MARKET --- */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Listed Date</InputLabel>
                        <Select
                            value={form.days_on_market || ''}
                            onChange={(e) => updateFilter('days_on_market', e.target.value)}
                            label="Listed Date"
                            MenuProps={selectMenuProps}
                        >
                            <MenuItem value="">Any Time</MenuItem>
                            <MenuItem value="3">3 days ago</MenuItem>
                            <MenuItem value="7">7 days ago</MenuItem>
                            <MenuItem value="30">30 days ago</MenuItem>
                            <MenuItem value="60+">More than 60 days ago</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* --- GROUP 5: PROPERTY TAX --- */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Min Tax / Year</InputLabel>
                            <Select
                                value={form.min_property_tax || ''}
                                onChange={(e) => updateFilter('min_property_tax', e.target.value)}
                                label="Min Tax / Year"
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value="">No Min</MenuItem>
                                {PROPERTY_TAX_OPTIONS.map((val) => (
                                    <MenuItem key={`min-tax-${val}`} value={val}>
                                        {formatCurrency(val)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Max Tax / Year</InputLabel>
                            <Select
                                value={form.max_property_tax || ''}
                                onChange={(e) => updateFilter('max_property_tax', e.target.value)}
                                label="Max Tax / Year"
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value="">No Max</MenuItem>
                                {PROPERTY_TAX_OPTIONS.map((val) => (
                                    <MenuItem key={`max-tax-${val}`} value={val}>
                                        {formatCurrency(val)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                {/* --- GROUP 6: MAINTENANCE FEES --- */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Min Maint Fee</InputLabel>
                            <Select
                                value={form.min_maintenance_fee || ''}
                                onChange={(e) => updateFilter('min_maintenance_fee', e.target.value)}
                                label="Min Maint Fee"
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value="">No Min</MenuItem>
                                {MAINTENANCE_FEE_OPTIONS.map((val) => (
                                    <MenuItem key={`min-fee-${val}`} value={val}>
                                        {formatCurrency(val)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Max Maint Fee</InputLabel>
                            <Select
                                value={form.max_maintenance_fee || ''}
                                onChange={(e) => updateFilter('max_maintenance_fee', e.target.value)}
                                label="Max Maint Fee"
                                MenuProps={selectMenuProps}
                            >
                                <MenuItem value="">No Max</MenuItem>
                                {MAINTENANCE_FEE_OPTIONS.map((val) => (
                                    <MenuItem key={`max-fee-${val}`} value={val}>
                                        {formatCurrency(val)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Checkboxes */}
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <FormControlLabel
                            control={<Checkbox checked={form.has_garage} onChange={(e) => updateFilter('has_garage', e.target.checked)} />}
                            label="Garage"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={form.has_basement} onChange={(e) => updateFilter('has_basement', e.target.checked)} />}
                            label="Basement"
                        />
                    </Box>
                </Grid>

                {/* Keywords and Submit */}
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Keywords (e.g. pool, view)"
                        value={form.keywords}
                        onChange={(e) => updateFilter('keywords', e.target.value)}
                        variant="outlined"
                        size="small" // Makes this field slightly more compact
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        {isSubmitting ? "Applying Filters..." : "Apply Filters"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
