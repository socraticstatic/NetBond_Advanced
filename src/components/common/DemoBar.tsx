import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UserRole } from '../../store/slices/roleSlice';
import { Shield, Users, Wrench } from 'lucide-react';

const SCENARIOS = [
  { id: 'platform-admin', label: 'AT&T Platform', icon: Shield, tenantId: 'TNT-001', role: 'super-admin' as UserRole, navigateTo: '/manage' },
  { id: 'reseller', label: 'Reseller', icon: Users, tenantId: 'TNT-004', role: 'admin' as UserRole, navigateTo: '/reseller' },
];

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'user', label: 'User' },
  { id: 'admin', label: 'Admin' },
  { id: 'super-admin', label: 'Super Admin' },
];

const pill = (active: boolean) =>
  `px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
    active ? 'bg-fw-heading/10 text-fw-heading' : 'text-fw-bodyLight hover:bg-fw-wash'
  }`;

export function DemoBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTenantId = useStore(s => s.activeTenantId);
  const setActiveTenant = useStore(s => s.setActiveTenant);
  const currentRole = useStore(s => s.currentRole);
  const setRole = useStore(s => s.setRole);
  const maintenanceFreeze = useStore(s => s.maintenanceFreeze);
  const setMaintenanceFreeze = useStore(s => s.setMaintenanceFreeze);

  const activeScenario = activeTenantId === 'TNT-004' || location.pathname === '/reseller' ? 'reseller' : 'platform-admin';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-fw-base/90 backdrop-blur-sm border border-fw-secondary/50 shadow-sm">
      {SCENARIOS.map(s => {
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            onClick={() => { setActiveTenant(s.tenantId); setRole(s.role); setTimeout(() => navigate(s.navigateTo), 50); }}
            className={`flex items-center gap-1 ${pill(activeScenario === s.id)}`}
          >
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        );
      })}
      <div className="w-px h-4 bg-fw-secondary/50 mx-1" />
      {ROLES.map(r => (
        <button key={r.id} onClick={() => setRole(r.id)} className={pill(currentRole === r.id)}>
          {r.label}
        </button>
      ))}
      <div className="w-px h-4 bg-fw-secondary/50 mx-1" />
      <button
        onClick={() => setMaintenanceFreeze(!maintenanceFreeze)}
        className={`flex items-center gap-1 ${pill(maintenanceFreeze)}`}
      >
        <Wrench className="h-3 w-3" />
        <span className="hidden sm:inline">Maintenance</span>
      </button>
    </div>
  );
}
