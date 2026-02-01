import {Link} from "@mui/material";

export type ButtonProps = {
    version?: 'primary' | 'secondary' | 'outline';
    text: string;
    onClick?: () => void;
    link?: boolean;
    href?: string;
    icon?: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
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
            type={type}
            onClick={onClick}
            className={classes}
            disabled={disabled}
        >
            {text}
            {icon && <span className="btn-icon" style={{ marginLeft: '8px' }}>{icon}</span>}
        </button>
    );
}
