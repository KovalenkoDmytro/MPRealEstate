import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationBell from "@/layouts/AuthenticatedLayout/TopBar/NotificationBell";
import UserMenu from './UserMenu';

interface TopBarProps {
    drawerWidth: number;
    handleDrawerToggle: () => void;
    header: string;
    user: any;
}

export default function TopBar({ drawerWidth, handleDrawerToggle, header, user }: TopBarProps) {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                bgcolor: 'background.default',
                borderBottom: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ height: 70 }}>
                {/* Mobile Hamburger Menu */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Header Title */}
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap component="div" fontWeight={600}>
                        {header}
                    </Typography>
                </Box>

                {/* Right Side Actions */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <NotificationBell />
                    <UserMenu user={user} />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
