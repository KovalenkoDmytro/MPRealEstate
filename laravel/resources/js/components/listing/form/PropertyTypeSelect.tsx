import React from "react";
import { MenuItem, TextField} from "@mui/material";

interface Props {
    value: string | undefined;
    onChange: (value: string) => void;
    error?: boolean;
    helperText? : string;
}

export default function PropertyTypeSelect({ value, onChange, error, helperText }: Props) {
    return (
        <TextField
            select
            label="Property Type"
            name="property_type"
            error={error}
            value={value}
            helperText={helperText}
            fullWidth
            onChange={(e) => onChange(e.target.value as string)}
        >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="house">House</MenuItem>
            <MenuItem value="condo">Condo</MenuItem>
            <MenuItem value="townhouse">Townhouse</MenuItem>
            <MenuItem value="land">Land</MenuItem>
            <MenuItem value="multi-family">Multi-family</MenuItem>
            <MenuItem value="farm">Farm</MenuItem>
        </TextField>
    );
}
