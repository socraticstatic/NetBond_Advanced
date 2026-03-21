import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Plus, Eye, Edit2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { BaseTable } from '../common/BaseTable';
import { OverflowMenu } from '../common/OverflowMenu';
import { mockTenants, Tenant } from '../../data/mockTenants';

export function PlatformAdminPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  const getStatusBadge = (status: Tenant['status']) => {
    const config = {
      active: { bg: 'bg-fw-successLight', text: 'text-fw-success', icon: CheckCircle },
      trial: { bg: 'bg-fw-accent', text: 'text-fw-linkHover', icon: Clock },
      suspended: { bg: 'bg-fw-warnLight', text: 'text-fw-warn', icon: AlertCircle },
      archived: { bg: 'bg-fw-neutral', text: 'text-fw-heading', icon: AlertCircle },
    }[status];

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-figma-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPlanBadge = (plan: Tenant['plan']) => {
    const config = {
      starter: { bg: 'bg-fw-neutral', text: 'text-fw-heading' },
      professional: { bg: 'bg-fw-accent', text: 'text-fw-linkHover' },
      enterprise: { bg: 'bg-fw-wash', text: 'text-fw-purple' },
    }[plan];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-figma-sm font-medium ${config.bg} ${config.text}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      id: 'name',
      label: 'Tenant Name',
      sortable: true,
      render: (tenant: Tenant) => (
        <div>
          <div className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{tenant.name}</div>
          <div className="text-figma-sm font-medium text-fw-bodyLight">{tenant.subdomain}.att-netbond.com</div>
        </div>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (tenant: Tenant) => getStatusBadge(tenant.status),
    },
    {
      id: 'plan',
      label: 'Plan',
      sortable: true,
      render: (tenant: Tenant) => getPlanBadge(tenant.plan),
    },
    {
      id: 'admin',
      label: 'Admin Contact',
      sortable: true,
      render: (tenant: Tenant) => (
        <div>
          <div className="text-figma-base font-medium text-fw-body">{tenant.adminName}</div>
          <div className="text-figma-sm font-medium text-fw-bodyLight">{tenant.adminEmail}</div>
        </div>
      ),
    },
    {
      id: 'users',
      label: 'Users',
      sortable: true,
      render: (tenant: Tenant) => (
        <div className="text-figma-base font-medium text-fw-body">{tenant.userCount}</div>
      ),
    },
    {
      id: 'connections',
      label: 'Connections',
      sortable: true,
      render: (tenant: Tenant) => (
        <div className="text-figma-base font-medium text-fw-body">{tenant.connectionCount}</div>
      ),
    },
    {
      id: 'created',
      label: 'Created',
      sortable: true,
      render: (tenant: Tenant) => (
        <div className="text-figma-sm font-medium text-fw-bodyLight">
          {new Date(tenant.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch =
      searchQuery === '' ||
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.adminName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(tenant.status);

    const matchesPlan =
      selectedPlans.length === 0 || selectedPlans.includes(tenant.plan);

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleCreateTenant = () => {
    window.addToast({
      type: 'info',
      title: 'Create Tenant',
      message: 'Tenant creation wizard coming soon',
      duration: 3000,
    });
  };

  const handleViewDetails = (tenant: Tenant) => {
    navigate(`/configure/platform/tenants/${tenant.id}`);
  };

  const handleEditBranding = (tenant: Tenant) => {
    navigate(`/configure/platform/tenants/${tenant.id}/branding`);
  };

  const handleExport = () => {
    window.addToast({
      type: 'success',
      title: 'Export Complete',
      message: 'Tenant list has been exported successfully',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-sm font-medium text-fw-bodyLight">Total Tenants</p>
              <p className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mt-1">{mockTenants.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-fw-success" />
          </div>
        </div>

        <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-sm font-medium text-fw-bodyLight">Active Tenants</p>
              <p className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mt-1">
                {mockTenants.filter((t) => t.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-fw-link" />
          </div>
        </div>

        <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-sm font-medium text-fw-bodyLight">Total Users</p>
              <p className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mt-1">
                {mockTenants.reduce((sum, t) => sum + t.userCount, 0)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-fw-purple" />
          </div>
        </div>

        <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-figma-sm font-medium text-fw-bodyLight">Total Connections</p>
              <p className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mt-1">
                {mockTenants.reduce((sum, t) => sum + t.connectionCount, 0)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-fw-warn" />
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-fw-base p-4 rounded-2xl border border-fw-secondary">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fw-bodyLight h-5 w-5" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-9 border border-fw-secondary rounded-lg text-figma-base font-medium text-fw-heading tracking-[-0.03em] placeholder:text-fw-bodyLight focus:ring-2 focus:ring-fw-active focus:border-fw-active"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="primary" icon={Plus} onClick={handleCreateTenant}>
              Create Tenant
            </Button>
            <Button
              variant="outline"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <Button variant="outline" icon={Download} onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-fw-secondary">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-figma-base font-medium text-fw-heading tracking-[-0.03em] mb-2">Status</h4>
                <div className="space-y-2">
                  {['active', 'trial', 'suspended', 'archived'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStatuses([...selectedStatuses, status]);
                          } else {
                            setSelectedStatuses(
                              selectedStatuses.filter((s) => s !== status)
                            );
                          }
                        }}
                        className="h-4 w-4 text-fw-active rounded border-fw-secondary"
                      />
                      <span className="ml-2 text-figma-base font-medium text-fw-body capitalize">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-figma-base font-medium text-fw-heading tracking-[-0.03em] mb-2">Plan</h4>
                <div className="space-y-2">
                  {['starter', 'professional', 'enterprise'].map((plan) => (
                    <label key={plan} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPlans.includes(plan)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlans([...selectedPlans, plan]);
                          } else {
                            setSelectedPlans(selectedPlans.filter((p) => p !== plan));
                          }
                        }}
                        className="h-4 w-4 text-fw-active rounded border-fw-secondary"
                      />
                      <span className="ml-2 text-figma-base font-medium text-fw-body capitalize">
                        {plan}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tenants Table */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary">
        <BaseTable
          columns={columns}
          data={filteredTenants}
          keyField="id"
          tableId="tenants"
          showColumnManager={true}
          actions={(tenant) => (
            <OverflowMenu
              items={[
                {
                  id: 'view',
                  label: 'View Details',
                  icon: <Eye className="h-4 w-4" />,
                  onClick: () => handleViewDetails(tenant),
                },
                {
                  id: 'branding',
                  label: 'Edit Branding',
                  icon: <Edit2 className="h-4 w-4" />,
                  onClick: () => handleEditBranding(tenant),
                },
              ]}
            />
          )}
          emptyState={
            <div className="text-center py-12">
              <p className="text-fw-bodyLight">No tenants found</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
