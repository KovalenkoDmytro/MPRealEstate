import React, {ReactNode} from "react";

type StatCardProps = {
    label: string;
    value: string | number;
    detail?: string;
    icon?: ReactNode;
    iconBgColor?: string;
    backgroundColor?: string;
    borderColor?: string;
};

export default function StatCard({label, value, detail, icon, iconBgColor, backgroundColor = '#FFFFFF' , borderColor = '#E5E7EB'}: StatCardProps) {
    return (
        <div className="stat-card" style={{backgroundColor: backgroundColor, borderColor: borderColor}}>
            <div className="stat-container">
                <div className="stat-content">
                    <span className="stat-label">{label}</span>
                    <span className="stat-value">{value}</span>
                </div>
                {icon && <div className="stat-icon-box" style={{backgroundColor: iconBgColor}}>
                    {icon}
                </div>}

            </div>

            {detail && <span className="stat-detail">{detail}</span>}

        </div>
    );
}
