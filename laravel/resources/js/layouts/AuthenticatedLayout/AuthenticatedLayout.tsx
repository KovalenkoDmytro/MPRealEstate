import { useState, PropsWithChildren, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from "@/layouts/AuthenticatedLayout/Sidebar";
import TopBar from "@/layouts/AuthenticatedLayout/TopBar";

const DRAWER_WIDTH = 280;

type AuthenticatedLayoutProps = PropsWithChildren<{
    header?: ReactNode;
}>;

export default function AuthenticatedLayout({ header, children }: AuthenticatedLayoutProps) {
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box
            className="authenticated-layout"
            sx={{ display: 'flex', minHeight: '100vh',}}>
            <CssBaseline />

            {/* 1. Header Area */}
            <TopBar
                drawerWidth={DRAWER_WIDTH}
                handleDrawerToggle={handleDrawerToggle}
                header={header}
                user={user}
            />

            {/* 2. Sidebar Navigation */}
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={handleDrawerToggle}
                drawerWidth={DRAWER_WIDTH}
                userRole={user.role}
            />

            {/* 3. Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    mt: '70px', // Matches TopBar height
                    transition: 'width 0.2s ease',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
