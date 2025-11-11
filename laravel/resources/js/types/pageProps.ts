import { User } from "@/types"

interface NotificationItem {
    id: string
    title: string
    body: string
    url?: string | null
    read_at?: string | null
    created_at: string
}

export interface PageProps {
    [key: string]: unknown

    auth: {
        user: User
    }
    errors: {}
    flash: {
        success: string | null
        error: string | null
        info: string | null
        warning: string | null
    }
    notifications: {
        items: NotificationItem[]
        unread_count: number
    }
}
