import React, {ReactNode} from "react";

type StatCardProps = {
    label: string;
    value: string | number;
    detail?: string;
    icon?: ReactNode;
    iconColor?: string;
};

export default function StatCard({label, value, detail, icon, iconColor}: StatCardProps) {
    return (
        <div className="stat-card">
            <div className="stat-container">
                <div className="stat-content">
                    <span className="stat-label">{label}</span>
                    <span className="stat-value">{value}</span>
                </div>
                {icon && <div className="stat-icon-box" style={{backgroundColor: iconColor}}>
                    {icon}
                </div>}

            </div>

            {detail && <span className="stat-detail">{detail}</span>}

        </div>
    );
}
