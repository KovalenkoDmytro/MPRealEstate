import React from "react";
import { TextField } from "@mui/material";

type YearBuiltFieldProps = {
    value: number;
    onChange: (value: number) => void;
};

export default function YearBuiltField({ value, onChange }: YearBuiltFieldProps) {
    const currentYear = new Date().getFullYear();

    return (
        <TextField
            name="year_built"
            label="Year Built"
            type="number"
            value={value === 0 ? "" : value}
            onChange={(event) => onChange(Number(event.target.value))}
            fullWidth
            slotProps={{
                htmlInput: {
                    min: 1950,
                    max: currentYear,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                }
            }}
        />
    );
}
