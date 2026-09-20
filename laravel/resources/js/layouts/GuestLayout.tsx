import ApplicationLogo from '@/components/ApplicationLogo';
import {Head} from '@inertiajs/react';
import React from 'react';
import {Avatar, Box, Typography} from '@mui/material';
import theme from "@/theme";
import SectionCard from "@/design/SectionCard";


type GuestLayout = {
    headTitle: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export default function GuestLayout({ children, title, subtitle, headTitle}: GuestLayout) {
    return (

        <Box
            className='guest-layout'
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100dvh',
            }}
        >
            <Head title={headTitle} />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.main, mb: 2 }}>
                    <ApplicationLogo/>
                </Avatar>

                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                    {title}
                </Typography>

                {/* accent[300] fails AA on the dark hero gradient — translucent white instead */}
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.72)', mb: 4 }}>
                    {subtitle}
                </Typography>

                <SectionCard tone="elevated" sx={{ width: '100%', maxWidth: 450 }}>
                    {children}
                </SectionCard>

                <Typography variant="caption" sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.64)' }}>
                    © 2026 EstateHub. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}
