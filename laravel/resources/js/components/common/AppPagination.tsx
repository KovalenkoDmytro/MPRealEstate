import type { ChangeEvent } from "react";
import { router } from "@inertiajs/react";
import { Box, Pagination, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { neutral, primary, radius } from "@/design/tokens";
import type { PaginationProps as MuiPaginationProps, SxProps, Theme } from "@mui/material";
import type { PaginatedResponse } from "@/types";

type AppPaginationProps = {
    pagination: Pick<PaginatedResponse<unknown>, "current_page" | "last_page">;
    path?: string;
    preserveState?: boolean;
    preserveScroll?: boolean;
    showFirstButton?: boolean;
    showLastButton?: boolean;
    color?: MuiPaginationProps["color"];
    shape?: MuiPaginationProps["shape"];
    size?: MuiPaginationProps["size"];
    sx?: SxProps<Theme>;
};

export default function AppPagination({
    pagination,
    path,
    preserveState = true,
    preserveScroll = true,
    showFirstButton = false,
    showLastButton = false,
    color = "primary",
    shape = "rounded",
    size = "large",
    sx,
}: AppPaginationProps) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    if (pagination.last_page <= 1) {
        return null;
    }

    const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
        const currentUrl = new URL(window.location.href);
        const searchParams = new URLSearchParams(currentUrl.search);

        if (page <= 1) {
            searchParams.delete("page");
        } else {
            searchParams.set("page", String(page));
        }

        router.get(
            path ?? currentUrl.pathname,
            Object.fromEntries(searchParams.entries()),
            {
                preserveState,
                preserveScroll,
            }
        );
    };

    return (
        <Box
            sx={[
                { mt: 4, display: "flex", flexDirection: 'column', alignItems: 'center', gap: 1.5 },
                ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
        >
            <Pagination
                count={pagination.last_page}
                page={pagination.current_page}
                onChange={handlePageChange}
                color={color}
                shape={shape}
                size={size}
                showFirstButton={showFirstButton}
                showLastButton={showLastButton}
                siblingCount={isSmallScreen ? 0 : 1}
                sx={{
                    bgcolor: neutral[50],
                    p: { xs: 0.75, sm: 1 },
                    borderRadius: radius.lg,
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    '& .MuiPagination-ul': { flexWrap: 'nowrap' },
                    '& .MuiPaginationItem-root': {
                        minWidth: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 },
                        mx: 0.25, borderRadius: radius.sm,
                        color: neutral[600], fontSize: '0.875rem', fontWeight: 600,
                        transition: 'background-color 150ms, color 150ms',
                        '&:hover': { bgcolor: primary[50], color: primary[700] },
                        '&:focus-visible': { outline: `2px solid ${primary[600]}`, outlineOffset: 2 },
                        '&.Mui-selected': {
                            bgcolor: primary[600], color: neutral[0],
                            boxShadow: '0 2px 6px rgba(59,91,219,0.2)',
                            '&:hover': { bgcolor: primary[700] },
                        },
                        '&.Mui-disabled': { opacity: 1, color: neutral[400], bgcolor: neutral[100] },
                    },
                    '& .MuiPaginationItem-ellipsis': { color: neutral[400] },
                }}
            />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Page {pagination.current_page} of {pagination.last_page}
            </Typography>
        </Box>
    );
}
