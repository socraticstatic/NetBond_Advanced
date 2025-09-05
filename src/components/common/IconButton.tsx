import { ReactNode } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
  disabled?: boolean;
}

export function IconButton({
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  className = '',
  title,
  disabled = false
}: IconButtonProps) {
  const variantClasses = {
    primary: 'bg-brand-blue text-white hover:bg-brand-darkBlue',
    secondary: 'bg-white text-gray-600 hover:bg-gray-50',
    success: 'bg-complementary-green/10 text-complementary-green hover:bg-complementary-green/20',
    danger: 'bg-red-100 text-red-600 hover:bg-red-200',
    ghost: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        rounded-full transition-colors
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className={iconSizes[size]}>{icon}</div>
    </button>
  );
}