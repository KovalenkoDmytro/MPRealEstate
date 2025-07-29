import { usePage } from "@inertiajs/react";
import { User } from "@/types";

// Extend base props to allow arbitrary keys
interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export function useAuth() {
    const { auth } = usePage<PageProps>().props;
    return auth.user;
}
