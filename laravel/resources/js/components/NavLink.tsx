import { InertiaLinkProps, Link } from '@inertiajs/react';
import { ListItemButton, ListItemText, ListItemIcon, Box, styled } from '@mui/material';
import React, { ReactNode } from 'react';

// Specialized Link for our Sidebar
// We expect children to contain an SVG and a span usually, 
// but identifying them automatically is hard without context.
// We'll style it as a flexible button.

interface NavLinkProps extends InertiaLinkProps {
    active?: boolean;
    children: ReactNode;
}

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: NavLinkProps) {
    // Destructure action to avoid conflict with MUI ButtonBase action
    const { action, ...inertiaProps } = props as any;

    return (
        <ListItemButton
            component={Link as any}
            href={props.href} // Inertia Link uses href
            {...inertiaProps}
            selected={active}
            sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                color: active ? 'primary.main' : 'text.secondary',
                bgcolor: active ? (theme) => theme.palette.action.selected : 'transparent',
                '&:hover': {
                    bgcolor: (theme) => theme.palette.action.hover,
                    color: active ? 'primary.dark' : 'text.primary',
                },
                '& .MuiSvgIcon-root, & svg': {
                    color: active ? 'primary.main' : 'inherit',
                    mr: 2, // Spacing for icon
                    width: 20,
                    height: 20,
                },
            }}
        >
            {/* 
               We render children directly. 
               The consumer (Layout) puts <svg> and <span>. 
               We added usage of `& svg` in sx to handle the icon.
               We wrap children in a Box to ensure alignment if needed, 
               but ListItemButton is flex-row by default? 
               ListItemButton is a ButtonBase. It behaves like a div with flex usually.
            */}
            <Box display="flex" alignItems="center" width="100%">
                {children}
            </Box>
        </ListItemButton>
    );
}
