import React, { useEffect, useMemo, useRef, useState } from "react"
import { usePage, router } from "@inertiajs/react"

interface NotificationItem {
    id: string
    title: string
    body: string,
    url?: string | null
    read_at?: string | null
    created_at: string
}

interface NotificationsProp {
    unread_count: number
    items: NotificationItem[]
}

interface PageProps {
    notifications?: NotificationsProp
    [key: string]: any
}

const NotificationBell: React.FC = () => {
    const { props } = usePage<PageProps>()
    console.log(props)
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const notif = useMemo<NotificationsProp>(
        () =>
            props.notifications ?? {
                unread_count: 0,
                items: [],
            },
        [props.notifications]
    )

    const items = notif.items ?? []
    const unreadCount = notif.unread_count ?? 0

    function refresh() {
        router.reload({ only: ["notifications"], preserveScroll: true })
    }

    function markOne(id: string) {
        router.post(route("notifications.readOne", id), {}, { onSuccess: refresh })
    }

    function markAll() {
        router.post(route("notifications.readAll"), {}, { onSuccess: refresh })
    }

    // Close on outside click
    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (open && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("click", onClickOutside)
        return () => document.removeEventListener("click", onClickOutside)
    }, [open])

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setOpen(!open)} className="relative inline-flex items-center">
                {/* Bell icon */}
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M14.857 17.082A23.848 23.848 0 0112 17.25c-2.486
            0-4.865-.362-6.857-1.018A2.25 2.25
            0 013 14.107V13.5a6.75 6.75 0
            0113.5 0v.607a2.25 2.25 0
            01-1.643 2.975zM9 20.25h6"
                    />
                </svg>

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <div className="px-3 py-2 flex items-center justify-between border-b">
                        <span className="font-semibold">Notifications</span>
                        {unreadCount > 0 && (
                            <button onClick={markAll} className="text-sm text-blue-600 hover:underline">
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <ul className="max-h-96 overflow-y-auto divide-y">
                        {items.length === 0 && (
                            <li className="p-4 text-sm text-gray-500">No notifications yet.</li>
                        )}

                        {items.map((n) => (
                            <li key={n.id} className={`p-3 ${!n.read_at ? "bg-blue-50" : ""}`}>
                                <div className="flex justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">{n.title}</div>
                                        <div className="text-sm text-gray-700">{n.body}</div>
                                        {n.url && (
                                            <a
                                                href={n.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Open
                                            </a>
                                        )}
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(n.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    {!n.read_at && (
                                        <button
                                            onClick={() => markOne(n.id)}
                                            className="text-xs text-blue-600 hover:underline shrink-0"
                                        >
                                            Mark read
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default NotificationBell
