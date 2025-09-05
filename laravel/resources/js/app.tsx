import '../css/app.css';
import './bootstrap';

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import InertiaToastBridge from "@/components/InertiaToastBridge";
import {ToastProvider} from "@/providers/ToastProvider";

const theme = createTheme({
    // You can customize your theme here
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({el, App, props}) {
        const root = createRoot(el);

        root.render(
            <React.StrictMode>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <ToastProvider>
                        <InertiaToastBridge />
                        <App {...props} />
                    </ToastProvider>
                </ThemeProvider>
            </React.StrictMode>
        );
    },
    progress: {
        color: '#4b5563',
    },
}).then();
