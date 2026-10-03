import { ReactNode } from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationBell from "@/layouts/AuthenticatedLayout/TopBar/NotificationBell";
import UserMenu from './UserMenu';
import { neutral, radius } from "@/design/tokens";
import type { User } from "@/types";

interface TopBarProps {
    drawerWidth: number;
    handleDrawerToggle: () => void;
    header: ReactNode;
    subHeader?: ReactNode;
    user: User;
}

export default function TopBar({ drawerWidth, handleDrawerToggle, header, subHeader, user }: TopBarProps) {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                borderRadius: 0,
                border: 0,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                bgcolor: 'rgba(23,26,34,0.82)',
                color: neutral[0],
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
        >
            <Toolbar sx={{ minHeight: { xs: 88, sm: 88 }, px: { xs: 2, md: 4 }, py: 1.5, gap: { xs: 1.5, sm: 2 } }}>
                {/* Mobile Hamburger Menu */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ display: { md: 'none' }, width: 40, height: 40, flexShrink: 0, borderRadius: radius.sm, bgcolor: 'rgba(255,255,255,0.06)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Header Title */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.2rem' }, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
                        {header}
                    </Typography>
                    {subHeader && (
                        <Typography variant="body2" noWrap sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.25, fontSize: { xs: '0.75rem', sm: '0.825rem' } }}>
                            {subHeader}
                        </Typography>
                    )}
                </Box>

                {/* Right Side Actions */}
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
                    <NotificationBell />
                    <UserMenu user={user} />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
