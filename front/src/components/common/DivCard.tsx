import React from "react";
import { Card as BCard } from "react-bootstrap";
import "../../assets/styles/cards.css";

// Interface base para cards que necesitan children
// interface BaseCardProps {
//   children: React.ReactNode;
//   className?: string;
// }

interface SimpleCardProps {
  title?: string;
  subtitle?: string;
  withHeader?: boolean;
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// Interface separada para MetricCard (sin extender BaseCardProps)
interface MetricCardProps {
  title: string;
  value: string | number | undefined;
  icon?: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger";
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  className?: string;
}

// Card Simple 6x6
export const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  subtitle,
  children,
  withHeader,
  footer,
  className = "",
}) => {
  return (
    <BCard className={`custom-card ${className}`}>
      {withHeader && (
        <BCard.Header className="custom-card-header">
          {title && <BCard.Title>{title}</BCard.Title>}
          {subtitle && (
            <BCard.Subtitle className="mb-2 text-muted">
              {subtitle}
            </BCard.Subtitle>
          )}
        </BCard.Header>
      )}
      <BCard.Body className="custom-card-body">{children}</BCard.Body>
      {footer && (
        <BCard.Footer className="custom-card-footer">{footer}</BCard.Footer>
      )}
    </BCard>
  );
};

// Card Métrica con Color
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  variant = "primary",
  change,
  className = "",
}) => {
  return (
    <BCard className={`metric-card metric-card-${variant} ${className}`}>
      <BCard.Body>
        <div className="metric-card-content">
          <div className="metric-card-info">
            <h6 className="metric-card-title">{title}</h6>
            <h3 className="metric-card-value">{value}</h3>
            {change && (
              <div className={`metric-card-change ${change.type}`}>
                {change.type === "increase" ? "↑" : "↓"}{" "}
                {Math.abs(change.value)}%
              </div>
            )}
          </div>
          {icon && <div className="metric-card-icon">{icon}</div>}
        </div>
      </BCard.Body>
    </BCard>
  );
};
