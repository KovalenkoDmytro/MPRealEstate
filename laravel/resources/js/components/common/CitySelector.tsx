import React from "react";
import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";

const selectMenuProps = {
    PaperProps: {
        sx: {
            maxHeight: 450,
        },
    },
};

type CitySelectorProps = {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
};

export default function CitySelector({ value = "Calgary", onChange, error, helperText }: CitySelectorProps) {

    const canadianCities = [
        "Toronto",
        "Montreal",
        "Vancouver",
        "Calgary",
        "Edmonton",
        "Ottawa",
        "Winnipeg",
        "Quebec City",
        "Hamilton",
        "Halifax",
        "London",
        "Victoria",
        "Saskatoon",
        "Regina",
        "St. John's",
    ];

    const sortedCities = React.useMemo(
        () => [...canadianCities].sort((a, b) => a.localeCompare(b)),
        [canadianCities]
    );

    return (
        <FormControl fullWidth error={error}>
            <InputLabel id="city-selector-label">Select City</InputLabel>
            <Select
                labelId="city-selector-label"
                label="Select City"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                name="location"
                MenuProps={selectMenuProps}
            >
                {sortedCities.map((city) => (
                    <MenuItem key={city} value={city}>
                        {city}
                    </MenuItem>
                ))}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}
