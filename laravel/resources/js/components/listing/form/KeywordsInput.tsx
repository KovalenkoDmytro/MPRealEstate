import React, { useState, useEffect } from "react";
import { Box, TextField, Chip } from "@mui/material";

interface Props {
    value: string[];
    onChange: (keywords: string[]) => void;
}

export default function KeywordsInput({value, onChange}: Props) {
    const [chips, setChips] = useState<string[]>(value || []);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setChips(value || []);
    }, [value]);

    const commit = (next: string[]) => {
        const unique = Array.from(new Set(next.map((s) => s.trim()))).filter(Boolean);
        setChips(unique);
        onChange(unique);
    };

    const addFromInput = () => {
        const parts = inputValue
            .split(/[,\n]/g)
            .map((s) => s.trim())
            .filter(Boolean);
        if (parts.length) commit([...chips, ...parts]);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addFromInput();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text");
        if (!text) return;
        e.preventDefault();
        const parts = text
            .split(/[,\n]/g)
            .map((s) => s.trim())
            .filter(Boolean);
        if (parts.length) commit([...chips, ...parts]);
    };

    const removeChip = (kw: string) => commit(chips.filter((c) => c !== kw));

    return (
        <Box>
            <TextField
                label="Keywords"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                fullWidth
                placeholder="Type a keyword and press Enter"
            />
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {chips.map((kw) => (
                    <Chip key={kw} label={kw} onDelete={() => removeChip(kw)} />
                ))}
            </Box>
        </Box>
    );
}
