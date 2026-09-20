import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import SectionCard from '@/design/SectionCard';

type EmptyStateProps = {
    icon?: ReactNode;
    eyebrow?: string;
    title: string;
    description?: string;
    action?: ReactNode;
};

export default function EmptyState({ icon, eyebrow, title, description, action }: EmptyStateProps) {
    return (
        <SectionCard tone="elevated" sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
            <Stack spacing={1} alignItems="center">
                {icon}
                {eyebrow && (
                    <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.14em', fontWeight: 700 }}>
                        {eyebrow}
                    </Typography>
                )}
                <Typography variant="h5" fontWeight={700}>{title}</Typography>
                {description && (
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.8, pt: 0.5 }}>
                        {description}
                    </Typography>
                )}
                {action && <Stack pt={1.5}>{action}</Stack>}
            </Stack>
        </SectionCard>
    );
}
