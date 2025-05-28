import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showPercentage = true,
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  // Height based on size
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };
  
  // Colors
  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    danger: 'bg-red-600',
  };
  
  // Get color based on percentage
  const getColorClass = () => {
    if (color !== 'primary') return colorClasses[color];
    
    if (percentage < 25) return colorClasses.danger;
    if (percentage < 50) return colorClasses.warning;
    return colorClasses.success;
  };
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-500">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${getColorClass()} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;