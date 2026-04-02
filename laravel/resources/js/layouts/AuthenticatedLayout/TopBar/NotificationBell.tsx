import { Fragment, MouseEvent, useEffect, useState } from "react"
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
import { api } from "@/axios";
import { NotificationItem } from "@/types";

type NotificationSummary = {
    unread_count: number;
    items: NotificationItem[];
};

const NotificationBell = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<NotificationSummary>({
        unread_count: 0,
        items: [],
    });

    const open = Boolean(anchorEl);
    const items = notifications.items;
    const unreadCount = notifications.unread_count;

    const loadNotifications = async () => {
        try {
            const response = await api.get<NotificationSummary>(route("notifications.index"));
            setNotifications(response.data);
        } catch {
            setNotifications({ unread_count: 0, items: [] });
        }
    };

    useEffect(() => {
        void loadNotifications();
    }, []);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markOne = async (id: string) => {
        try {
            await api.post(route("notifications.readOne", id));
            setNotifications((prev) => ({
                unread_count: Math.max(0, prev.unread_count - 1),
                items: prev.items.map((item) => (
                    item.id === id ? { ...item, read_at: item.read_at ?? new Date().toISOString() } : item
                )),
            }));
        } catch {
            void loadNotifications();
        }
    };

    const markAll = async () => {
        try {
            await api.post(route("notifications.readAll"));
            setNotifications((prev) => ({
                unread_count: 0,
                items: prev.items.map((item) => ({ ...item, read_at: item.read_at ?? new Date().toISOString() })),
            }));
        } catch {
            void loadNotifications();
        }
    };

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
