import { useState, useMemo } from 'react';
import {
  Plus, Search, Filter, Download, Play, Pause, Edit2, Trash2,
  Shield, AlertTriangle, Check, Network, GitBranch, Layers,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '../../common/Button';
import { RoutingPolicy, PolicyAppliesTo, PolicyAction, PolicyProtocol } from '../../../types/routingPolicy';
import { Connection } from '../../../types';
import { CloudRouter } from '../../../types/cloudrouter';
import { VNF } from '../../../types/vnf';
import { Link } from '../../../types';
import { Modal } from '../../common/Modal';
import { FormField } from '../../form/FormField';

interface PoliciesTabProps {
  connection: Connection;
  cloudRouters: CloudRouter[];
  vnfs: VNF[];
  allLinks: Link[];
}

export function PoliciesTab({ connection, cloudRouters, vnfs, allLinks }: PoliciesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<RoutingPolicy | undefined>();
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    action: [] as PolicyAction[],
    appliesTo: [] as PolicyAppliesTo[],
    enabled: 'all' as 'all' | 'enabled' | 'disabled'
  });

  // Sample routing policies
  const [policies, setPolicies] = useState<RoutingPolicy[]>([
    {
      id: 'policy-1',
      name: 'Production Traffic Priority',
      description: 'Prioritize production traffic over all links',
      enabled: true,
      priority: 100,
      action: 'permit',
      protocol: 'any',
      conditions: [
        { id: 'cond-1', type: 'prefix', operator: 'matches', value: '10.0.0.0/8' },
        { id: 'cond-2', type: 'community', operator: 'contains', value: '65000:100' }
      ],
      appliesTo: 'links',
      targetIds: ['link-1', 'link-2'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-10T14:30:00Z',
      createdBy: 'admin@att.com'
    },
    {
      id: 'policy-2',
      name: 'Block Suspicious Traffic',
      description: 'Deny traffic from known malicious sources',
      enabled: true,
      priority: 200,
      action: 'deny',
      protocol: 'tcp',
      conditions: [
        { id: 'cond-3', type: 'source', operator: 'matches', value: '192.168.100.0/24' },
        { id: 'cond-4', type: 'port', operator: 'range', value: '1-1024' }
      ],
      appliesTo: 'all',
      targetIds: [],
      createdAt: '2024-02-01T09:15:00Z',
      updatedAt: '2024-02-20T11:45:00Z',
      createdBy: 'security@att.com'
    },
    {
      id: 'policy-3',
      name: 'BGP Route Preference',
      description: 'Prefer routes learned from primary cloud router',
      enabled: false,
      priority: 50,
      action: 'permit',
      protocol: 'bgp',
      conditions: [
        { id: 'cond-5', type: 'as-path', operator: 'contains', value: '65001' }
      ],
      appliesTo: 'cloudrouters',
      targetIds: ['cr-1'],
      createdAt: '2024-01-20T13:30:00Z',
      updatedAt: '2024-03-05T16:00:00Z',
      createdBy: 'network@att.com'
    }
  ]);

  const filteredPolicies = useMemo(() => {
    return policies
      .filter(policy => {
        const matchesSearch = !searchQuery ||
          policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          policy.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesAction = !filters.action.length || filters.action.includes(policy.action);
        const matchesAppliesTo = !filters.appliesTo.length || filters.appliesTo.includes(policy.appliesTo);
        const matchesEnabled = filters.enabled === 'all' ||
          (filters.enabled === 'enabled' && policy.enabled) ||
          (filters.enabled === 'disabled' && !policy.enabled);

        return matchesSearch && matchesAction && matchesAppliesTo && matchesEnabled;
      })
      .sort((a, b) => b.priority - a.priority);
  }, [policies, searchQuery, filters]);

  const handleTogglePolicy = (id: string) => {
    setPolicies(policies.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));

    const policy = policies.find(p => p.id === id);
    window.addToast({
      type: 'success',
      title: 'Policy Updated',
      message: `${policy?.name} has been ${policy?.enabled ? 'disabled' : 'enabled'}`,
      duration: 3000
    });
  };

  const handleDeletePolicy = (id: string) => {
    const policy = policies.find(p => p.id === id);
    if (window.confirm(`Are you sure you want to delete "${policy?.name}"? This action cannot be undone.`)) {
      setPolicies(policies.filter(p => p.id !== id));
      window.addToast({
        type: 'success',
        title: 'Policy Deleted',
        message: `${policy?.name} has been deleted`,
        duration: 3000
      });
    }
  };

  const exportPolicies = () => {
    const csv = [
      ['Name', 'Action', 'Protocol', 'Applies To', 'Status', 'Priority'].join(','),
      ...filteredPolicies.map(p => [
        p.name,
        p.action,
        p.protocol,
        p.appliesTo,
        p.enabled ? 'Enabled' : 'Disabled',
        p.priority
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'routing-policies.csv';
    link.click();
    URL.revokeObjectURL(url);

    window.addToast({
      type: 'success',
      title: 'Export Complete',
      message: 'Policies exported successfully',
      duration: 3000
    });
  };

  const getTargetName = (targetId: string): string => {
    const link = allLinks.find(l => l.id === targetId);
    if (link) return link.name;

    const router = cloudRouters.find(cr => cr.id === targetId);
    if (router) return router.name;

    const vnf = vnfs.find(v => v.id === targetId);
    if (vnf) return vnf.name;

    return targetId;
  };

  const getTargetIcon = (appliesTo: PolicyAppliesTo) => {
    switch (appliesTo) {
      case 'links':
        return <Network className="h-4 w-4" />;
      case 'cloudrouters':
        return <GitBranch className="h-4 w-4" />;
      case 'vnfs':
        return <Shield className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-fw-heading">Routing Policies</h2>
          <p className="text-sm text-fw-bodyLight mt-1">
            Manage routing policies for {connection.name}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingPolicy(undefined);
            setShowAddModal(true);
          }}
        >
          Add Policy
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="bg-fw-base rounded-lg border border-fw-secondary p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fw-disabled h-5 w-5" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-fw-secondary rounded-full focus:ring-2 focus:ring-fw-active focus:border-fw-active"
            />
          </div>

          <Button
            variant="outline"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>

          <Button
            variant="outline"
            icon={Download}
            onClick={exportPolicies}
          >
            Export
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-fw-secondary">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-fw-body mb-2">Action</h4>
                <div className="space-y-2">
                  {['permit', 'deny'].map((action) => (
                    <label key={action} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.action.includes(action as PolicyAction)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, action: [...filters.action, action as PolicyAction] });
                          } else {
                            setFilters({ ...filters, action: filters.action.filter(a => a !== action) });
                          }
                        }}
                        className="rounded border-fw-secondary text-fw-link focus:ring-fw-active h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-fw-body capitalize">{action}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-fw-body mb-2">Applies To</h4>
                <div className="space-y-2">
                  {['all', 'links', 'cloudrouters', 'vnfs'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.appliesTo.includes(type as PolicyAppliesTo)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, appliesTo: [...filters.appliesTo, type as PolicyAppliesTo] });
                          } else {
                            setFilters({ ...filters, appliesTo: filters.appliesTo.filter(t => t !== type) });
                          }
                        }}
                        className="rounded border-fw-secondary text-fw-link focus:ring-fw-active h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-fw-body capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-fw-body mb-2">Status</h4>
                <div className="space-y-2">
                  {['all', 'enabled', 'disabled'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="radio"
                        name="enabled"
                        checked={filters.enabled === status}
                        onChange={() => setFilters({ ...filters, enabled: status as any })}
                        className="border-fw-secondary text-fw-link focus:ring-fw-active h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-fw-body capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Policies List */}
      <div className="space-y-3">
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12 bg-fw-wash rounded-lg border border-fw-secondary">
            <Shield className="h-12 w-12 text-fw-disabled mx-auto mb-3" />
            <p className="text-fw-body">No routing policies found</p>
            <p className="text-sm text-fw-bodyLight mt-1">
              {searchQuery || filters.action.length || filters.appliesTo.length
                ? 'Try adjusting your filters'
                : 'Create your first routing policy to get started'
              }
            </p>
          </div>
        ) : (
          filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="bg-fw-base rounded-lg border border-fw-secondary hover:shadow-md transition-shadow"
            >
              {/* Policy Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Status Indicator */}
                  <button
                    onClick={() => handleTogglePolicy(policy.id)}
                    className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      policy.enabled ? 'bg-fw-success' : 'bg-fw-disabled'
                    }`}
                    title={policy.enabled ? 'Enabled' : 'Disabled'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        policy.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>

                  {/* Priority Badge */}
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-fw-accent">
                    <span className="text-sm font-semibold text-fw-link">{policy.priority}</span>
                  </div>

                  {/* Policy Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-medium text-fw-heading truncate">{policy.name}</h3>

                      {/* Action Badge */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        policy.action === 'permit'
                          ? 'bg-[var(--status-active-bg)] text-[var(--status-active-text)]'
                          : 'bg-[var(--status-error-bg)] text-[var(--status-error-text)]'
                      }`}>
                        {policy.action === 'permit' ? <Check className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                        {policy.action.toUpperCase()}
                      </span>

                      {/* Protocol Badge */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-fw-neutral text-fw-body">
                        {policy.protocol.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-fw-bodyLight mt-1 truncate">{policy.description}</p>

                    {/* Targets */}
                    <div className="flex items-center space-x-2 mt-2">
                      {getTargetIcon(policy.appliesTo)}
                      <span className="text-xs text-fw-bodyLight">
                        {policy.appliesTo === 'all'
                          ? 'Applied to all resources'
                          : `Applied to ${policy.targetIds.length} ${policy.appliesTo}`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={expandedPolicy === policy.id ? ChevronUp : ChevronDown}
                    onClick={() => setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)}
                  >
                    {expandedPolicy === policy.id ? 'Hide' : 'Details'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit2}
                    onClick={() => {
                      setEditingPolicy(policy);
                      setShowAddModal(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeletePolicy(policy.id)}
                    className="text-fw-error border-fw-error hover:bg-[var(--status-error-bg)]"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedPolicy === policy.id && (
                <div className="border-t border-fw-secondary p-4 bg-fw-wash">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Conditions */}
                    <div>
                      <h4 className="text-sm font-medium text-fw-heading mb-3">Conditions</h4>
                      <div className="space-y-2">
                        {policy.conditions.map((condition) => (
                          <div key={condition.id} className="flex items-center space-x-2 text-sm">
                            <span className="px-2 py-1 bg-fw-base rounded text-fw-bodyLight font-mono">
                              {condition.type}
                            </span>
                            <span className="text-fw-disabled">{condition.operator}</span>
                            <span className="px-2 py-1 bg-fw-base rounded text-fw-body font-mono">
                              {condition.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Targets */}
                    <div>
                      <h4 className="text-sm font-medium text-fw-heading mb-3">Applied To</h4>
                      {policy.appliesTo === 'all' ? (
                        <p className="text-sm text-fw-bodyLight">All links, cloud routers, and VNFs</p>
                      ) : (
                        <div className="space-y-2">
                          {policy.targetIds.map((targetId) => (
                            <div key={targetId} className="flex items-center space-x-2 text-sm">
                              {getTargetIcon(policy.appliesTo)}
                              <span className="text-fw-body">{getTargetName(targetId)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-fw-secondary text-xs text-fw-bodyLight">
                    <div className="flex items-center justify-between">
                      <span>Created by {policy.createdBy} on {new Date(policy.createdAt).toLocaleDateString()}</span>
                      <span>Last updated {new Date(policy.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Policy Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingPolicy(undefined);
        }}
        title={editingPolicy ? 'Edit Policy' : 'Add Routing Policy'}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-fw-bodyLight">
            Create routing policies to control traffic flow across your network infrastructure.
          </p>

          <FormField label="Policy Name" required>
            <input
              type="text"
              className="w-full px-4 py-2 border border-fw-secondary rounded-lg focus:ring-2 focus:ring-fw-active focus:border-fw-active"
              placeholder="e.g., Production Traffic Priority"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              className="w-full px-4 py-2 border border-fw-secondary rounded-lg focus:ring-2 focus:ring-fw-active focus:border-fw-active"
              rows={2}
              placeholder="Describe what this policy does..."
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Action" required>
              <select className="w-full px-4 py-2 border border-fw-secondary rounded-lg focus:ring-2 focus:ring-fw-active focus:border-fw-active">
                <option value="permit">Permit</option>
                <option value="deny">Deny</option>
              </select>
            </FormField>

            <FormField label="Protocol" required>
              <select className="w-full px-4 py-2 border border-fw-secondary rounded-lg focus:ring-2 focus:ring-fw-active focus:border-fw-active">
                <option value="any">Any</option>
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
                <option value="icmp">ICMP</option>
                <option value="bgp">BGP</option>
                <option value="ospf">OSPF</option>
              </select>
            </FormField>
          </div>

          <FormField label="Priority" required helpText="Higher numbers = higher priority">
            <input
              type="number"
              className="w-full px-4 py-2 border border-fw-secondary rounded-lg focus:ring-2 focus:ring-fw-active focus:border-fw-active"
              placeholder="100"
              min="1"
              max="1000"
            />
          </FormField>

          <FormField label="Apply To" required>
            <select className="w-full px-4 py-2 border border-fw-secondary rounded-lg focus:ring-2 focus:ring-fw-active focus:border-fw-active">
              <option value="all">All Resources</option>
              <option value="links">Specific Links</option>
              <option value="cloudrouters">Specific Cloud Routers</option>
              <option value="vnfs">Specific VNFs</option>
            </select>
          </FormField>

          <div className="pt-4 border-t border-fw-secondary flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setEditingPolicy(undefined);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary">
              {editingPolicy ? 'Update Policy' : 'Create Policy'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
