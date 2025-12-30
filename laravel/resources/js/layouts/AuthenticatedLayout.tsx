import { useState, PropsWithChildren, ReactNode } from 'react';
import { usePage, Link } from '@inertiajs/react';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
    useTheme,
    Avatar,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Home as HomeIcon, // Placeholder for Listings which usually looks like Home
    BusinessCenter as BusinessCenterIcon, // Deals/Offers
    Favorite as FavoriteIcon,
    Event as EventIcon,
    Gavel as GavelIcon, // Admin/Lawyer?
    Person as PersonIcon, // Profile
    Logout as LogoutIcon
} from '@mui/icons-material';

import ApplicationLogo from '@/components/ApplicationLogo';
import NotificationBell from "@/components/NotificationBell";
import NavLink from '@/components/NavLink';

const drawerWidth = 280;

const UserProfileDropdown = ({ user }: { user: any }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
                    {user.name.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box px={2} py={1}>
                    <Typography variant="subtitle2">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                </Box>
                <Divider />
                <MenuItem component={Link} href={route('profile.edit')} onClick={() => setAnchorEl(null)}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Profile
                </MenuItem>
                <MenuItem
                    component={Link}
                    href={route('logout')}
                    method="post"
                    as="button"
                    onClick={() => setAnchorEl(null)}
                >
                    <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Log Out
                </MenuItem>
            </Menu>
        </>
    );
};

// Extracted Navigation Component
const NavigationContent = ({ role }: { role: string }) => {
    return (
        <Box sx={{ mt: 2 }}>
            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                <DashboardIcon /> <span>Dashboard</span>
            </NavLink>

            {role === 'buyer' && (
                <>
                    <NavLink href={route('listings.index')} active={route().current('listings.index')}>
                        <HomeIcon /> <span>Listings</span>
                    </NavLink>
                    <NavLink href={route('buyer.listings.favorites.index')} active={route().current('buyer.listings.favorites.index')}>
                        <FavoriteIcon /> <span>Favorite Listings</span>
                    </NavLink>
                    <NavLink href={route('buyer.deals.index')} active={route().current('buyer.deals.index')}>
                        <BusinessCenterIcon /> <span>My Deals</span>
                    </NavLink>
                    <NavLink href={route('buyer.appointments.index')} active={route().current('buyer.appointments.index')}>
                        <EventIcon /> <span>Appointments</span>
                    </NavLink>
                </>
            )}

            {role === 'seller' && (
                <>
                    <NavLink href={route('listings.index')} active={route().current('listings.index')}>
                        <HomeIcon /> <span>My Listings</span>
                    </NavLink>
                    <NavLink href={route('seller.deals.index')} active={route().current('seller.deals.index')}>
                        <BusinessCenterIcon /> <span>My Deals</span>
                    </NavLink>
                    <NavLink href={route('seller.appointments.index')} active={route().current('seller.appointments.index')}>
                        <EventIcon /> <span>Appointments</span>
                    </NavLink>
                </>
            )}

            <NavLink href={route('offers.index')} active={route().current('offers.index')}>
                <BusinessCenterIcon /> <span>Offers</span>
            </NavLink>

            {role === 'admin' && (
                <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                    <GavelIcon /> <span>Admin Dashboard</span>
                </NavLink>
            )}

            {role === 'lawyer' && (
                <NavLink href={route('lawyer.deals.index')} active={route().current('lawyer.deals.index')}>
                    <GavelIcon /> <span>My Deals</span>
                </NavLink>
            )}

        </Box>
    );
}

export default function AuthenticatedLayout({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const { role } = user;

    // Mobile Drawer State
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerContent = (
        <div>
            <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
                <Link href={route('home')}>
                    {/* Replaced ApplicationLogo with simple img or keep svg. styling via sx */}
                    <ApplicationLogo style={{ height: 40, width: 'auto', color: theme.palette.primary.main }} />
                </Link>
            </Toolbar>
            <NavigationContent role={role} />
        </div>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Header Title from Prop */}
                    <Box sx={{ flexGrow: 1 }}>
                        {header}
                    </Box>

                    {/* Right Side Icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NotificationBell />
                        <UserProfileDropdown user={user} />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRightStyle: 'dashed' },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    pt: { xs: 8, md: 10 } // Spacing for AppBar
                }}
            >
                {/* Container max-width managed by parent layout or here */}
                {children}
            </Box>
        </Box>
    );
}
