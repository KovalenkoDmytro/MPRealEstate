import { Box, CircularProgress, Typography } from '@mui/material';
import theme from '@/theme';

type LoadingProps = {
    size?: 'sm' | 'md' | 'lg';
    /** Renders as an absolutely-positioned glass scrim over the parent (which needs position: relative). */
    overlay?: boolean;
    label?: string;
};

const SIZE_MAP = { sm: 24, md: 40, lg: 56 } as const;

export default function Loading({ size = 'md', overlay = false, label }: LoadingProps) {
    const spinner = (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={SIZE_MAP[size]} />
            {label && <Typography variant="body2" color="text.secondary">{label}</Typography>}
        </Box>
    );

    if (!overlay) return spinner;

    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.glass.fill.level1,
                backdropFilter: theme.glass.blur.sm,
                WebkitBackdropFilter: theme.glass.blur.sm,
                borderRadius: 'inherit',
                zIndex: 1,
            }}
        >
            {spinner}
        </Box>
    );
}
