import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UserRole } from '../../store/slices/roleSlice';
import { Shield, Users } from 'lucide-react';

interface Scenario {
  id: string;
  label: string;
  icon: typeof Shield;
  description: string;
  tenantId: string;
  role: UserRole;
  color: string;
  activeColor: string;
  navigateTo?: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'platform-admin',
    label: 'AT&T Platform',
    icon: Shield,
    description: 'AT&T platform with tenant management',
    tenantId: 'TNT-001',
    role: 'super-admin',
    color: 'text-fw-bodyLight hover:bg-fw-wash',
    activeColor: 'bg-fw-heading/10 text-fw-heading',
    navigateTo: '/manage',
  },
  {
    id: 'reseller',
    label: 'Reseller',
    icon: Users,
    description: 'GNS reseller portal',
    tenantId: 'TNT-004',
    role: 'admin',
    color: 'text-fw-bodyLight hover:bg-fw-wash',
    activeColor: 'bg-fw-heading/10 text-fw-heading',
    navigateTo: '/reseller',
  },
];

export function DemoScenarioBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTenantId = useStore(state => state.activeTenantId);
  const setActiveTenant = useStore(state => state.setActiveTenant);
  const setRole = useStore(state => state.setRole);
  const currentRole = useStore(state => state.currentRole);

  const getActiveScenarioId = () => {
    if (activeTenantId === 'TNT-001') return 'platform-admin';
    if (activeTenantId === 'TNT-004' || location.pathname === '/reseller') return 'reseller';
    return 'platform-admin';
  };

  const activeId = getActiveScenarioId();

  const handleSelect = (scenario: Scenario) => {
    setActiveTenant(scenario.tenantId);
    setRole(scenario.role);
    if (scenario.navigateTo) {
      setTimeout(() => navigate(scenario.navigateTo!), 50);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-fw-base/90 backdrop-blur-sm border border-fw-secondary/50 shadow-sm">
      <span className="text-[10px] font-medium text-fw-disabled px-1.5 hidden lg:block uppercase tracking-wider">Demo</span>
      {SCENARIOS.map((scenario) => {
        const isActive = activeId === scenario.id;
        const Icon = scenario.icon;
        return (
          <button
            key={scenario.id}
            onClick={() => handleSelect(scenario)}
            title={scenario.description}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
              isActive ? scenario.activeColor : scenario.color
            }`}
          >
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{scenario.label}</span>
          </button>
        );
      })}
    </div>
  );
}
