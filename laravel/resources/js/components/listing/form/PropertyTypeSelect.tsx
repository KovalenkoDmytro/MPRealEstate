import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function PropertyTypeSelect({ value, onChange }: Props) {
    return (
        <FormControl fullWidth>
            <InputLabel id="property-type-label">Property Type</InputLabel>
            <Select
                labelId="property-type-label"
                name="property_type"
                value={value}
                onChange={(e) => onChange(e.target.value as string)}
            >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="condo">Condo</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="land">Land</MenuItem>
                <MenuItem value="multi-family">Multi-family</MenuItem>
                <MenuItem value="farm">Farm</MenuItem>
            </Select>
        </FormControl>
    );
}
