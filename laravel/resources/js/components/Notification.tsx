import { useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Notification = () => {
    const {
        notificationMessage,
        notificationType,
        clearNotification,
    } = useNotification();
    useEffect(() => {
        if (notificationMessage) {
            const options = { autoClose: 3000 };
            switch (notificationType) {
                case 'success':
                    toast.success(notificationMessage, options);
                    break;
                case 'error':
                    toast.error(notificationMessage, options);
                    break;
                case 'warning':
                    toast.warning(notificationMessage, options);
                    break;
                case 'info':
                default:
                    toast.info(notificationMessage, options);
                    break;
            }
            const timer = setTimeout(() => clearNotification(), 3000);
            return () => clearTimeout(timer);
        }}, [notificationMessage]);
    return <ToastContainer position="top-right" newestOnTop pauseOnFocusLoss />;
};

