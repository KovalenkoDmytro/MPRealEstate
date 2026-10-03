import React, { useState } from 'react';
import {
    Box,
    Avatar,
    MenuItem,
    ListItemIcon,
    Divider,
    ButtonBase,
    Tooltip,
    Typography
} from '@mui/material';
import { PersonOutlineRounded, LogoutRounded, SettingsOutlined, KeyboardArrowDownRounded } from '@mui/icons-material';
import { router } from '@inertiajs/react';
import { primary, neutral, error, radius } from '@/design/tokens';
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
                    <ButtonBase
                        onClick={handleClick}
                        aria-label="Account settings"
                        sx={{
                            gap: 1, p: 0.75, pr: { xs: 0.75, sm: 1.25 }, borderRadius: radius.md,
                            bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                            color: 'common.white', textAlign: 'left',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                            '&:focus-visible': { outline: '2px solid rgba(255,255,255,0.7)', outlineOffset: 3 },
                        }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: primary[600],
                                borderRadius: radius.sm,
                                fontSize: 14,
                                fontWeight: 600
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' }, maxWidth: 140 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{user.name}</Typography>
                            {user.role && <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', textTransform: 'capitalize', display: 'block', lineHeight: 1.4 }}>{user.role}</Typography>}
                        </Box>
                        <KeyboardArrowDownRounded sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 18, color: 'rgba(255,255,255,0.55)' }} />
                    </ButtonBase>
                </Tooltip>
            </Box>

            <GlassPopover
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                width={268}
                paperSx={{
                    maxWidth: 'calc(100vw - 24px)', mt: 1, bgcolor: neutral[50], color: neutral[800],
                    borderRadius: radius.lg, border: `1px solid ${neutral[200]}`,
                    backdropFilter: 'none', WebkitBackdropFilter: 'none',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.24)',
                    '&:before': { display: 'none' },
                    '& .MuiMenu-list': { p: 1 },
                    '& .MuiMenuItem-root': { minHeight: 44, px: 1.5, py: 1.25, my: 0.25, borderRadius: radius.sm, fontSize: '0.875rem', fontWeight: 500, gap: 1.25, '&:hover': { bgcolor: primary[50] }, '&.Mui-focusVisible': { bgcolor: primary[50] } },
                    '& .MuiListItemIcon-root': { minWidth: 24, color: neutral[500], '& svg': { fontSize: 20 } },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.5, pb: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: primary[100], color: primary[700], borderRadius: radius.md, fontSize: 16, fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>{user.name}</Typography>
                        {user.role && <Typography variant="caption" sx={{ color: neutral[600], textTransform: 'capitalize', display: 'block', mt: 0.25 }}>{user.role}</Typography>}
                    </Box>
                </Box>
                <Divider sx={{ mx: 1, mb: 1, borderColor: neutral[200] }} />

                <MenuItem component="a" href={route('profile.edit')}>
                    <ListItemIcon>
                        <PersonOutlineRounded />
                    </ListItemIcon>
                    Profile
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <SettingsOutlined />
                    </ListItemIcon>
                    Settings
                </MenuItem>

                <Divider sx={{ mx: 1, my: 1, borderColor: neutral[200] }} />
                <MenuItem
                    onClick={() => router.post(route('logout'))}
                    sx={{ color: error[600], '&:hover': { bgcolor: `${error[50]} !important` }, '&.Mui-focusVisible': { bgcolor: `${error[50]} !important` } }}
                >
                    <ListItemIcon>
                        <LogoutRounded sx={{ color: error[600] }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </GlassPopover>
        </React.Fragment>
    );
}
