import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'; // Optional size prop
  color?: string; // Optional color prop
}

const SidebarLoadingspinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium', // Default size
  color = 'currentColor', // Default color (inherits from parent text color)
}) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent border-solid ${sizeClasses[size]}`}
      style={{ borderColor: color, borderTopColor: 'transparent' }}
      role="status"
    ></div>
  );
};

export default SidebarLoadingspinner;