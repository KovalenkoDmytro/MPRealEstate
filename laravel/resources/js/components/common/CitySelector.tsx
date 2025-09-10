import React from "react";
import {MenuItem, TextField} from "@mui/material";

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
        <TextField
            select
            label="Select City"
            value={value}
            error={error}
            helperText={helperText}
            onChange={(event) => onChange(event.target.value)}
            name="location"
            fullWidth
        >
            {sortedCities.map((city) => (
                <MenuItem key={city} value={city}>
                    {city}
                </MenuItem>
            ))}
        </TextField>
    );
}
