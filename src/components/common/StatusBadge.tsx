interface StatusBadgeProps {
  status: 'active' | 'Active' | 'inactive' | 'Inactive' | 'suspended' | 'Suspended' | 'Pending' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const statusStyles = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    suspended: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200'
  };

  const statusLabels = {
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    pending: 'Pending'
  };

  const style = statusStyles[normalizedStatus as keyof typeof statusStyles] || statusStyles.inactive;
  const label = statusLabels[normalizedStatus as keyof typeof statusLabels] || status;

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium border ${style} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        normalizedStatus === 'active' ? 'bg-green-500' :
        normalizedStatus === 'inactive' ? 'bg-gray-500' :
        normalizedStatus === 'suspended' ? 'bg-red-500' :
        'bg-amber-500'
      }`} />
      {label}
    </span>
  );
}
