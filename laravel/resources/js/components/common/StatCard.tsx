import { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import theme from "@/theme";
import { neutral, primary, radius } from "@/design/tokens";

type StatCardProps = {
    variant?: 'default' | 'dashboard';
    label: string;
    value: string | number;
    detail?: string;
    icon?: ReactNode;
    iconBgColor?: string;
    iconColor?: string;
    background?: string;
    borderColor?: string;
    badgeTextColor?: string;
    badgeBgColor?: string;
};

export default function StatCard({
    variant = 'default',
    label,
    value,
    detail,
    icon,
    iconBgColor = theme.palette.primary.main,
    iconColor = '#fff',
    background = theme.glass.fill.level1,
    borderColor = 'rgba(255, 255, 255, 0.35)',
    badgeTextColor,
    badgeBgColor,
}: StatCardProps) {
    if (variant === 'dashboard') {
        return (
            <Paper elevation={0} sx={{
                p: { xs: 2.5, sm: 3 }, height: '100%', minWidth: 0,
                borderRadius: radius.lg, bgcolor: neutral[50],
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column',
            }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    {icon && (
                        <Box aria-hidden="true" sx={{
                            width: 48, height: 48, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: radius.md, bgcolor: iconBgColor, color: iconColor,
                            '& svg': { display: 'block', width: 26, height: 26, flexShrink: 0 },
                        }}>
                            {icon}
                        </Box>
                    )}
                    <Typography component="h2" variant="body2" sx={{ color: neutral[600], fontWeight: 600 }}>
                        {label}
                    </Typography>
                </Stack>
                <Typography sx={{
                    color: primary[900], fontSize: { xs: '2.5rem', sm: '3rem' },
                    fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.04em',
                    fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere', my: 2,
                }}>
                    {value}
                </Typography>
                {detail && (
                    <Typography variant="caption" sx={{
                        mt: 'auto', pt: 1.5, borderTop: `1px solid ${neutral[200]}`,
                        color: neutral[600], lineHeight: 1.6,
                    }}>
                        {detail}
                    </Typography>
                )}
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${borderColor}`,
                bgcolor: background,
                backdropFilter: theme.glass.blur.sm,
                WebkitBackdropFilter: theme.glass.blur.sm,
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="h3" fontWeight={700} color="text.primary">{value}</Typography>
                </Stack>
                {icon && (
                    <Box
                        sx={{
                            p: '14px',
                            maxWidth: 60,
                            maxHeight: 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: radius.md,
                            bgcolor: iconBgColor,
                            color: iconColor,
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </Box>
                )}
            </Stack>
            {detail && (
                <Box
                    component="span"
                    sx={{
                        alignSelf: 'flex-start',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: radius.pill,
                        fontSize: 12,
                        fontWeight: 600,
                        bgcolor: badgeBgColor,
                        color: badgeTextColor,
                    }}
                >
                    {detail}
                </Box>
            )}
        </Paper>
    );
}
