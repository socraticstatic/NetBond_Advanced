import { ReactNode, memo, forwardRef, isValidElement, ComponentType } from 'react';

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode | ComponentType<any>;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  icon,
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  size = 'md',
}, ref) => {
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
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };

  const iconSizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const renderIcon = () => {
    if (!icon) return null;

    if (isValidElement(icon)) {
      return <span className="mr-2">{icon}</span>;
    }

    if (typeof icon === 'function') {
      const IconComponent = icon as ComponentType<any>;
      return <IconComponent className={`${iconSizeClass} mr-2`} />;
    }

    return null;
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
      {renderIcon()}
      {children}
    </button>
  );
});

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);