import { Chip } from '@mui/material';
import { primary, accent, neutral, success, warning, error, radius } from '@/design/tokens';

export type BadgeProps = {
    version?: 'primary' | 'notification' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';
    text: string;
    size?: 'default' | 'small';
};

const VARIANT_STYLES: Record<NonNullable<BadgeProps['version']>, { bg: string; color: string }> = {
    primary: { bg: primary[600], color: '#fff' },
    notification: { bg: accent[100], color: accent[700] },
    accent: { bg: accent[50], color: accent[700] },
    neutral: { bg: neutral[100], color: neutral[700] },
    success: { bg: success[50], color: success[700] },
    warning: { bg: warning[50], color: warning[700] },
    error: { bg: error[50], color: error[700] },
};

export default function Badge({ version = 'primary', text, size = 'default' }: BadgeProps) {
    const { bg, color } = VARIANT_STYLES[version];

    return (
        <Chip
            label={text}
            size={size === 'small' ? 'small' : 'medium'}
            sx={{
                bgcolor: bg,
                color,
                fontWeight: 600,
                borderRadius: radius.pill,
                ...(size === 'small' && {
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }),
            }}
        />
    );
}
