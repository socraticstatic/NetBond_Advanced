import { useStore } from '../../store/useStore';
import { UserRole } from '../../store/slices/roleSlice';

const ROLES: { id: UserRole; label: string; color: string; activeColor: string }[] = [
  { id: 'user', label: 'User', color: 'text-fw-body', activeColor: 'bg-fw-neutral text-fw-heading' },
  { id: 'admin', label: 'Admin', color: 'text-fw-body', activeColor: 'bg-fw-link text-white' },
  { id: 'super-admin', label: 'Super Admin', color: 'text-fw-body', activeColor: 'bg-fw-purple text-white' },
];

export function DemoRoleSwitcher() {
  const currentRole = useStore(state => state.currentRole);
  const setRole = useStore(state => state.setRole);

  return (
    <div className="fixed bottom-16 right-4 z-[100] flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-fw-base border border-fw-secondary shadow-lg">
      {ROLES.map((role) => {
        const isActive = currentRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => setRole(role.id)}
            className={`px-3 py-1.5 rounded-full text-figma-sm font-medium transition-all duration-200 ${
              isActive ? role.activeColor : `${role.color} hover:bg-fw-wash`
            }`}
          >
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
