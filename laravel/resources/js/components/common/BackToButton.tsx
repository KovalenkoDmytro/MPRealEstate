import { Link as MuiLink } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { router } from "@inertiajs/react";
import IconArrowLeft from "@/icons/IconArrowLeft";
import IconContainer from "@/components/common/IconContainer";

type BackToButtonProps = {
    label: string;
    fallbackHref?: string;
    sx?: SxProps<Theme>;
    className?: string;
};

export default function BackToButton({
    label,
    fallbackHref,
    sx,
    className,
}: BackToButtonProps) {
    const handleBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (typeof window !== "undefined") {
            const hasHistory = window.history.length > 1;
            const hasReferrer = !!document.referrer;

            if (hasHistory && hasReferrer) {
                try {
                    const referrerOrigin = new URL(document.referrer).origin;
                    if (referrerOrigin === window.location.origin) {
                        window.history.back();
                        return;
                    }
                } catch {
                    // If referrer cannot be parsed, ignore and use fallback below.
                }
            }
        }

        if (fallbackHref) {
            router.visit(fallbackHref);
        }
    };

    return (
        <MuiLink
            href={fallbackHref ?? "#"}
            onClick={handleBack}
            className={className}
            sx={{
                mb: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                color: "text.primary",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                    color: "primary.main",
                    textDecoration: "none",
                },
                ...sx,
            }}
        >
            <IconContainer>
                <IconArrowLeft />
            </IconContainer>

            {`Back to ${label}`}
        </MuiLink>
    );
}
