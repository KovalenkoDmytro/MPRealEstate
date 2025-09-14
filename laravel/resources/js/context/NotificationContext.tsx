import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "info" | "warning";
type NotificationContextType = {
    notificationMessage: string | null;
    notificationType: NotificationType;
    showNotification: (message: string, type?: NotificationType) => void;
    clearNotification: () => void;
    setRedirectNotification: (message: string, type?: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Storage key for one-time “flash” messages after redirect
const FLASH_KEY = "flashNotification";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<NotificationType>("info");

    const showNotification = (message: string, type: NotificationType = "info") => {
        setNotificationMessage(message);
        setNotificationType(type);
    };

    const clearNotification = () => {
        setNotificationMessage(null);
    };

    // 1-time flash setter: used BEFORE redirect
    const setRedirectNotification = (message: string, type: NotificationType = "info") => {
        sessionStorage.setItem(
            FLASH_KEY,
            JSON.stringify({ message, type, expiresAt: Date.now() + 60_000 }) // 1-minute TTL
        );
    };

    // On first mount, check if there’s a flash message and show it
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(FLASH_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as { message: string; type: NotificationType; expiresAt?: number };
            // Optional TTL guard
            if (!parsed.expiresAt || parsed.expiresAt > Date.now()) {
                showNotification(parsed.message, parsed.type);
            }
        } finally {
            sessionStorage.removeItem(FLASH_KEY); // always clear
        }
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notificationMessage, notificationType, showNotification, clearNotification, setRedirectNotification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification must be used within <NotificationProvider>");
    return ctx;
};
