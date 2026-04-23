import { Fragment, MouseEvent, useEffect, useState } from "react"
import {
    IconButton,
    Badge,
    Menu,
    Typography,
    Box,
    List,
    ListItem,
    Divider,
    Link as MuiLink,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IconNotificationBell from "@/icons/IconNotificationBell";
import { api } from "@/axios";
import { NotificationItem } from "@/types";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";

type NotificationSummary = {
    unread_count: number;
    items: NotificationItem[];
};

const NotificationBell = () => {
    const theme = useTheme();
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

    const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const markOne = async (id: string) => {
        try {
            await api.post(route("notifications.readOne", id));
            setNotifications((prev) => ({
                unread_count: Math.max(0, prev.unread_count - 1),
                items: prev.items.map((item) =>
                    item.id === id ? { ...item, read_at: item.read_at ?? new Date().toISOString() } : item
                ),
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
            <IconContainer bgColor={theme.palette.text.rosyPink}>
                <IconButton
                    onClick={handleClick}
                    size="large"
                    aria-controls={open ? "notification-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    color="inherit"
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <IconNotificationBell />
                    </Badge>
                </IconButton>
            </IconContainer>


            <Menu
                anchorEl={anchorEl}
                id="notification-menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            width: 400,
                            maxHeight: 500,
                            overflow: "visible",
                            mt: 1.5,
                            borderRadius: theme.shape.borderRadius,
                            border: `1px solid ${theme.palette.border.main}`,
                            backgroundColor: theme.palette.background.white,
                            boxShadow: theme.shape.boxShadow,
                            "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 28,
                                width: 10,
                                height: 10,
                                bgcolor: theme.palette.background.white,
                                border: `1px solid ${theme.palette.border.main}`,
                                borderBottom: "none",
                                borderRight: "none",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        px: 2.5,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: `1px solid ${theme.palette.border.main}`,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            text="Mark all read"
                            version="outline"
                            onClick={markAll}
                        />
                    )}
                </Box>

                {/* List */}
                <List sx={{ p: 0, maxHeight: 400, overflow: "auto" }}>
                    {items.length === 0 && (
                        <Box p={4} textAlign="center">
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
                                    px: 2.5,
                                    py: 1.5,
                                    bgcolor: !n.read_at ? theme.palette.background.default : "transparent",
                                    flexDirection: "column",
                                    alignItems: "stretch",
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" width="100%">
                                    <Box flex={1}>
                                        <Typography variant="subtitle2" component="div" fontWeight={!n.read_at ? 600 : 400}>
                                            {n.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {n.body}
                                        </Typography>
                                    </Box>
                                    {!n.read_at && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                bgcolor: theme.palette.primary.main,
                                                mt: 0.8,
                                                ml: 1.5,
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Typography variant="caption" color="text.disabled">
                                        {new Date(n.created_at).toLocaleString()}
                                    </Typography>
                                    <Box display="flex" gap={1.5}>
                                        {n.url && (
                                            <MuiLink href={n.url} target="_blank" variant="caption">
                                                Open
                                            </MuiLink>
                                        )}
                                        {!n.read_at && (
                                            <MuiLink
                                                component="button"
                                                variant="caption"
                                                onClick={() => markOne(n.id)}
                                            >
                                                Mark read
                                            </MuiLink>
                                        )}
                                    </Box>
                                </Box>
                            </ListItem>
                            <Divider sx={{ borderColor: theme.palette.border.main }} />
                        </Fragment>
                    ))}
                </List>
            </Menu>
        </>
    );
};

export default NotificationBell;
