
import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  className = '',
  disabled = false,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        px-4 
        py-2 
        bg-blue-500 
        text-white 
        rounded 
        hover:bg-blue-600 
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
};

export default Button;
