import { InertiaLinkProps, Link } from '@inertiajs/react';
import { ListItemButton, Box } from '@mui/material';
import { ReactNode } from 'react';
import { primary, radius, motion } from '@/design/tokens';

interface NavLinkProps extends InertiaLinkProps {
    active?: boolean;
    children: ReactNode;
}

export default function SidebarNavLink({ active = false, className = '', children, ...props }: NavLinkProps) {
    const { action, ...inertiaProps } = props as any;

    return (
        <ListItemButton
            component={Link as any}
            href={props.href}
            {...inertiaProps}
            className={className}
            selected={active}
            aria-current={active ? 'page' : undefined}
            sx={{
                minHeight: 52, py: 1, px: 1.5, mb: 0.75,
                borderRadius: radius.md, border: '1px solid transparent',
                color: 'rgba(255,255,255,0.65)',
                transition: `background-color ${motion.duration.fast}ms, color ${motion.duration.fast}ms`,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'common.white' },
                '&.Mui-selected': {
                    bgcolor: 'rgba(76,100,223,0.16)', borderColor: 'rgba(147,163,240,0.2)', color: 'common.white',
                    '&:hover': { bgcolor: 'rgba(76,100,223,0.24)' },
                    '& .sidebar-nav-icon': { bgcolor: 'rgba(76,100,223,0.22)', color: primary[200] },
                    '& .sidebar-nav-label': { fontWeight: 600 },
                },
                '&:focus-visible': { outline: `2px solid ${primary[300]}`, outlineOffset: 2 },
                '& .sidebar-nav-icon': {
                    width: 32, height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: radius.sm, color: 'inherit',
                },
                '& svg': { width: 22, height: 22, display: 'block', flexShrink: 0 },
                '& .sidebar-nav-label': { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 },
            }}
        >
            <Box display="flex" alignItems="center" gap={1.5} width="100%">
                {children}
            </Box>
        </ListItemButton>
    );
}
