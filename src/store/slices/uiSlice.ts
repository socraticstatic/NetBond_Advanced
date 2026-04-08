import { StateCreator } from 'zustand';

export interface UISlice {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  maintenanceFreeze: boolean;
  setMaintenanceFreeze: (active: boolean) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  activeTab: 'connections',
  setActiveTab: (tab) => set({ activeTab: tab }),
  maintenanceFreeze: false,
  setMaintenanceFreeze: (active) => set({ maintenanceFreeze: active }),
});