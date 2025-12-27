import '../css/app.css';
import './bootstrap';

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from "@/context/NotificationContext";
import { Notification } from "@/components/Notification";
import "@/../scss/main.scss"


import theme from './theme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <React.StrictMode>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <NotificationProvider>
                        <Notification />
                        <App {...props} />
                    </NotificationProvider>
                </ThemeProvider>
            </React.StrictMode>
        );
    },
    progress: {
        color: '#4b5563',
    },
}).then();
