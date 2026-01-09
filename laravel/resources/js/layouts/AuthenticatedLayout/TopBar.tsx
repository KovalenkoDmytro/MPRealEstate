import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Typography,
    Divider,
    Stack
} from '@mui/material';
import { Menu as MenuIcon, Person, Logout } from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import NotificationBell from "@/components/NotificationBell";

// --- Sub-Component: User Dropdown ---
const UserMenu = ({ user }: { user: any }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                        fontSize: 15,
                        fontWeight: 600
                    }}
                >
                    {user.name.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 180, mt: 1.5, borderRadius: 2 }
                }}
            >
                <Box px={2} py={1.5}>
                    <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {user.role}
                    </Typography>
                </Box>
                <Divider />
                <MenuItem component={Link} href={route('profile.edit')} onClick={handleClose}>
                    <Person fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                    Profile
                </MenuItem>
                <MenuItem
                    component={Link}
                    href={route('logout')}
                    method="post"
                    as="button"
                    onClick={handleClose}
                    sx={{ color: 'error.main' }}
                >
                    <Logout fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                    Log Out
                </MenuItem>
            </Menu>
        </>
    );
};

// --- Main TopBar Component ---
type TopBarProps = {
    drawerWidth: number;
    handleDrawerToggle: () => void;
    header?: React.ReactNode;
    user: any;
};

export default function TopBar({ drawerWidth, handleDrawerToggle, header, user }: TopBarProps) {
    return (
        <AppBar
            className="top-bar"
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
                {/* Mobile Menu Toggle */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Page Title / Header */}
                <Box sx={{ flexGrow: 1 }}>
                    {header}
                </Box>

                {/* Actions */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <NotificationBell />
                    <UserMenu user={user} />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
