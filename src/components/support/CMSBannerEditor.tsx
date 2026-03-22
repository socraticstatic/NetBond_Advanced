import { useState } from 'react';
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react';
import { BaseTable } from '../common/BaseTable';
import { Badge, StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';

type BannerStatus = 'active' | 'scheduled' | 'inactive';
type BannerPosition = 'top' | 'hero' | 'inline';

interface Banner {
  id: string;
  title: string;
  status: BannerStatus;
  position: BannerPosition;
  startDate: string;
  endDate: string;
}

const positionColors: Record<BannerPosition, { text: string; bg: string }> = {
  top:    { text: '#0057b8', bg: 'rgba(0,87,184,0.12)' },
  hero:   { text: '#af29bb', bg: 'rgba(175,41,187,0.12)' },
  inline: { text: '#ff8500', bg: 'rgba(255,133,0,0.12)' },
};

const SAMPLE_BANNERS: Banner[] = [
  {
    id: 'banner-001',
    title: 'Meet Niva, Your NetBond AI Assistant',
    status: 'active',
    position: 'hero',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
  },
  {
    id: 'banner-002',
    title: 'Scheduled Maintenance - March 25, 2026',
    status: 'scheduled',
    position: 'top',
    startDate: '2026-03-24',
    endDate: '2026-03-25',
  },
  {
    id: 'banner-003',
    title: 'Q4 2025 Platform Release Notes',
    status: 'inactive',
    position: 'inline',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
  },
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

export function CMSBannerEditor() {
  const [banners, setBanners] = useState<Banner[]>(SAMPLE_BANNERS);

  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleEdit = (banner: Banner) => {
    window.addToast?.({
      type: 'info',
      title: 'Edit Banner',
      message: `Edit form for "${banner.title}" coming soon.`,
      duration: 3000,
    });
  };

  const handleCreate = () => {
    window.addToast?.({
      type: 'info',
      title: 'Create Banner',
      message: 'Banner creation form coming soon.',
      duration: 3000,
    });
  };

  const columns = [
    {
      id: 'title',
      label: 'Title',
      render: (b: Banner) => (
        <span className="text-fw-heading font-medium tracking-[-0.03em]">{b.title}</span>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (b: Banner) => (
        <StatusBadge status={b.status} size="sm" />
      ),
    },
    {
      id: 'position',
      label: 'Position',
      render: (b: Banner) => {
        const colors = positionColors[b.position];
        return (
          <Badge color={colors.text} bg={colors.bg} size="sm">
            {b.position}
          </Badge>
        );
      },
    },
    {
      id: 'startDate',
      label: 'Start Date',
      render: (b: Banner) => (
        <span className="text-fw-body text-figma-base font-medium tracking-[-0.03em]">
          {formatDate(b.startDate)}
        </span>
      ),
    },
    {
      id: 'endDate',
      label: 'End Date',
      render: (b: Banner) => (
        <span className="text-fw-body text-figma-base font-medium tracking-[-0.03em]">
          {formatDate(b.endDate)}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-fw-wash">
            <Megaphone className="h-5 w-5 text-fw-link" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-fw-heading tracking-[-0.03em]">
              Banner Management
            </h1>
            <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em]">
              Manage promotional and informational banners
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleCreate}
        >
          Create Banner
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active', value: banners.filter(b => b.status === 'active').length, color: '#2d7e24' },
          { label: 'Scheduled', value: banners.filter(b => b.status === 'scheduled').length, color: '#ff8500' },
          { label: 'Inactive', value: banners.filter(b => b.status === 'inactive').length, color: '#686e74' },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-fw-base rounded-2xl border border-fw-secondary p-6"
          >
            <p className="text-figma-sm font-medium text-fw-bodyLight tracking-[-0.03em] mb-1">
              {stat.label}
            </p>
            <p className="text-[28px] font-bold tracking-[-0.03em]" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <BaseTable<Banner>
        columns={columns}
        data={banners}
        keyField="id"
        showColumnManager={false}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-8">
            <Megaphone className="h-8 w-8 text-fw-disabled" />
            <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">
              No banners yet. Create your first banner.
            </p>
          </div>
        }
        actions={(banner: Banner) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Pencil}
              onClick={() => handleEdit(banner)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              icon={Trash2}
              onClick={() => handleDelete(banner.id)}
            >
              Delete
            </Button>
          </div>
        )}
      />
    </div>
  );
}
