import { Fragment, MouseEvent, useMemo, useState } from "react"
import { usePage, router } from "@inertiajs/react"
import { PageProps } from "@/types";
import {
    IconButton,
    Badge,
    Menu,
    Typography,
    Box,
    Button,
    List,
    ListItem,
    Divider,
    Link as MuiLink
} from "@mui/material";
import {
    Circle as CircleIcon
} from "@mui/icons-material";
import IconNotificationBell from "@/icons/IconNotificationBell";

const NotificationBell = () => {
    const { props } = usePage<PageProps>()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Initial state from props
    // We keep local state for optimistic updates
    const initialNotif = useMemo(() => {
        return props.notifications ?? { unread_count: 0, items: [] }
    }, [props.notifications])

    // In a real optimistic scenario, we'd need a robust way to merge props + local state.
    // For now, simpler: we blindly trust props but avoid full reloads (preserveScroll).
    // The issue with router.reload is it might be slow.
    // Ideally we update the UI *then* call the server.
    // Since props are immutable, we can't "edit" initialNotif.
    // We'll stick to router calls for now but with preserveState/preserveScroll.

    const items = initialNotif.items || []
    const unreadCount = initialNotif.unread_count || 0

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const refresh = () => {
        router.reload({ only: ["notifications"], preserveUrl: true })
    }

    const markOne = (id: string) => {
        // Optimistic update could go here if we had local state for items
        router.post(route("notifications.readOne", id), {}, {
            preserveUrl: true,
            onSuccess: refresh
        })
    }

    const markAll = () => {
        router.post(route("notifications.readAll"), {}, {
            preserveUrl: true,
            onSuccess: refresh
        })
    }

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="large"
                aria-controls={open ? 'notification-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                color="inherit"
            >
                <Badge badgeContent={unreadCount} color="error">
                    <IconNotificationBell />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                id="notification-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        width: 400,
                        maxHeight: 500,
                        overflow: 'visible',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 28, // Center-ish above bell
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={markAll}>
                            Mark all read
                        </Button>
                    )}
                </Box>

                <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                    {items.length === 0 && (
                        <Box p={3} textAlign="center">
                            <Typography variant="body2" color="text.secondary">
                                No notifications yet
                            </Typography>
                        </Box>
                    )}

                    {items.map((n) => (
                        <Fragment key={n.id}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    bgcolor: !n.read_at ? 'action.hover' : 'inherit',
                                    flexDirection: 'column',
                                    alignItems: 'stretch'
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" width="100%">
                                    <Box flex={1}>
                                        <Typography variant="subtitle2" component="div">
                                            {n.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {n.body}
                                        </Typography>
                                    </Box>
                                    {!n.read_at && (
                                        <CircleIcon color="primary" sx={{ width: 10, height: 10, mt: 1, ml: 1 }} />
                                    )}
                                </Box>

                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Typography variant="caption" color="text.disabled">
                                        {new Date(n.created_at).toLocaleString()}
                                    </Typography>
                                    <Box>
                                        {n.url && (
                                            <MuiLink href={n.url} target="_blank" underline="hover" variant="caption" sx={{ mr: 1 }}>
                                                Open
                                            </MuiLink>
                                        )}
                                        {!n.read_at && (
                                            <MuiLink
                                                component="button"
                                                variant="caption"
                                                onClick={() => markOne(n.id)}
                                                underline="hover"
                                            >
                                                Mark read
                                            </MuiLink>
                                        )}
                                    </Box>
                                </Box>
                            </ListItem>
                            <Divider component="li" />
                        </Fragment>
                    ))}
                </List>
            </Menu>
        </>
    )
}

export default NotificationBell
