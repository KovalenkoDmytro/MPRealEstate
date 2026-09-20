import { ReactNode } from 'react';
import { Paper, SxProps, Theme } from '@mui/material';
import theme from '@/theme';
import { radius } from '@/design/tokens';

type SectionCardProps = {
    children: ReactNode;
    /** 'elevated' bumps fill/shadow a tier — for cards that need to stand out over other glass. */
    tone?: 'default' | 'elevated';
    padding?: 'default' | 'compact';
    sx?: SxProps<Theme>;
};

/**
 * Replaces the `p: theme.shape.padding; borderRadius: theme.shape.borderRadius;
 * bgcolor: theme.palette.background.white; border: 1px solid theme.palette.border.main`
 * recipe duplicated across deal/dashboard components. The glass fill/blur/shadow
 * itself comes from the global MuiPaper styleOverrides in theme.ts.
 */
export default function SectionCard({ children, tone = 'default', padding = 'default', sx }: SectionCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: padding === 'compact' ? 2.5 : theme.shape.padding,
                ...(tone === 'elevated' && {
                    bgcolor: theme.glass.fill.level3,
                    backdropFilter: theme.glass.blur.lg,
                    WebkitBackdropFilter: theme.glass.blur.lg,
                    boxShadow: theme.glass.elevation.level3,
                    borderRadius: radius.xl,
                }),
                ...sx,
            }}
        >
            {children}
        </Paper>
    );
}
