// src/components/ui/Alert.jsx
import React from 'react';
import PropTypes from 'prop-types';

export const AlertTitle = ({ children, className = '', ...props }) => (
  <h5
    className={`font-medium mb-1 ${className}`}
    {...props}
  >
    {children}
  </h5>
);

export const AlertDescription = ({ children, className = '', ...props }) => (
  <div
    className={`text-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const Alert = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-gray-50 border-gray-200 text-gray-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div
      role="alert"
      className={`p-4 rounded-lg border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'destructive', 'warning', 'info', 'success']),
  className: PropTypes.string
};

AlertTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

AlertDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Object.assign(Alert, {
  Title: AlertTitle,
  Description: AlertDescription
});