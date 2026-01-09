import ApplicationLogo from '@/components/ApplicationLogo';
import {Head} from '@inertiajs/react';
import React from 'react';
import {Avatar, Box, Paper, Typography} from '@mui/material';
import theme from "@/theme";


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
                bgcolor: 'grey.100',
            }}
        >
            <Head title={headTitle} />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: '#522B47', mb: 2 }}>
                    <ApplicationLogo/>
                </Avatar>

                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                    {title}
                </Typography>

                <Typography sx={{ color: theme.palette.text.rosyPink, mb: 4 }}>
                    {subtitle}
                </Typography>

                <Paper sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 440,
                    borderRadius: "24px",
                    backgroundColor: theme.palette.background.white,
                    boxShadow: '0px 10px 40px rgba(0,0,0,0.1)'
                }}>
                    {children}
                </Paper>

                <Typography variant="caption" sx={{ mt: 4, color:theme.palette.text.rosyPink }}>
                    © 2026 EstateHub. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}
