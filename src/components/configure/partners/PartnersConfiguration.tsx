import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../../common/Button';
import { DataTable } from '../../common/DataTable';
import { SearchFilterBar } from '../../common/SearchFilterBar';

interface Partner {
  id: string;
  companyName: string;
  region: string;
  countryName: string;
  meetMeLink: string;
}

export function PartnersConfiguration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('companyName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Sample data
  const [partners] = useState<Partner[]>([
    {
      id: 'PTN-001',
      companyName: 'Global Network Solutions',
      region: 'North America',
      countryName: 'United States',
      meetMeLink: 'https://meet.att.com/gns'
    },
    {
      id: 'PTN-002',
      companyName: 'European Data Systems',
      region: 'Europe',
      countryName: 'Germany',
      meetMeLink: 'https://meet.att.com/eds'
    },
    {
      id: 'PTN-003',
      companyName: 'Asia Pacific Networks',
      region: 'Asia Pacific',
      countryName: 'Singapore',
      meetMeLink: 'https://meet.att.com/apn'
    }
  ]);

  const columns = [
    {
      id: 'companyName',
      label: 'Company Name',
      sortable: true,
      render: (partner: Partner) => (
        <div className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{partner.companyName}</div>
      )
    },
    {
      id: 'region',
      label: 'Region',
      sortable: true,
      render: (partner: Partner) => (
        <div className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">{partner.region}</div>
      )
    },
    {
      id: 'id',
      label: 'ID',
      sortable: true,
      render: (partner: Partner) => (
        <div className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">{partner.id}</div>
      )
    },
    {
      id: 'countryName',
      label: 'Country Name',
      sortable: true,
      render: (partner: Partner) => (
        <div className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">{partner.countryName}</div>
      )
    },
    {
      id: 'meetMeLink',
      label: 'MeetMe Link',
      render: (partner: Partner) => (
        <a
          href={partner.meetMeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-figma-base font-medium text-fw-link tracking-[-0.03em] hover:text-fw-linkHover flex items-center"
        >
          View Link
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      )
    }
  ];

  const handleAddPartner = () => {
    window.addToast({
      type: 'info',
      title: 'Add Partner',
      message: 'Partner creation coming soon',
      duration: 3000
    });
  };

  const handleEditPartner = (partner: Partner) => {
    window.addToast({
      type: 'info',
      title: 'Edit Partner',
      message: 'Partner editing coming soon',
      duration: 3000
    });
  };

  const handleDeletePartner = (partner: Partner) => {
    window.addToast({
      type: 'info',
      title: 'Delete Partner',
      message: 'Partner deletion coming soon',
      duration: 3000
    });
  };

  const handleExport = () => {
    window.addToast({
      type: 'success',
      title: 'Export Complete',
      message: 'Partners list has been exported successfully',
      duration: 3000
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div />
        <Button variant="primary" icon={Plus} onClick={handleAddPartner}>
          Add Partner
        </Button>
      </div>

      {/* Partners Table */}
      <DataTable
        tableId="partners"
        toolbar={
          <SearchFilterBar
            searchPlaceholder="Search partners ..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onFilter={() => setShowFilters(!showFilters)}
            onExport={handleExport}
          />
        }
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        columns={columns}
        data={partners}
        keyField="id"
        actions={(partner) => [
          {
            id: 'edit',
            label: 'Edit Partner',
            icon: <Edit2 className="h-4 w-4" />,
            onClick: () => handleEditPartner(partner)
          },
          {
            id: 'delete',
            label: 'Delete Partner',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => handleDeletePartner(partner),
            variant: 'danger' as const
          }
        ]}
        emptyState={
            <div className="text-center py-12">
              <p className="text-fw-bodyLight">No partners found</p>
            </div>
          }
      />
    </div>
  );
}