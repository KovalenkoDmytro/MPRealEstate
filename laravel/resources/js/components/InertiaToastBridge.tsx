// resources/js/components/InertiaToastBridge.tsx
import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/providers/ToastProvider';

export default function InertiaToastBridge() {
    const toast = useToast();
    const last = useRef<string>("");

    const emitFromFlash = () => {
        const flash = (router as any).page?.props?.flash ?? {};
        const { success, error, info, warning } = flash as Record<string, string | undefined>;

        const key = [success, error, info, warning].filter(Boolean).join('|');
        if (key && key !== last.current) {
            if (success) toast.success(success);
            if (error)   toast.error(error);
            if (info)    toast.info(info);
            if (warning) toast.warning(warning);
            last.current = key;
        }
    };

    useEffect(() => {
        // fire once on mount (handles first page render after redirect)
        emitFromFlash();
        // update after every Inertia navigation completes
        const off = router.on('finish', emitFromFlash);
        return () => off();
    }, []);

    return null;
}
