import { Activity, Network, BarChart2 } from 'lucide-react';
import { NetworkStatusWidget } from './NetworkStatusWidget';
import { ConnectionsWidget } from './ConnectionsWidget';
import { PerformanceWidget } from './PerformanceWidget';
import { WidgetDefinition } from '../../../types';

export const monitoringWidgets: WidgetDefinition[] = [
  {
    id: 'network-status',
    title: 'Network Status',
    description: 'Overview of network health and performance',
    icon: Activity,
    color: 'blue',
    defaultW: 2,
    defaultH: 1,
    component: NetworkStatusWidget
  },
  {
    id: 'connections',
    title: 'Active Connections',
    description: 'List of active network connections',
    icon: Network,
    color: 'green',
    defaultW: 1,
    defaultH: 1,
    component: ConnectionsWidget
  },
  {
    id: 'performance',
    title: 'Performance Metrics',
    description: 'Detailed network performance metrics',
    icon: BarChart2,
    color: 'purple',
    defaultW: 2,
    defaultH: 1,
    component: PerformanceWidget
  }
];

export * from './NetworkStatusWidget';
export * from './ConnectionsWidget';
export * from './PerformanceWidget';