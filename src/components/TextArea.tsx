import React, { ChangeEvent } from 'react';
import { TextAreaProps } from '../types';

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 3
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-2 border rounded ${className}`}
    />
  );
};