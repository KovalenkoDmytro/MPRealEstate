import React from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";

type CitySelectorProps = {
    value: "Calgary";
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
};

export default function CitySelector({ value, onChange }: CitySelectorProps) {
    const [chosenCity, setChosenCity] = React.useState<string>(value);

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

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setChosenCity(e.target.value);
        onChange({
            target: {
                name: "location",
                value: e.target.value,
                type: "select-one",
                checked: false,
            },
        } as unknown as React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >);
    };

    const sortedCities = React.useMemo(
        () => [...canadianCities].sort((a, b) => a.localeCompare(b)),
        [canadianCities]
    );

    return (
        <FormControl fullWidth>
            <InputLabel id="city-label">Select City</InputLabel>
            <Select
                labelId="city-label"
                value={chosenCity}
                onChange={handleSelectChange}
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
