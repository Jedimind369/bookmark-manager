import React from 'react';
import { TextAreaProps } from '../types';

const TextArea: React.FC<TextAreaProps> = ({ placeholder, value, onChange, className = '' }) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default TextArea;