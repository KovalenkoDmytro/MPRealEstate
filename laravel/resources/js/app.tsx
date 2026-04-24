import '../css/app.css';
import './bootstrap';

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from "@/context/NotificationContext";
import { Notification } from "@/components/Notification";
import "@/../scss/main.scss"


import theme from './theme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pages = import.meta.glob<{ default: React.ComponentType<any> }>('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return page().then((module) => module.default);
    },
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
        color: '#40ff00',
    },
}).then();
