import {User} from '@/types'

/**
 * Base props interface for all Inertia.js pages
 * Contains authentication information and other common properties
 * @template T - Additional page-specific props
 */
export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Authentication information */
    auth: {
        /** Currently authenticated user */
        user: User;
    };
}

/**
 * Helper type that merges page-specific props with base PageProps
 * @template T - Page-specific props
 */
export type MergedProps<T extends Record<string, unknown>> = T & PageProps<T>;
