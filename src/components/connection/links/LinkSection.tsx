import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '../../common/Button';
import { SearchFilterBar } from '../../common/SearchFilterBar';
import { Connection, Link } from '../../../types';
import { LinkTable } from './LinkTable';
import { LinkStatusSummary } from './LinkStatusSummary';
import { VLANModal } from '../modals/VLANModal';
import { DeleteLinkModal } from '../modals/DeleteVLANModal';
import { CloudRouter } from '../../../types/cloudrouter';

interface LinkSectionProps {
  connection: Connection;
  allLinks?: Array<Link & { cloudRouterName?: string, cloudRouterId?: string }>;
  cloudRouters?: CloudRouter[];
  isEditing?: boolean;
}

export function LinkSection({ 
  connection, 
  allLinks = [],
  cloudRouters = [],
  isEditing = false 
}: LinkSectionProps) {
  // Use provided links or fallback to sample data
  const [links, setLinks] = useState<Array<Link & { cloudRouterName?: string, cloudRouterId?: string }>>(
    allLinks.length > 0 ? allLinks : [
      {
        id: 'vlan-1',
        name: 'Production Traffic',
        vlanId: 100,
        status: 'active',
        description: 'Main production network traffic',
        tags: ['production', 'primary'],
        ipSubnet: '10.100.0.0/24',
        mtu: 1500,
        qosPriority: 3,
        type: 'data',
        createdAt: '2024-01-15T09:30:00Z',
        updatedAt: '2024-03-20T14:22:00Z',
        cloudRouterName: 'Cloud Router A',
        cloudRouterId: 'cr-1',
        cloudRouterIds: ['cr-1'],
        bandwidth: '5 Gbps'
      },
      {
        id: 'vlan-2',
        name: 'Development Environment',
        vlanId: 200,
        status: 'active',
        description: 'Development and testing workloads',
        tags: ['development', 'testing'],
        ipSubnet: '10.200.0.0/24',
        mtu: 1500,
        qosPriority: 1,
        type: 'data',
        createdAt: '2024-01-20T10:45:00Z',
        updatedAt: '2024-02-18T11:30:00Z',
        cloudRouterName: 'Cloud Router A',
        cloudRouterId: 'cr-1',
        cloudRouterIds: ['cr-1'],
        bandwidth: '2 Gbps'
      },
      {
        id: 'vlan-3',
        name: 'Management Traffic',
        vlanId: 300,
        status: 'active',
        description: 'Network management and control plane',
        tags: ['management', 'control'],
        ipSubnet: '10.0.0.0/24',
        mtu: 1500,
        qosPriority: 5,
        type: 'management',
        createdAt: '2024-01-25T08:15:00Z',
        updatedAt: '2024-03-05T16:10:00Z',
        cloudRouterName: 'Cloud Router B',
        cloudRouterId: 'cr-2',
        cloudRouterIds: ['cr-2'],
        bandwidth: '1 Gbps'
      },
      {
        id: 'vlan-4',
        name: 'Voice Systems',
        vlanId: 400,
        status: 'active',
        description: 'VoIP and communication systems',
        tags: ['voice', 'comms'],
        ipSubnet: '10.40.0.0/24',
        mtu: 1500,
        qosPriority: 5,
        type: 'voice',
        createdAt: '2024-02-10T13:20:00Z',
        cloudRouterName: 'Cloud Router B',
        cloudRouterId: 'cr-2',
        cloudRouterIds: ['cr-2'],
        bandwidth: '2 Gbps'
      }
    ]
  );

  const [sortField, setSortField] = useState<keyof Link>('vlanId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<Link & { cloudRouterName?: string, cloudRouterId?: string } | undefined>();
  const [deletingLink, setDeletingLink] = useState<Link & { cloudRouterName?: string, cloudRouterId?: string } | undefined>();
  const [selectedCloudRouter, setSelectedCloudRouter] = useState<string>('all');

  // Calculate total used bandwidth across all cloud routers
  const calculateTotalUsedBandwidth = () => {
    return links.reduce((total, link) => {
      // Extract numeric value and unit from bandwidth
      const bandwidthMatch = link.bandwidth?.match(/(\d+)\s*(Gbps|Mbps|Tbps)/i);
      if (bandwidthMatch) {
        const value = parseInt(bandwidthMatch[1]);
        const unit = bandwidthMatch[2].toLowerCase();
        
        // Convert to Gbps for consistent calculation
        if (unit === 'gbps') return total + value;
        if (unit === 'mbps') return total + (value / 1000);
        if (unit === 'tbps') return total + (value * 1000);
      }
      return total + 1; // Default to 1 Gbps if not specified
    }, 0);
  };

  // Parse connection bandwidth string to number in Gbps
  const parseTotalBandwidth = (bandwidthStr?: string) => {
    if (!bandwidthStr) return 10; // Default to 10 Gbps if not specified
    
    const match = bandwidthStr.match(/(\d+)\s*(Gbps|Mbps|Tbps)/i);
    if (!match) return 10;
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit === 'gbps') return value;
    if (unit === 'mbps') return value / 1000;
    if (unit === 'tbps') return value * 1000;
    
    return 10; // Default fallback
  };

  // Calculate available bandwidth
  const totalBandwidth = parseTotalBandwidth(connection.bandwidth);
  const usedBandwidth = calculateTotalUsedBandwidth();
  const availableBandwidth = Math.max(0, totalBandwidth - usedBandwidth);

  // Link handlers
  const handleSort = (field: keyof Link) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddLink = () => {
    setShowAddModal(true);
  };

  const handleEditLink = (link: Link & { cloudRouterName?: string, cloudRouterId?: string }) => {
    setEditingLink(link);
  };

  const handleDeleteLink = (link: Link & { cloudRouterName?: string, cloudRouterId?: string }) => {
    setDeletingLink(link);
  };

  const handleSaveLink = (linkData: Partial<Link>) => {
    // In a real app, we would need to update the cloud router
    // For now, just update our local state
    if (editingLink) {
      // Update existing link
      setLinks(links.map(v => v.id === editingLink.id ? { ...v, ...linkData } as typeof v : v));
      setEditingLink(undefined);
      
      window.addToast({
        type: 'success',
        title: 'Link Updated',
        message: `Link ${linkData.name} has been updated successfully`,
        duration: 3000
      });
    } else {
      // Add new link
      const newLink = {
        ...linkData,
        id: `vlan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        cloudRouterName: selectedCloudRouter !== 'all' 
          ? cloudRouters.find(cr => cr.id === selectedCloudRouter)?.name 
          : 'Cloud Router A',
        cloudRouterId: selectedCloudRouter !== 'all' 
          ? selectedCloudRouter
          : cloudRouters[0]?.id || 'cr-1'
      } as Link & { cloudRouterName?: string, cloudRouterId?: string };
      
      setLinks([...links, newLink]);
      
      window.addToast({
        type: 'success',
        title: 'Link Created',
        message: `Link ${newLink.name} has been created successfully`,
        duration: 3000
      });
    }
    
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingLink) {
      setLinks(links.filter(v => v.id !== deletingLink.id));
      
      window.addToast({
        type: 'success',
        title: 'Link Deleted',
        message: `Link ${deletingLink.name} has been deleted successfully`,
        duration: 3000
      });
      
      setDeletingLink(undefined);
    }
  };

  // Sort links based on current sort field and direction
  const sortedLinks = [...links].sort((a, b) => {
    // For cloudRouter sorting
    if (sortField === 'cloudRouterId' as keyof Link) {
      const aRouter = a.cloudRouterName || '';
      const bRouter = b.cloudRouterName || '';
      return sortDirection === 'asc' 
        ? aRouter.localeCompare(bRouter)
        : bRouter.localeCompare(aRouter);
    }
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    } else {
      return ((aValue as any) < (bValue as any) ? -1 : 1) * modifier;
    }
  });

  // Filter links based on search query and selected cloud router
  const filteredLinks = sortedLinks.filter(link => {
    // Filter by cloud router
    if (selectedCloudRouter !== 'all' && link.cloudRouterId !== selectedCloudRouter) {
      return false;
    }
    
    // Filter by search
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      link.name.toLowerCase().includes(searchLower) ||
      link.ipSubnet?.toLowerCase().includes(searchLower) ||
      link.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      link.type?.toLowerCase().includes(searchLower) ||
      link.vlanId.toString().includes(searchLower) ||
      (link.cloudRouterName && link.cloudRouterName.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.04em]">Links</h2>
          <p className="text-figma-base text-fw-bodyLight mt-1">
            Manage network links (VLANs) and their configurations
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleAddLink}
        >
          Add Link
        </Button>
      </div>

      {/* Link Status Summary */}
      <LinkStatusSummary links={links} />

      {/* Table Card */}
      <div className="bg-fw-base rounded-2xl overflow-hidden">
        <div className="px-6 py-4">
          <SearchFilterBar
            searchPlaceholder="Search links ..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filterContent={
              <select
                value={selectedCloudRouter}
                onChange={(e) => setSelectedCloudRouter(e.target.value)}
                className="fw-select"
                style={{ width: 'auto', paddingRight: '2.5rem' }}
              >
                <option value="all">All Cloud Routers</option>
                {cloudRouters.map(router => (
                  <option key={router.id} value={router.id}>{router.name}</option>
                ))}
              </select>
            }
            onExport={() => {
              const headers = ['VLAN ID', 'Name', 'Status', 'Cloud Router'].join(',');
              const rows = filteredLinks.map(link =>
                `"${link.vlanId}","${link.name}","${link.status.charAt(0).toUpperCase() + link.status.slice(1)}","${link.cloudRouterName || 'Not assigned'}"`
              );
              const csv = [headers, ...rows].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'links.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
          />
        </div>

        {/* Links Table */}
        <LinkTable
        links={filteredLinks}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEditLink}
        onDelete={handleDeleteLink}
        searchQuery={searchQuery}
        showCloudRouter={true}
      />
      </div>

      {/* Modals */}
      <VLANModal
        isOpen={showAddModal || !!editingLink}
        onClose={() => {
          setShowAddModal(false);
          setEditingLink(undefined);
        }}
        onSave={handleSaveLink}
        vlan={editingLink}
        connectionId={connection.id.toString()}
        availableBandwidth={availableBandwidth}
        cloudRouters={cloudRouters}
        selectedCloudRouterId={selectedCloudRouter !== 'all' ? selectedCloudRouter : undefined}
      />

      {/* Delete Link Confirmation Modal */}
      {deletingLink && (
        <DeleteLinkModal
          isOpen={!!deletingLink}
          onClose={() => setDeletingLink(undefined)}
          onConfirm={handleConfirmDelete}
          linkName={deletingLink.name}
          linkId={deletingLink.vlanId}
        />
      )}
    </div>
  );
}