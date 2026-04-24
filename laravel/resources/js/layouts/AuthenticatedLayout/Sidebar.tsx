import React from 'react';
import { Drawer, Toolbar, Box, useTheme, Divider, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/components/ApplicationLogo';
import SidebarNavLink from '@/layouts/AuthenticatedLayout/SidebarNavLink';
import IconDashboard from "@/icons/IconDashboard";
import IconMyListings from "@/icons/IconMyListings";
import IconMyDeals from "@/icons/IconMyDeals";
import IconAppointments from "@/icons/IconAppointments";
import IconOffers from "@/icons/IconOffers";
import IconFavorite from "@/icons/IconFavorite";

// --- Configuration ---
// This makes adding new roles/links easy without touching the JSX
const ROLE_MENUS: Record<string, Array<{ label: string; route: string; icon: React.ReactNode }>> = {
    common: [
        { label: 'Dashboard', route: 'dashboard', icon: <IconDashboard /> },
    ],
    buyer: [
        { label: 'Listings', route: 'listings.index', icon: <IconMyListings/> },
        { label: 'Favorite Listings', route: 'listings.favorites.index', icon: <IconFavorite/> },
        { label: 'My Deals', route: 'deals.index', icon: <IconMyDeals /> },
        { label: 'Appointments', route: 'appointments.index', icon: <IconAppointments /> },
    ],
    seller: [
        { label: 'My Listings', route: 'listings.index', icon: <IconMyListings /> },
        { label: 'My Deals', route: 'deals.index', icon: <IconMyDeals /> },
        { label: 'Appointments', route: 'appointments.index', icon: <IconAppointments /> },
    ],
    admin: [
        { label: 'Admin Dashboard', route: 'admin.dashboard', icon: <IconDashboard /> },
    ],
    lawyer: [
        { label: 'My Deals', route: 'lawyer.deals.index', icon: <IconMyDeals /> },
    ]
};

const COMMON_BOTTOM_LINKS = [
    { label: 'Offers', route: 'offers.index', icon: <IconOffers /> }
];

// --- Props ---
type SidebarProps = {
    mobileOpen: boolean;
    onClose: () => void;
    drawerWidth: number;
    userRole: string;
};

export default function Sidebar({ mobileOpen, onClose, drawerWidth, userRole }: SidebarProps) {
    const theme = useTheme();

    // Combine common links + role specific links + bottom links
    const menuItems = [
        ...(ROLE_MENUS.common || []),
        ...(ROLE_MENUS[userRole] || []),
        ...COMMON_BOTTOM_LINKS
    ];

    const drawerContent = (
        <Box
            className="navigation-drawer-content"
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            <Toolbar sx={{ justifyContent: 'center', py: 3, minHeight: '80px !important' }}>

                <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center', width: '100%' }}>

                    <Link href={route('home')}>
                        {/* The Icon Container */}
                        <ApplicationLogo
                            style={{
                                height: 45,
                                width: 'auto',
                                borderRadius: '14px',
                                backgroundColor: theme.palette.primary.main ,
                                padding: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10);'
                            }}
                        />
                    </Link>

                    {/* The Text Stack */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#fff',
                                lineHeight: 1.2,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            EstateHub
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.rosyPink  ,
                                fontWeight: 400,
                                fontSize: '12px',
                            }}
                        >
                            Seller Dashboard
                        </Typography>
                    </Box>

                </Box>

            </Toolbar>


            <Divider sx={{ mb: 2, mx: 3 }} />

            {/* Navigation Items */}
            <Box sx={{ px: 2, flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <SidebarNavLink
                        key={item.route}
                        href={route(item.route)}
                        active={route().current(item.route)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarNavLink>
                ))}
            </Box>
        </Box>
    );

    return (
        <Box
            className="navigation-drawer"
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
            {/* Mobile Drawer */}
            <Drawer
                className="desktop-drawer"
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px dashed',
                        borderColor: 'divider',
                        bgcolor: 'background.sidebar',
                        color: 'text.tan',
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}
