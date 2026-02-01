import React from 'react';

export type BadgeProps = {
    version?: 'primary' | 'notification' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';
    text: string;
    size?: 'default' | 'small';
};

export default function Badge({
                                  version = 'primary',
                                  text,
                                  size = 'default'
                              }: BadgeProps) {

    // Append size class if small
    const sizeClass = size === 'small' ? 'badge-small' : '';
    const classes = `badge badge-${version} ${sizeClass}`;

    return (
        <div className={classes}>
            {text}
        </div>
    )
}
