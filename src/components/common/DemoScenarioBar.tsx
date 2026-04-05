import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UserRole } from '../../store/slices/roleSlice';
import { Shield, Building2, Users } from 'lucide-react';

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
    label: 'AT&T Platform Admin',
    icon: Shield,
    description: 'Full platform access',
    tenantId: 'TNT-001',
    role: 'super-admin',
    color: 'text-fw-body hover:bg-fw-wash',
    activeColor: 'bg-fw-purple text-white',
    navigateTo: '/manage',
  },
  {
    id: 'enterprise',
    label: 'Enterprise Customer',
    icon: Building2,
    description: 'Acme Corp portal',
    tenantId: 'TNT-002',
    role: 'admin',
    color: 'text-fw-body hover:bg-fw-wash',
    activeColor: 'bg-fw-success text-white',
    navigateTo: '/manage',
  },
  {
    id: 'reseller',
    label: 'Reseller Partner',
    icon: Users,
    description: 'GNS reseller view',
    tenantId: 'TNT-004',
    role: 'admin',
    color: 'text-fw-body hover:bg-fw-wash',
    activeColor: 'bg-brand-blue text-white',
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
    if (activeTenantId === 'TNT-001' && currentRole === 'super-admin') return 'platform-admin';
    if (activeTenantId === 'TNT-002') return 'enterprise';
    if (activeTenantId === 'TNT-004' || location.pathname === '/reseller') return 'reseller';
    return null;
  };

  const activeId = getActiveScenarioId();

  const handleSelect = (scenario: Scenario) => {
    setActiveTenant(scenario.tenantId);
    setRole(scenario.role);
    if (scenario.navigateTo) {
      // Defer navigation to let tenant switch settle
      setTimeout(() => navigate(scenario.navigateTo!), 50);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-1 px-2 py-1.5 rounded-full bg-fw-base border border-fw-secondary shadow-lg">
      <span className="text-figma-xs font-medium text-fw-bodyLight px-2 hidden lg:block">Demo:</span>
      {SCENARIOS.map((scenario) => {
        const isActive = activeId === scenario.id;
        const Icon = scenario.icon;
        return (
          <button
            key={scenario.id}
            onClick={() => handleSelect(scenario)}
            title={scenario.description}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-figma-sm font-medium transition-all duration-200 ${
              isActive ? scenario.activeColor : scenario.color
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{scenario.label}</span>
          </button>
        );
      })}
    </div>
  );
}
