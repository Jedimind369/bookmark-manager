import React, { ChangeEvent } from 'react';
import { InputProps } from '../types';

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  required = false
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={`w-full p-2 border rounded ${className}`}
    />
  );
};