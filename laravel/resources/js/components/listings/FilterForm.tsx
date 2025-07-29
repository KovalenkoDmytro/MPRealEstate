import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';

type FilterFormProps = {
  form: Record<string, any>;
  updateFilter: (key: string, value: string | boolean) => void;
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
        {/* Location Field */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Location"
            value={form.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            variant="outlined"
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

        {/* Status Select */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Property Type Select */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select
              value={form.property_type}
              onChange={(e) => updateFilter('property_type', e.target.value)}
            >
              <MenuItem value="">All Property Types</MenuItem>
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="condo">Condo</MenuItem>
              <MenuItem value="townhouse">Townhouse</MenuItem>
              <MenuItem value="land">Land</MenuItem>
              <MenuItem value="multi-family">Multi-family</MenuItem>
              <MenuItem value="farm">Farm</MenuItem>
            </Select>
          </FormControl>
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
          <TextField
            fullWidth
            label="Min Year Built"
            type="number"
            value={form.year_built_min}
            onChange={(e) => updateFilter('year_built_min', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Max Year Built"
            type="number"
            value={form.year_built_max}
            onChange={(e) => updateFilter('year_built_max', e.target.value)}
            variant="outlined"
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
