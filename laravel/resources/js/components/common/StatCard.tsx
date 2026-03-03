import React, {ReactNode} from "react";
import theme from "@/theme";

type StatCardProps = {
    label: string;
    value: string | number;
    detail?: string;
    icon?: ReactNode;
    iconBgColor?: string;
    background?: string;
    borderColor?: string;
    badgeTextColor?: string;
    badgeBgColor?: string;
};

export default function StatCard({label, value, detail, icon, iconBgColor = theme.palette.primary.main, background = '#FFFFFF' , borderColor = '#E5E7EB', badgeTextColor, badgeBgColor}: StatCardProps) {
    return (
        <div className="stat-card" style={{background: background, borderColor: borderColor}}>
            <div className="stat-container">
                <div className="stat-content">
                    <span className="stat-label">{label}</span>
                    <span className="stat-value">{value}</span>
                </div>
                {icon && <div className="stat-icon-box" style={{background: iconBgColor}}>
                    {icon}
                </div>}

            </div>
            {detail && <span className="stat-detail" style={{background : badgeBgColor, color: badgeTextColor}}>{detail}</span>}
        </div>
    );
}
