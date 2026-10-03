import React, { useId } from 'react';
import {
    Box, TextField, Checkbox, FormControlLabel, Button, FormControl,
    InputLabel, Select, MenuItem, CircularProgress, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CitySelector from '@/components/common/CitySelector';
import PropertyTypeSelect from '@/components/listing/form/PropertyTypeSelect';
import { formatCurrency, formatNumber } from '@/helpers/priceHelper';
import { neutral, primary, radius } from '@/design/tokens';

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
    onResetFilters: () => void;
    isSubmitting?: boolean;
    canReset?: boolean;
};

type FilterSelectProps = {
    label: string;
    value?: string | number;
    onChange: (value: string | number) => void;
    options: { value: string | number; label: string }[];
    emptyLabel?: string;
};

function FilterSelect({ label, value, onChange, options, emptyLabel = 'Any' }: FilterSelectProps) {
    const id = useId();
    return (
        <FormControl fullWidth size="small">
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select labelId={`${id}-label`} id={id} label={label} value={value ?? ''} onChange={(e) => onChange(e.target.value)} MenuProps={{ PaperProps: { sx: { maxHeight: 350 } } }}>
                <MenuItem value="">{emptyLabel}</MenuItem>
                {options.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </Select>
        </FormControl>
    );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box sx={{ height: '100%', minWidth: 0, p: { xs: 2, sm: 2.5 }, border: `1px solid ${neutral[200]}`, borderRadius: radius.md, bgcolor: neutral[0] }}>
            <Typography component="h3" variant="subtitle2" sx={{ color: primary[900], fontWeight: 700, mb: 2.5 }}>{title}</Typography>
            <Grid container spacing={2}>{children}</Grid>
        </Box>
    );
}

export const FilterForm: React.FC<FilterFormProps> = ({ form, updateFilter, onApplyFilters, onResetFilters, isSubmitting = false, canReset = false }) => {
    const sqftOptions = SQFT_OPTIONS.map((value) => ({ value, label: `${formatNumber(value)} sqft` }));
    const roomOptions = [1, 2, 3, 4, 5].map((value) => ({ value, label: `${value}+` }));
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1950 + 1 }, (_, index) => ({ value: currentYear - index, label: String(currentYear - index) }));
    const taxOptions = PROPERTY_TAX_OPTIONS.map((value) => ({ value, label: formatCurrency(value) }));
    const feeOptions = MAINTENANCE_FEE_OPTIONS.map((value) => ({ value, label: formatCurrency(value) }));

    return (
        <Box component="form" onSubmit={onApplyFilters} sx={{
            '& .MuiOutlinedInput-root': { bgcolor: neutral[50], borderRadius: radius.sm },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: neutral[200] },
        }}>
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <FilterGroup title="Location & budget">
                        <Grid size={{ xs: 12, sm: 6 }}><CitySelector value={form.location} onChange={(value) => updateFilter('location', value)} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><PropertyTypeSelect value={form.property_type} onChange={(value) => updateFilter('property_type', value)} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth size="small" label="Min price" type="number" value={form.min_price ?? ''} onChange={(e) => updateFilter('min_price', e.target.value)} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth size="small" label="Max price" type="number" value={form.max_price ?? ''} onChange={(e) => updateFilter('max_price', e.target.value)} /></Grid>
                        <Grid size={{ xs: 12 }}>
                            <FilterSelect label="Listed date" value={form.days_on_market} onChange={(value) => updateFilter('days_on_market', value)} emptyLabel="Any time" options={[
                                { value: '3', label: '3 days ago' }, { value: '7', label: '7 days ago' },
                                { value: '30', label: '30 days ago' }, { value: '60+', label: 'More than 60 days ago' },
                            ]} />
                        </Grid>
                    </FilterGroup>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <FilterGroup title="Property details">
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Min square feet" value={form.square_feet_min} onChange={(value) => updateFilter('square_feet_min', value)} options={sqftOptions} emptyLabel="No minimum" /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Max square feet" value={form.square_feet_max} onChange={(value) => updateFilter('square_feet_max', value)} options={sqftOptions} emptyLabel="No maximum" /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Min bedrooms" value={form.bedrooms} onChange={(value) => updateFilter('bedrooms', value)} options={roomOptions} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Min bathrooms" value={form.bathrooms} onChange={(value) => updateFilter('bathrooms', value)} options={roomOptions} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Year built from" value={form.year_built_min} onChange={(value) => updateFilter('year_built_min', value)} options={yearOptions} emptyLabel="No minimum" /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Year built to" value={form.year_built_max} onChange={(value) => updateFilter('year_built_max', value)} options={yearOptions} emptyLabel="No maximum" /></Grid>
                    </FilterGroup>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <FilterGroup title="Costs & fees">
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Min yearly property tax" value={form.min_property_tax} onChange={(value) => updateFilter('min_property_tax', value)} options={taxOptions} emptyLabel="No minimum" /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Max yearly property tax" value={form.max_property_tax} onChange={(value) => updateFilter('max_property_tax', value)} options={taxOptions} emptyLabel="No maximum" /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Min monthly maintenance" value={form.min_maintenance_fee} onChange={(value) => updateFilter('min_maintenance_fee', value)} options={feeOptions} emptyLabel="No minimum" /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><FilterSelect label="Max monthly maintenance" value={form.max_maintenance_fee} onChange={(value) => updateFilter('max_maintenance_fee', value)} options={feeOptions} emptyLabel="No maximum" /></Grid>
                    </FilterGroup>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <FilterGroup title="Features & keywords">
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                {([
                                    { key: 'has_garage', label: 'Garage', checked: form.has_garage },
                                    { key: 'has_basement', label: 'Basement', checked: form.has_basement },
                                ]).map((feature) => (
                                    <FormControlLabel key={feature.key} sx={{ m: 0, pr: 1.5, borderRadius: radius.sm, border: `1px solid ${feature.checked ? primary[200] : neutral[200]}`, bgcolor: feature.checked ? primary[50] : neutral[50], '& .MuiFormControlLabel-label': { fontSize: '0.875rem', fontWeight: 500 } }}
                                        control={<Checkbox size="small" checked={Boolean(feature.checked)} onChange={(e) => updateFilter(feature.key, e.target.checked)} />} label={feature.label} />
                                ))}
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}><TextField fullWidth size="small" label="Keywords" placeholder="Pool, view, renovated..." value={form.keywords ?? ''} onChange={(e) => updateFilter('keywords', e.target.value)} /></Grid>
                    </FilterGroup>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1.5, borderTop: `1px solid ${neutral[200]}`, pt: 2.5, mt: 2.5 }}>
                <Button type="button" variant="outlined" disabled={isSubmitting || !canReset} onClick={onResetFilters} startIcon={<RestartAltRoundedIcon />} sx={{ borderColor: neutral[300], color: neutral[600], px: 2.5 }}>Reset filters</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SearchRoundedIcon />} sx={{ px: 3, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>{isSubmitting ? 'Applying filters...' : 'Apply filters'}</Button>
            </Box>
        </Box>
    );
};
