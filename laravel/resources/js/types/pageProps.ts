import type { User } from "./user";

export interface NotificationItem {
    id: string
    title: string
    body: string
    url?: string | null
    read_at?: string | null
    created_at: string
}

export interface FlashMessages {
    success: string | null
    error: string | null
    info: string | null
    warning: string | null
}

export type PageErrorBag = Record<string, unknown>;

export interface PageProps {
    [key: string]: unknown

    auth: {
        user: User
    }
    mustVerifyEmail? : boolean,
    status? : string|null,
    errors: PageErrorBag
    flash: FlashMessages
    notifications?: {
        items: NotificationItem[]
        unread_count: number
    }
}
