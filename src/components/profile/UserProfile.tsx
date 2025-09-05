import { useState } from 'react';
import { User, Mail, Phone, Building, Shield, Edit3, Camera, CheckCircle, Save, X, Home, Settings, BarChart2, Network, Cpu, Globe } from 'lucide-react';
import { Button } from '../common/Button';

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  
  const [formData, setFormData] = useState({
    name: 'Emilio Estevez',
    email: 'emilio.estevez@att.com',
    phone: '(555) 123-4567',
    company: 'AT&T',
    department: 'Cloud Solutions',
    role: 'Administrator'
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    passwordLastChanged: '2023-12-15',
    sessionTimeout: 30,
    notificationPreferences: {
      email: true,
      sms: false,
      app: true
    }
  });

  // User preferences
  const [preferences, setPreferences] = useState({
    landingPage: 'manage', // Default landing page
    theme: 'light',
    language: 'en-US',
    dataRefreshRate: '15m'
  });

  const refreshRateOptions = [
    { value: '15m', label: '15 Minutes' },
    { value: '30m', label: '30 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' }
  ];

  const landingPageOptions = [
    { value: 'manage', label: 'Manage Connections', icon: <Network className="h-5 w-5 text-brand-blue" /> },
    { value: 'monitor', label: 'Monitoring Dashboard', icon: <BarChart2 className="h-5 w-5 text-brand-blue" /> },
    { value: 'configure', label: 'System Configuration', icon: <Settings className="h-5 w-5 text-brand-blue" /> },
    { value: 'marketplace', label: 'Marketplace', icon: <Globe className="h-5 w-5 text-brand-blue" /> },
    { value: 'control-center', label: 'Insights', icon: <Cpu className="h-5 w-5 text-brand-blue" /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (name: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));

    // In a real app, this would save to backend/localStorage
    if (name === 'landingPage') {
      window.addToast({
        type: 'success',
        title: 'Landing Page Updated',
        message: `Your default landing page has been set to ${landingPageOptions.find(opt => opt.value === value)?.label}`,
        duration: 3000
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save logic would go here
      window.addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
        duration: 3000
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        {/* Profile Header */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-start">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={profileImage} 
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand-blue text-white shadow-lg"
                aria-label="Change profile picture"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="ml-6 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
                  <p className="text-sm text-gray-500">{formData.role} at {formData.company}</p>
                </div>
                <Button
                  variant="primary"
                  icon={isEditing ? Save : Edit3}
                  onClick={handleEditToggle}
                  className="ml-auto"
                >
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{formData.department}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{securitySettings.twoFactorEnabled ? 'Two-factor enabled' : 'Two-factor disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="px-6 py-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="rounded-full w-full border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="rounded-full w-full border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="rounded-full w-full border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="rounded-full w-full border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* User Preferences - New Section */}
        <div className="px-6 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">User Preferences</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.addToast({
                  type: 'info',
                  title: 'Preferences',
                  message: 'Your preferences have been updated',
                  duration: 3000
                });
              }}
            >
              Save Preferences
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Landing Page Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Default Landing Page
              </label>
              <div className="space-y-2">
                {landingPageOptions.map(option => (
                  <div 
                    key={option.value}
                    className={`
                      relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${preferences.landingPage === option.value 
                        ? 'border-brand-blue bg-brand-lightBlue' 
                        : 'border-gray-200 hover:border-brand-blue/30 hover:bg-brand-lightBlue/20'
                      }
                    `}
                    onClick={() => handlePreferenceChange('landingPage', option.value)}
                  >
                    <div className={`
                      p-2 rounded-full
                      ${preferences.landingPage === option.value ? 'bg-brand-blue' : 'bg-gray-100'}
                    `}>
                      {option.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={`
                        text-sm font-medium 
                        ${preferences.landingPage === option.value ? 'text-brand-blue' : 'text-gray-900'}
                      `}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Set as default page on login
                      </p>
                    </div>
                    {preferences.landingPage === option.value && (
                      <div className="absolute right-4">
                        <CheckCircle className="h-5 w-5 text-brand-blue" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Other Preferences */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={preferences.theme === 'light'}
                      onChange={() => handlePreferenceChange('theme', 'light')}
                      className="h-4 w-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">Light</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={preferences.theme === 'dark'}
                      onChange={() => handlePreferenceChange('theme', 'dark')}
                      className="h-4 w-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">Dark</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={preferences.theme === 'system'}
                      onChange={() => handlePreferenceChange('theme', 'system')}
                      className="h-4 w-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">System</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="rounded-full w-full border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                >
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                  <option value="de-DE">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Refresh Rate
                </label>
                <select
                  value={preferences.dataRefreshRate}
                  onChange={(e) => handlePreferenceChange('dataRefreshRate', e.target.value)}
                  className="rounded-full w-full border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                >
                  {refreshRateOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  How often monitoring data should be refreshed automatically
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="px-6 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.addToast({
                  type: 'info',
                  title: 'Security Settings',
                  message: 'Security settings page coming soon',
                  duration: 3000
                });
              }}
            >
              Manage Security
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Two-factor Authentication</h3>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center">
                {securitySettings.twoFactorEnabled ? (
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Enabled
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorEnabled: true
                      });
                    }}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Password</h3>
                <p className="text-xs text-gray-500">
                  Last changed {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.addToast({
                    type: 'info',
                    title: 'Change Password',
                    message: 'Password change dialog coming soon',
                    duration: 3000
                  });
                }}
              >
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Session Timeout</h3>
                <p className="text-xs text-gray-500">
                  Your session will timeout after {securitySettings.sessionTimeout} minutes of inactivity
                </p>
              </div>
              <select
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  sessionTimeout: parseInt(e.target.value)
                })}
                disabled={!isEditing}
                className="rounded-full border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="px-6 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.addToast({
                  type: 'info',
                  title: 'Notification Preferences',
                  message: 'Notification settings page coming soon',
                  duration: 3000
                });
              }}
            >
              Manage Notifications
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-xs text-gray-500">Get updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.notificationPreferences.email}
                  onChange={() => {
                    setSecuritySettings({
                      ...securitySettings,
                      notificationPreferences: {
                        ...securitySettings.notificationPreferences,
                        email: !securitySettings.notificationPreferences.email
                      }
                    });
                  }}
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-xs text-gray-500">Get updates via text message</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.notificationPreferences.sms}
                  onChange={() => {
                    setSecuritySettings({
                      ...securitySettings,
                      notificationPreferences: {
                        ...securitySettings.notificationPreferences,
                        sms: !securitySettings.notificationPreferences.sms
                      }
                    });
                  }}
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">App Notifications</h3>
                <p className="text-xs text-gray-500">Get in-app notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.notificationPreferences.app}
                  onChange={() => {
                    setSecuritySettings({
                      ...securitySettings,
                      notificationPreferences: {
                        ...securitySettings.notificationPreferences,
                        app: !securitySettings.notificationPreferences.app
                      }
                    });
                  }}
                  disabled={!isEditing}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-4 border-t border-gray-200">
          {isEditing && (
            <Button
              variant="outline"
              icon={X}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            icon={isEditing ? Save : Edit3}
            onClick={handleEditToggle}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}