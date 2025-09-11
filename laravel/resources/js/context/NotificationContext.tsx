import { createContext, useContext, useState, ReactNode } from 'react';
type NotificationType = 'success' | 'error' | 'info' | 'warning';
type NotificationContextType = {
    notificationMessage: string | null;
    notificationType: NotificationType;
    showNotification: (message: string, type?: NotificationType) => void;
    clearNotification: () => void;
};
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<NotificationType>('info');
    const showNotification = (message: string, type: NotificationType = 'info') => {
        setNotificationMessage(message);
        setNotificationType(type);
    };
    const clearNotification = () => {
        setNotificationMessage(null);
    };
    return (
        <NotificationContext.Provider
            value={{ notificationMessage, notificationType, showNotification, clearNotification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotification must be used within <NotificationProvider>');
    return ctx;
};
