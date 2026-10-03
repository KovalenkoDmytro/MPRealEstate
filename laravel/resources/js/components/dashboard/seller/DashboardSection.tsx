import type { ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ArrowForwardRounded } from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import { neutral, radius } from '@/design/tokens';

type DashboardSectionProps = { title: string; description: string; href: string; children: ReactNode };

export default function DashboardSection({ title, description, href, children }: DashboardSectionProps) {
    return (
        <Box component="section" sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2.5 }}>
                <Box><Typography component="h2" sx={{ color: neutral[0], fontSize: { xs: '1.35rem', sm: '1.5rem' }, fontWeight: 700 }}>{title}</Typography><Typography variant="body2" sx={{ color: neutral[300], mt: 0.5 }}>{description}</Typography></Box>
                <Button LinkComponent={Link} href={href} endIcon={<ArrowForwardRounded sx={{ fontSize: 18 }} />} variant="outlined" sx={{ color: neutral[0], borderColor: 'rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: radius.md, px: 2, py: 1, '&:hover': { borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.1)' } }}>View all</Button>
            </Box>
            {children}
        </Box>
    );
}
