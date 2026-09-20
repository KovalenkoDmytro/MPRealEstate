import { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import theme from "@/theme";
import { radius } from "@/design/tokens";

type StatCardProps = {
    label: string;
    value: string | number;
    detail?: string;
    icon?: ReactNode;
    iconBgColor?: string;
    background?: string;
    borderColor?: string;
    badgeTextColor?: string;
    badgeBgColor?: string;
};

export default function StatCard({
    label,
    value,
    detail,
    icon,
    iconBgColor = theme.palette.primary.main,
    background = theme.glass.fill.level1,
    borderColor = 'rgba(255, 255, 255, 0.35)',
    badgeTextColor,
    badgeBgColor,
}: StatCardProps) {
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
                            color: '#fff',
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
