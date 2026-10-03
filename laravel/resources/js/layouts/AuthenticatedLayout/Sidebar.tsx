import React from 'react';
import { Drawer, Toolbar, Box, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/components/ApplicationLogo';
import SidebarNavLink from '@/layouts/AuthenticatedLayout/SidebarNavLink';
import IconDashboard from "@/icons/IconDashboard";
import IconMyListings from "@/icons/IconMyListings";
import IconMyDeals from "@/icons/IconMyDeals";
import IconAppointments from "@/icons/IconAppointments";
import IconOffers from "@/icons/IconOffers";
import IconFavorite from "@/icons/IconFavorite";
import { neutral, primary, radius } from "@/design/tokens";

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


type SidebarProps = {
    mobileOpen: boolean;
    onClose: () => void;
    drawerWidth: number;
    userRole: string;
};

export default function Sidebar({ mobileOpen, onClose, drawerWidth, userRole }: SidebarProps) {
    const bottomLinks = userRole === 'lawyer' ? [] : COMMON_BOTTOM_LINKS;

    // Combine common links + role specific links + bottom links
    const menuItems = [
        ...(ROLE_MENUS.common || []),
        ...(ROLE_MENUS[userRole] || []),
        ...bottomLinks
    ];

    const drawerContent = (
        <Box
            className="navigation-drawer-content"
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            <Toolbar sx={{ px: '24px !important', minHeight: '88px !important', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Link href={route('home')} aria-label="EstateHub home" onClick={onClose} style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', textDecoration: 'none' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: radius.md, background: `linear-gradient(135deg, ${primary[500]}, ${primary[700]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ApplicationLogo style={{ width: 24, height: 24 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: neutral[0], lineHeight: 1.3, letterSpacing: '-0.02em' }}>EstateHub</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', textTransform: 'capitalize', fontSize: '0.7rem' }}>{userRole} workspace</Typography>
                    </Box>
                </Link>
            </Toolbar>

            <Typography variant="caption" sx={{ px: 3, pt: 3, pb: 1.5, color: 'rgba(255,255,255,0.4)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Workspace</Typography>

            {/* Navigation Items */}
            <Box sx={{ px: 1.5, pb: 2, flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <SidebarNavLink
                        key={item.route}
                        href={route(item.route)}
                        active={route().current(item.route)}
                        onClick={onClose}
                    >
                        <Box className="sidebar-nav-icon" aria-hidden="true">{item.icon}</Box>
                        <span className="sidebar-nav-label">{item.label}</span>
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
                className="mobile-drawer"
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRadius: 0,
                        border: 0,
                        borderRight: '1px solid rgba(255,255,255,0.1)',
                        bgcolor: neutral[900],
                        backgroundImage: 'linear-gradient(180deg, rgba(59,91,219,0.04), rgba(59,91,219,0.1))',
                        boxShadow: 'none',
                        color: neutral[0],
                    },
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
                        borderRadius: 0,
                        border: 0,
                        borderRight: '1px solid rgba(255,255,255,0.1)',
                        bgcolor: neutral[900],
                        backgroundImage: 'linear-gradient(180deg, rgba(59,91,219,0.04), rgba(59,91,219,0.1))',
                        boxShadow: 'none',
                        color: neutral[0],
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}
