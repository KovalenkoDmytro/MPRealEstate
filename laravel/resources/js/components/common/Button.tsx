import { Link } from "@inertiajs/react";
import React from "react";

export type ButtonProps = {
    version: 'primary' | 'secondary' | 'outline';
    text: string;
    onClick?: () => void;
    link?: boolean;
    href?: string;
};

export default function Button({
                                   version = 'primary',
                                   text,
                                   onClick,
                                   link = false,
                                   href = '#'
                               }: ButtonProps) {

    const classes = `btn btn-${version}`;

    if (link && href) {
        return (
            <Link href={href} className={classes}>
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
            {text}
        </button>
    );
}
