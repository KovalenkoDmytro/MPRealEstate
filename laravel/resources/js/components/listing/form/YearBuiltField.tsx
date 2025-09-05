import React from "react";
import { TextField } from "@mui/material";

type YearBuiltFieldProps = {
    value: number;
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
};

export default function YearBuiltField({value, onChange}: YearBuiltFieldProps) {
    const currentYear = new Date().getFullYear();

    return (
        <TextField
            name="year_built"
            label="Year Built"
            type="number"
            value={value === 0 ? "" : value}
            onChange={onChange}
            fullWidth
            slotProps={{
                htmlInput: {
                    min: 1950,
                    max: currentYear,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                },
            }}
            onKeyDown={(e) => {
                if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                }
            }}
            onBlur={(e) => {
                const year = parseInt(e.target.value, 10);
                if (year < 1950) e.target.value = "1950";
                if (year > currentYear) e.target.value = String(currentYear);
            }}
        />
    );
}
