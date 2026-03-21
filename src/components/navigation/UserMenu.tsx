import { User } from 'lucide-react';

interface UserMenuProps {
  name: string;
  role: string;
  account: string;
  avatar?: string;
  onClick: () => void;
}

export function UserMenu({ name, onClick }: UserMenuProps) {
  return (
    <div className="relative flex items-center">
      <button
        onClick={onClick}
        className="flex items-center justify-center h-9 w-9 text-fw-heading hover:text-fw-body transition-colors duration-200"
        aria-label={`Open user menu ${name}`}
      >
        <User className="h-5 w-5" />
      </button>
    </div>
  );
}
