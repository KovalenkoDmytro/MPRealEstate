import React from 'react';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CitySelector from "@/components/common/CitySelector";
import PropertyTypeSelect from "@/components/listing/form/PropertyTypeSelect";
import YearBuiltField from "@/components/listing/form/YearBuiltField";

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
      lot_size_min?: number;
      lot_size_max?: number;
      year_built_min?: number;
      year_built_max?: number;
      favorites_only?: boolean;
      has_garage?: boolean;
      has_basement?: boolean;
      price_reduced?: boolean;
      keywords?: string;
  };
  updateFilter: (key: string, value: string | number | boolean) => void;
  onApplyFilters: (e: React.FormEvent) => void;
};

export const FilterForm: React.FC<FilterFormProps> = ({ form, updateFilter, onApplyFilters }) => {
  return (
    <Box
      component="form"
      onSubmit={onApplyFilters}
      sx={{
        mb: 6,
      }}
    >
      <Grid container spacing={2}>

          <Grid size={{ xs: 12, sm: 6 }}>
              <CitySelector
                  value={form.location}
                  onChange={(value) => updateFilter('location', value)}
              />
          </Grid>



        {/* Price Fields */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Min Price"
            type="number"
            value={form.min_price}
            onChange={(e) => updateFilter('min_price', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Max Price"
            type="number"
            value={form.max_price}
            onChange={(e) => updateFilter('max_price', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Bedrooms and Bathrooms */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Min Bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={(e) => updateFilter('bedrooms', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Min Bathrooms"
            type="number"
            value={form.bathrooms}
            onChange={(e) => updateFilter('bathrooms', e.target.value)}
            variant="outlined"
          />
        </Grid>


        {/* Property Type Select */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <PropertyTypeSelect
                value={form.property_type}
                onChange={(value) => updateFilter("property_type", value)}
            />
        </Grid>

        {/* Additional Fields */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Min SqFt"
            type="number"
            value={form.square_feet_min}
            onChange={(e) => updateFilter('square_feet_min', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Max SqFt"
            type="number"
            value={form.square_feet_max}
            onChange={(e) => updateFilter('square_feet_max', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Min Lot Size"
            type="number"
            value={form.lot_size_min}
            onChange={(e) => updateFilter('lot_size_min', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Max Lot Size"
            type="number"
            value={form.lot_size_max}
            onChange={(e) => updateFilter('lot_size_max', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Year Built */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <YearBuiltField
                value={form.year_built_min ?? ''}
                onChange={(value) => { updateFilter("year_built_min", value) }}
            />



        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <YearBuiltField
                value={form.year_built_max ?? ''}
                onChange={(value) => { updateFilter("year_built_max", value)}}
            />
        </Grid>

        {/* Checkboxes */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.favorites_only}
                onChange={(e) => updateFilter('favorites_only', e.target.checked)}
              />
            }
            label="Favorites Only"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.has_garage}
                onChange={(e) => updateFilter('has_garage', e.target.checked)}
              />
            }
            label="Has Garage"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.has_basement}
                onChange={(e) => updateFilter('has_basement', e.target.checked)}
              />
            }
            label="Has Basement"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.price_reduced}
                onChange={(e) => updateFilter('price_reduced', e.target.checked)}
              />
            }
            label="Price Reduced"
          />
        </Grid>

        {/* Keywords and Submit */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Keywords"
            value={form.keywords}
            onChange={(e) => updateFilter('keywords', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
