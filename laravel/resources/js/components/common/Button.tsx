import { ReactNode } from 'react';
import { Button as MuiButton } from '@mui/material';
import { Link as InertiaLink } from '@inertiajs/react';

export type ButtonProps = {
    version?: 'primary' | 'secondary' | 'outline';
    text: string;
    onClick?: () => void;
    link?: boolean;
    href?: string;
    icon?: ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    fullWidth?: boolean;
};

const VARIANT_MAP: Record<NonNullable<ButtonProps['version']>, { variant: 'contained' | 'outlined'; color: 'primary' | 'secondary' }> = {
    primary: { variant: 'contained', color: 'primary' },
    secondary: { variant: 'contained', color: 'secondary' },
    outline: { variant: 'outlined', color: 'primary' },
};

export default function Button({
    version = 'primary',
    text,
    onClick,
    link = false,
    href = '#',
    icon,
    className,
    type = 'button',
    disabled = false,
    fullWidth = true,
}: ButtonProps) {
    const { variant, color } = VARIANT_MAP[version];

    if (link && href) {
        return (
            <MuiButton
                LinkComponent={InertiaLink}
                href={href}
                variant={variant}
                color={color}
                className={className}
                endIcon={icon}
                fullWidth={fullWidth}
            >
                {text}
            </MuiButton>
        );
    }

    return (
        <MuiButton
            type={type}
            onClick={onClick}
            variant={variant}
            color={color}
            className={className}
            endIcon={icon}
            disabled={disabled}
            fullWidth={fullWidth}
        >
            {text}
        </MuiButton>
    );
}
