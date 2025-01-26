// src/components/ui/Button.jsx
import React from 'react';

export const Button = ({
  children,
  className = '',
  disabled = false,
  onClick,
  type = 'button'
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;