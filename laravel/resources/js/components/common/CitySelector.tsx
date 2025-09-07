import React from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";

type CitySelectorProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function CitySelector({ value = "Calgary", onChange }: CitySelectorProps) {

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
        <FormControl fullWidth>
            <InputLabel id="city-label">Select City</InputLabel>
            <Select
                labelId="city-label"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                name="location"
            >
                {sortedCities.map((city) => (
                    <MenuItem key={city} value={city}>
                        {city}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
