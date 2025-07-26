import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

/**
 * Global type declarations for the application
 * Extends window and module interfaces with application-specific properties
 */
declare global {
    /**
     * Extends the Window interface with application-specific properties
     */
    interface Window {
        /** Axios instance for making HTTP requests */
        axios: AxiosInstance;
    }

    /* eslint-disable no-var */
    /** Global route function from Ziggy for generating URLs */
    var route: typeof ziggyRoute;
}

/**
 * Extends Inertia.js PageProps interface with application-specific properties
 */
declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
