import React, { ReactNode } from 'react';
import theme from "@/theme";

export type IconContainerProps = {
    bgColor?: string;
    children: ReactNode
};

export default function IconContainer({bgColor = theme.palette.primary.main, children}: IconContainerProps) {

    return (
        <div className="icon-container" style={{backgroundColor: bgColor}}>
            {children}
        </div>
    )
}
