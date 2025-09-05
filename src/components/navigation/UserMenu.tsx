import { User } from 'lucide-react';

interface UserMenuProps {
  name: string;
  role: string;
  account: string;
  avatar?: string;
  onClick: () => void;
}

export function UserMenu({ name, role, account, avatar, onClick }: UserMenuProps) {
  return (
    <div className="relative flex items-center pl-6 border-l border-gray-200">
      <div className="flex items-center">
        <div className="hidden md:block mr-4 text-right">
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-500 leading-relaxed">{role}</div>
          <div className="text-xs text-gray-400">{account}</div>
        </div>
        <button 
          onClick={onClick}
          className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009fdb]"
        >
          <span className="sr-only">Open user menu</span>
          {avatar ? (
            <img
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              src={avatar}
              alt={name}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white">
              <span className="font-medium">{name.charAt(0)}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}