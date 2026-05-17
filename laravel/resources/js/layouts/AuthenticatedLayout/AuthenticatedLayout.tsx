import { useState, PropsWithChildren, ReactNode } from 'react';
import { usePage, Head } from '@inertiajs/react';
import { Box, CssBaseline, Container } from '@mui/material';
import Sidebar from "@/layouts/AuthenticatedLayout/Sidebar";
import TopBar from "@/layouts/AuthenticatedLayout/TopBar";


const DRAWER_WIDTH = 280;

type AuthenticatedLayoutProps = PropsWithChildren<{
    header: ReactNode;
    subHeader?: ReactNode;
    title?: string;
}>;

export default function AuthenticatedLayout({ header, subHeader, title, children }: AuthenticatedLayoutProps) {
    const pageTitle = title ?? (typeof header === 'string' ? header : undefined);
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
        {pageTitle && <Head title={pageTitle} />}
        <Box
            className="authenticated-layout"
            sx={{
                display: 'flex',
                minHeight: '100vh',
            }}>
            <CssBaseline />

            {/* 1. Header Area */}
            <TopBar
                drawerWidth={DRAWER_WIDTH}
                handleDrawerToggle={handleDrawerToggle}
                header={header}
                user={user}
                subHeader={subHeader}
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
                    p: { xs: 0, md: 3 },
                    width: '100%',
                    mt: { xs: '120px', md: '70px' },
                    mb: { xs: '40px' },
                    transition: 'width 0.2s ease',
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        py: { xs: 0, md: 4 },
                        flexGrow: 1
                    }}
                >
                    {children}
                </Container>
            </Box>
        </Box>
        </>
    );
}
