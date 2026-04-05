import { StateCreator } from 'zustand';
import { Tenant, mockTenants } from '../../data/mockTenants';
import { tenantData, TenantDataSet } from '../../data/mockTenantData';
import { sampleConnections, sampleUsers, sampleGroups } from '../../data/sampleData';
import { applyBranding, DEFAULT_BRANDING } from '../../utils/theme';

export interface TenantBranding {
  productName: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  logo?: string;
}

export interface TenantContextSlice {
  activeTenantId: string;
  activeTenant: Tenant | null;
  tenantBranding: TenantBranding;
  setActiveTenant: (id: string) => void;
  updateTenantBranding: (branding: Partial<TenantBranding>) => void;
}

const ATT_TENANT_ID = 'TNT-001';

export const createTenantContextSlice: StateCreator<TenantContextSlice & { connections: any[]; users: any[]; groups: any[] }> = (set, get) => ({
  activeTenantId: ATT_TENANT_ID,
  activeTenant: mockTenants.find(t => t.id === ATT_TENANT_ID) || null,
  tenantBranding: DEFAULT_BRANDING,

  setActiveTenant: (id: string) => {
    const tenant = mockTenants.find(t => t.id === id);
    if (!tenant) return;

    const isATT = id === ATT_TENANT_ID;

    if (isATT) {
      // Restore default AT&T data
      set({
        activeTenantId: id,
        activeTenant: tenant,
        tenantBranding: DEFAULT_BRANDING,
        connections: [...sampleConnections],
        users: [...sampleUsers],
        groups: [...sampleGroups],
      });
      applyBranding(DEFAULT_BRANDING);
    } else {
      const data: TenantDataSet | undefined = tenantData[id];
      if (data) {
        set({
          activeTenantId: id,
          activeTenant: tenant,
          tenantBranding: data.branding,
          connections: [...data.connections],
          users: [...data.users],
          groups: [...data.groups],
        });
        applyBranding(data.branding);
      } else {
        // Tenant exists but no mock data; clear to empty
        set({
          activeTenantId: id,
          activeTenant: tenant,
          tenantBranding: DEFAULT_BRANDING,
          connections: [],
          users: [],
          groups: [],
        });
        applyBranding(DEFAULT_BRANDING);
      }
    }

    window.addToast?.({
      type: 'info',
      title: 'Tenant Switched',
      message: `Now viewing ${tenant.name}`,
      duration: 2500,
    });
  },

  updateTenantBranding: (branding: Partial<TenantBranding>) => {
    const current = (get() as any).tenantBranding;
    const updated = { ...current, ...branding };
    set({ tenantBranding: updated });
    applyBranding(updated);
  },
});
