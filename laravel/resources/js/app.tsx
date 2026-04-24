import '../css/app.css';
import './bootstrap';

import React from 'react';
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import type { Page } from '@inertiajs/core';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from '@/context/NotificationContext';
import { Notification } from '@/components/Notification';
import '@/../scss/main.scss';

import theme from './theme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function getInitialPage(): Page {
    const appElement = document.getElementById('app');
    const serializedPage = appElement?.getAttribute('data-page');

    if (!serializedPage) {
        throw new Error('Inertia initial page payload was not found on #app.');
    }

    return JSON.parse(serializedPage) as Page;
}

createInertiaApp({
    page: getInitialPage(),
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) =>
        (await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        )) as ResolvedComponent,
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
