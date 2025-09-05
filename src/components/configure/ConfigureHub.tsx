import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  Settings, Users, CreditCard, FileText, Shield, 
  Server, Layers, Building, Clock, Database
} from 'lucide-react';
import { SubNav } from '../navigation/SubNav';
import { ConnectionManagement } from './ConnectionManagement';
import { UserManagement } from './UserManagement';
import { BillingConfiguration } from './BillingConfiguration';
import { ReportingSettings } from './ReportingSettings';
import { SystemSettings } from './system/SystemSettings';
import { PartnersConfiguration } from './partners/PartnersConfiguration';
import { PoliciesConfiguration } from './policies/PoliciesConfiguration';
import { GroupManagement } from './groups/GroupManagement';
import { TabGroup } from '../navigation/TabGroup';

interface ConfigureHubProps {
  defaultTab?: string;
}

export function ConfigureHub({ defaultTab = 'connections' }: ConfigureHubProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  
  // Set active tab based on URL path
  useEffect(() => {
    const path = location.pathname.split('/')[2]; // /configure/:tab
    if (path) {
      setActiveTab(path);
    }
  }, [location]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/configure/${tab}`);
  };

  const tabs = [
    { id: 'connections', label: 'Connections', icon: <Server className="h-5 w-5 mr-2" /> },
    { id: 'groups', label: 'Pools', icon: <Layers className="h-5 w-5 mr-2" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-5 w-5 mr-2" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="h-5 w-5 mr-2" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="h-5 w-5 mr-2" /> },
    { id: 'system', label: 'System', icon: <Settings className="h-5 w-5 mr-2" /> },
    { id: 'partners', label: 'Partners', icon: <Building className="h-5 w-5 mr-2" /> },
    { id: 'policies', label: 'Policies', icon: <Shield className="h-5 w-5 mr-2" /> }
  ];

  return (
    <div className="space-y-6">
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => handleTabChange(tab)}
      />

      <Routes>
        <Route path="connections" element={<ConnectionManagement />} />
        <Route path="groups" element={<GroupManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="billing" element={<BillingConfiguration />} />
        <Route path="reports" element={<ReportingSettings />} />
        <Route path="system/*" element={<SystemSettings />} />
        <Route path="partners" element={<PartnersConfiguration />} />
        <Route path="policies/*" element={<PoliciesConfiguration />} />
        <Route path="/*" element={<Navigate to="/configure/connections" />} />
      </Routes>
    </div>
  );
}

export default ConfigureHub;