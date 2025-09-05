import {createContext, ReactNode, useContext, useMemo} from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';

type ToastAPI = {
    notify: (msg: string, opts?: ToastOptions) => void;
    success: (msg: string, opts?: ToastOptions) => void;
    error: (msg: string, opts?: ToastOptions) => void;
    info: (msg: string, opts?: ToastOptions) => void;
    warning: (msg: string, opts?: ToastOptions) => void;
};

const ToastCtx = createContext<ToastAPI | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const api = useMemo<ToastAPI>(() => ({
        notify: (msg, opts) => toast(msg, opts),
        success: (msg, opts) => toast.success(msg, opts),
        error: (msg, opts) => toast.error(msg, opts),
        info: (msg, opts) => toast.info(msg, opts),
        warning: (msg, opts) => toast.warning(msg, opts),
    }), []);

    return (
        <ToastCtx.Provider value={api}>
            {children}
            <ToastContainer position="top-right" autoClose={3000} newestOnTop pauseOnFocusLoss />
        </ToastCtx.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastCtx);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}
