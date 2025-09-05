import { useState } from 'react';
import { Settings, Shield, Bell, Database, Clock, Users, Cloud, HardDrive } from 'lucide-react';
import { Button } from '../../common/Button';

interface SystemSettings {
  general: {
    timezone: string;
    dateFormat: string;
    language: string;
    theme: 'light' | 'dark' | 'system';
  };
  security: {
    mfaRequired: boolean;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      expiryDays: number;
    };
    sessionTimeout: number;
    ipWhitelist: string[];
  };
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
    endpoints: {
      type: string;
      url: string;
      enabled: boolean;
    }[];
  };
  backup: {
    autoBackup: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number;
    storageLocation: string;
    encryptBackups: boolean;
  };
  monitoring: {
    metricRetention: number;
    alertThresholds: {
      cpu: number;
      memory: number;
      storage: number;
    };
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  maintenance: {
    maintenanceWindow: {
      day: string;
      time: string;
      duration: number;
    };
    autoUpdate: boolean;
    updateChannel: 'stable' | 'beta';
  };
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      language: 'en',
      theme: 'light'
    },
    security: {
      mfaRequired: true,
      passwordPolicy: {
        minLength: 12,
        requireSpecialChars: true,
        requireNumbers: true,
        expiryDays: 90
      },
      sessionTimeout: 30,
      ipWhitelist: []
    },
    notifications: {
      email: true,
      slack: false,
      webhook: false,
      endpoints: []
    },
    backup: {
      autoBackup: true,
      frequency: 'daily',
      retention: 30,
      storageLocation: 'aws-s3',
      encryptBackups: true
    },
    monitoring: {
      metricRetention: 90,
      alertThresholds: {
        cpu: 80,
        memory: 85,
        storage: 90
      },
      logLevel: 'info'
    },
    maintenance: {
      maintenanceWindow: {
        day: 'Sunday',
        time: '00:00',
        duration: 120
      },
      autoUpdate: true,
      updateChannel: 'stable'
    }
  });

  const handleSettingChange = (category: keyof SystemSettings, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="card">
        <div className="card-header bg-gray-50 flex items-center">
          <Settings className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
              className="form-control mt-1"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              value={settings.general.theme}
              onChange={(e) => handleSettingChange('general', 'theme', e.target.value)}
              className="form-control mt-1"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="card-header bg-gray-50 flex items-center">
          <Shield className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Expiry (Days)</label>
              <input
                type="number"
                value={settings.security.passwordPolicy.expiryDays}
                onChange={(e) => handleSettingChange('security', 'passwordPolicy', {
                  ...settings.security.passwordPolicy,
                  expiryDays: parseInt(e.target.value)
                })}
                className="form-control mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Session Timeout (Minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="form-control mt-1"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.mfaRequired}
                onChange={(e) => handleSettingChange('security', 'mfaRequired', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Require Multi-Factor Authentication
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Settings */}
      <div className="card">
        <div className="card-header bg-gray-50 flex items-center">
          <Bell className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Monitoring Settings</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">CPU Alert Threshold (%)</label>
              <input
                type="number"
                value={settings.monitoring.alertThresholds.cpu}
                onChange={(e) => handleSettingChange('monitoring', 'alertThresholds', {
                  ...settings.monitoring.alertThresholds,
                  cpu: parseInt(e.target.value)
                })}
                className="form-control mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Memory Alert Threshold (%)</label>
              <input
                type="number"
                value={settings.monitoring.alertThresholds.memory}
                onChange={(e) => handleSettingChange('monitoring', 'alertThresholds', {
                  ...settings.monitoring.alertThresholds,
                  memory: parseInt(e.target.value)
                })}
                className="form-control mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Storage Alert Threshold (%)</label>
              <input
                type="number"
                value={settings.monitoring.alertThresholds.storage}
                onChange={(e) => handleSettingChange('monitoring', 'alertThresholds', {
                  ...settings.monitoring.alertThresholds,
                  storage: parseInt(e.target.value)
                })}
                className="form-control mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Settings */}
      <div className="card">
        <div className="card-header bg-gray-50 flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Maintenance Settings</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Maintenance Window</label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <select
                  value={settings.maintenance.maintenanceWindow.day}
                  onChange={(e) => handleSettingChange('maintenance', 'maintenanceWindow', {
                    ...settings.maintenance.maintenanceWindow,
                    day: e.target.value
                  })}
                  className="form-control"
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
                <input
                  type="time"
                  value={settings.maintenance.maintenanceWindow.time}
                  onChange={(e) => handleSettingChange('maintenance', 'maintenanceWindow', {
                    ...settings.maintenance.maintenanceWindow,
                    time: e.target.value
                  })}
                  className="form-control"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Update Channel</label>
              <select
                value={settings.maintenance.updateChannel}
                onChange={(e) => handleSettingChange('maintenance', 'updateChannel', e.target.value)}
                className="form-control mt-1"
              >
                <option value="stable">Stable</option>
                <option value="beta">Beta</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenance.autoUpdate}
                onChange={(e) => handleSettingChange('maintenance', 'autoUpdate', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable Automatic Updates
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}