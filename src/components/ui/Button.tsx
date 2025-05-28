import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Size classes
  const sizeClasses = {
    sm: 'text-xs h-8 px-3 py-1',
    md: 'text-sm h-10 px-4 py-2',
    lg: 'text-base h-12 px-6 py-3',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Icon spacing
  const iconSpacing = icon && children ? 'space-x-2' : '';

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${iconSpacing} ${className}`;

  return (
    <button className={classes} {...props}>
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;