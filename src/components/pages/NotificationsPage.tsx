import { Bell, Settings, Activity, Shield } from 'lucide-react';

export function NotificationsPage() {
  const categories = [
    {
      title: 'System Notifications',
      icon: Settings,
      description: 'Updates about system maintenance and changes',
      items: [
        'Scheduled maintenance notifications',
        'System updates and changes',
        'Service status updates',
        'Performance alerts'
      ]
    },
    {
      title: 'Activity Notifications',
      icon: Activity, 
      description: 'Updates about your network activity',
      items: [
        'Connection status changes',
        'Bandwidth utilization alerts',
        'Performance threshold alerts',
        'Configuration changes'
      ]
    },
    {
      title: 'Security Notifications',
      icon: Shield,
      description: 'Important security-related updates',
      items: [
        'Security alerts and warnings',
        'Compliance updates',
        'Access changes',
        'Security patch notifications'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your notification preferences and view updates</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Configure Preferences
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.title} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="ml-3 text-lg font-medium text-gray-900">{category.title}</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                <ul className="space-y-3">
                  {category.items.map((item, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Bell className="h-4 w-4 text-blue-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}