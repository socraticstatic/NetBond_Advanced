import { StateCreator } from 'zustand';
import { Notification, NotificationPreferences, NotificationSettings, NotificationChannel } from '../../types/notification';

const defaultPreferences: NotificationPreferences = {
  system: {
    enabled: true,
    channels: ['email', 'app'],
    maintenance: true,
    updates: true,
    performance: true,
  },
  activity: {
    enabled: true,
    channels: ['app'],
    statusChanges: true,
    bandwidthAlerts: true,
    thresholdAlerts: true,
    configChanges: true,
  },
  security: {
    enabled: true,
    channels: ['email', 'sms', 'app'],
    securityAlerts: true,
    compliance: true,
    accessChanges: true,
    patches: true,
  },
  billing: {
    enabled: true,
    channels: ['email'],
    invoices: true,
    paymentFailures: true,
    budgetAlerts: true,
    usageThresholds: true,
  },
  alert: {
    enabled: true,
    channels: ['email', 'app'],
    criticalOnly: false,
    minPriority: 'medium',
  },
};

const defaultSettings: NotificationSettings = {
  doNotDisturb: false,
  doNotDisturbSchedule: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  digestEnabled: false,
  digestFrequency: 'daily',
  soundEnabled: true,
  browserNotifications: true,
};

export interface NotificationSlice {
  notifications: Notification[];
  preferences: NotificationPreferences;
  settings: NotificationSettings;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  toggleChannel: (type: keyof NotificationPreferences, channel: NotificationChannel) => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (set) => ({
  notifications: [],
  preferences: defaultPreferences,
  settings: defaultSettings,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true, status: 'read' as const }
          : notification
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
        status: 'read' as const,
      })),
    })),

  archiveNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, archived: true, status: 'archived' as const }
          : notification
      ),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),

  clearAll: () =>
    set(() => ({
      notifications: [],
    })),

  updatePreferences: (preferences) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        ...preferences,
      },
    })),

  updateSettings: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
      },
    })),

  toggleChannel: (type, channel) =>
    set((state) => {
      const currentChannels = state.preferences[type].channels;
      const hasChannel = currentChannels.includes(channel);

      return {
        preferences: {
          ...state.preferences,
          [type]: {
            ...state.preferences[type],
            channels: hasChannel
              ? currentChannels.filter((c) => c !== channel)
              : [...currentChannels, channel],
          },
        },
      };
    }),
});
