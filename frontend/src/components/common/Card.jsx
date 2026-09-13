import React from 'react';

export const Card = ({ title, action, children, className = '', ...props }) => {
  return (
    <div className={`gov-card ${className}`} {...props}>
      {(title || action) && (
        <div className="gov-card-header">
          {title && <h3 className="gov-card-title">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
