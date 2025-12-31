import { Link } from "@inertiajs/react";
import React from "react";

export type ButtonProps = {
    version: 'primary' | 'secondary' | 'outline';
    text: string;
    onClick?: () => void;
    link?: boolean;
    href?: string;
    icon?: React.ReactNode;
    className?: string;
};

export default function Button({
                                   version = 'primary',
                                   text,
                                   onClick,
                                   link = false,
                                   href = '#',
                                   icon,
                                   className,
                               }: ButtonProps) {

    const classes = `btn btn-${version} ${className ? className : ''}`;

    if (link && href) {
        return (
            <Link href={href} className={classes}>
                {icon && <span className="btn-icon">{icon}</span>}
                {text}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={classes}
        >
            {icon && <span className="btn-icon">{icon}</span>}
            {text}
        </button>
    );
}
