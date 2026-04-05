import { useStore } from '../../store/useStore';
import { UserRole } from '../../store/slices/roleSlice';

const ROLES: { id: UserRole; label: string; color: string; activeColor: string }[] = [
  { id: 'user', label: 'User', color: 'text-fw-bodyLight', activeColor: 'bg-fw-heading/10 text-fw-heading' },
  { id: 'admin', label: 'Admin', color: 'text-fw-bodyLight', activeColor: 'bg-fw-heading/10 text-fw-heading' },
  { id: 'super-admin', label: 'Super Admin', color: 'text-fw-bodyLight', activeColor: 'bg-fw-heading/10 text-fw-heading' },
];

export function DemoRoleSwitcher() {
  const currentRole = useStore(state => state.currentRole);
  const setRole = useStore(state => state.setRole);

  return (
    <div className="fixed bottom-14 right-4 z-[100] flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-fw-base/90 backdrop-blur-sm border border-fw-secondary/50 shadow-sm">
      {ROLES.map((role) => {
        const isActive = currentRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => setRole(role.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
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
