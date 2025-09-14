import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

type YearBuiltFieldProps = {
    value: number;
    onChange: (value: number) => void;
    error?: boolean;
    helperText?: string;
};

export default function YearBuiltField({ value, onChange, error, helperText }: YearBuiltFieldProps) {
    const currentYear = new Date().getFullYear();
    const years = React.useMemo(
        () => Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i),
        [currentYear]
    );

    return (
        <FormControl fullWidth error={error}>
            <InputLabel id="year-built-label">Year Built</InputLabel>
            <Select
                labelId="year-built-label"
                id="year-built"
                value={value || ""}
                onChange={(e) => onChange(Number(e.target.value))}
            >
                {years.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                ))}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}
