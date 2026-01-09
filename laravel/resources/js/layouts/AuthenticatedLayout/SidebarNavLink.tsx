import {InertiaLinkProps, Link} from '@inertiajs/react';
import {ListItemButton, Box} from '@mui/material';
import React, {ReactNode} from 'react';
import theme from "@/theme";

interface NavLinkProps extends InertiaLinkProps {
    active?: boolean;
    children: ReactNode;
}

export default function SidebarNavLink({active = false, className = '', children, ...props}: NavLinkProps) {

    const {action, ...inertiaProps} = props as any;

    return (
        <ListItemButton
            component={Link as any}
            href={props.href}
            {...inertiaProps}
            selected={active}
            sx={{
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                mb: 1,
                transition: 'all 0.2s ease-in-out',
                color: 'rgba(255, 255, 255, 0.7)',

                // 2. Hover State
                '&:hover': {
                    backgroundColor: 'rgba(203, 154, 159, 0.08)',
                    color: '#fff',
                    '& .MuiListItemIcon-root': {color: '#fff'},

                    'svg path': {
                        stroke: '#fff',
                    },

                    'span': {
                        color: '#fff',
                    },
                },

                // 3. Active (Selected) State
                '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: 'rgba(203, 154, 159, 0.25)',
                    },


                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        height: '60%',
                        width: '4px',
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: '#fff',
                    }
                },

                '&.Mui-selected span': {
                    fontWeight: 600,
                    color: '#fff',
                },

                'span': {
                    marginLeft: '16px',
                    fontWeight: 500,
                    color: theme.palette.text.rosyPink,
                },

                '&.Mui-selected svg path': {
                    stroke: '#fff',
                },

            }}
        >
            <Box display="flex" alignItems="center" width="100%">
                {children}
            </Box>
        </ListItemButton>
    );
}
