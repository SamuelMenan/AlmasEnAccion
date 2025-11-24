import React from 'react';
import { CardProps } from '../../types/components';

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  className = '',
  children
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 ${className}`}>
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
          <div className="text-primary-600">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};