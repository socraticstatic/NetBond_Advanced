import { ReactNode, memo, forwardRef } from 'react';

interface ButtonProps {
  children: ReactNode;
  icon?: any; // Simplified to avoid importing all of lucide-react
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
}

// Optimized button component with better performance
const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  icon: Icon,
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  size = 'md',
}, ref) => {
  // Pre-computed style classes to avoid repeated calculations
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors';
  
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };
  
  const variantStyles = {
    primary: 'bg-[#003184] text-white hover:bg-[#002255] focus:ring-[#003184]',
    secondary: 'bg-white text-[#003184] border border-[#003184] hover:bg-[#f0f4fa]',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {Icon && <Icon className="h-5 w-5 mr-2" />}
      {children}
    </button>
  );
});

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);