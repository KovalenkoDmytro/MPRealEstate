import React from "react";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

const selectMenuProps = {
    PaperProps: {
        sx: {
            maxHeight: 450,
        },
    },
};

interface PropertyTypeSelectProps {
    value: string | undefined;
    onChange: (value: string) => void;
    error?: boolean;
    helperText? : string;
}

export default function PropertyTypeSelect({ value, onChange, error, helperText }: PropertyTypeSelectProps) {
    return (
        <FormControl fullWidth error={error}>
            <InputLabel id="property-type-select-label">Property Type</InputLabel>
            <Select
                labelId="property-type-select-label"
                label="Property Type"
                name="property_type"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value as string)}
                MenuProps={selectMenuProps}
            >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="condo">Condo</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="land">Land</MenuItem>
                <MenuItem value="multi-family">Multi-family</MenuItem>
                <MenuItem value="farm">Farm</MenuItem>
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}
