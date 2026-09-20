import { ReactNode } from 'react';
import { Box } from '@mui/material';
import theme from "@/theme";
import { radius } from "@/design/tokens";

export type IconContainerProps = {
    bgColor?: string;
    children: ReactNode
};

export default function IconContainer({ bgColor = theme.palette.primary.main, children }: IconContainerProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: radius.sm,
                bgcolor: bgColor,
                boxShadow: theme.glass.elevation.level1,
                color: '#fff',
                flexShrink: 0,
            }}
        >
            {children}
        </Box>
    );
}
