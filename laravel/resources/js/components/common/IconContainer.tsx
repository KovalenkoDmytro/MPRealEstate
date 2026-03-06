import React, { ReactNode } from 'react';
import theme from "@/theme";

export type BadgeProps = {
    bgColor?: string;
    children: ReactNode
};

export default function IconContainer({bgColor = theme.palette.primary.main, children}: BadgeProps) {

    return (
        <div className="icon-container" style={{backgroundColor: bgColor}}>
            {children}
        </div>
    )
}
