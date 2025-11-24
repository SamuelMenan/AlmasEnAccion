import React from 'react';
import { InputProps } from '../../types/components';

export const Input: React.FC<InputProps> = ({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  className = '',
  min,
  max,
  step
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const inputClasses = `
    w-full px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `.trim();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          className={inputClasses}
          rows={4}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          className={inputClasses}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
