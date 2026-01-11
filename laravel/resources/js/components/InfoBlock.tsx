import React from "react";
import { Alert, AlertTitle, Stack } from "@mui/material";

type InfoType = "success" | "warning" | "error";

interface InfoBlockProps {
    type: InfoType;
    message: string;
    title?: string;
}

export const InfoBlock: React.FC<InfoBlockProps> = ({type, message, title}) => {
    return (
        <Stack sx={{ width: "100%", mb: 2 }}>
            <Alert severity={type}>
                {title && <AlertTitle>{title}</AlertTitle>}
                {message}
            </Alert>
        </Stack>
    );
};
