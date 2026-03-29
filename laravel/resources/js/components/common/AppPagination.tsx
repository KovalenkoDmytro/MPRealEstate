import type { ChangeEvent } from "react";
import { router } from "@inertiajs/react";
import { Box, Pagination } from "@mui/material";
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
                { mt: 5, display: "flex", justifyContent: "center" },
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
            />
        </Box>
    );
}
