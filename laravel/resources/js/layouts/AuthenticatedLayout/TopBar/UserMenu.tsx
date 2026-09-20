import React, { useState } from 'react';
import {
    Box,
    Avatar,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { Person, Logout, Settings } from '@mui/icons-material';
import { Link, router } from '@inertiajs/react';
import GlassPopover from '@/design/GlassPopover';

interface User {
    name: string;
    role?: string;
    [key: string]: any;
}

interface UserMenuProps {
    user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 1 }} // Reduced margin slightly for tighter fit
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: 14,
                                fontWeight: 600
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>

            <GlassPopover
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                width="auto"
                arrowOffset={14}
                paperSx={{ minWidth: 180, '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 } }}
            >
                <Box px={2} py={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                        {user.name}
                    </Typography>
                    {user.role && (
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {user.role}
                        </Typography>
                    )}
                </Box>
                <Divider />

                <MenuItem href={route('profile.edit')}>
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>

                <MenuItem
                    onClick={() => router.post(route('logout'))}
                    sx={{ color: 'error.main' }}
                >
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </GlassPopover>
        </React.Fragment>
    );
}
