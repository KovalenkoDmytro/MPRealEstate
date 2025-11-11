import { usePage } from "@inertiajs/react";
import {PageProps} from "@/types";

export function useAuth() {
    const { auth } = usePage<PageProps>().props;
    return auth.user;
}
