import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Activity, DollarSign, Shield, Eye, ChevronDown, Filter, Search, LayoutGrid, List, X } from 'lucide-react';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { useMonitoring } from '../context/MonitoringContext';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'security' | 'billing' | 'operations';
  lastGenerated: string | null;
  frequency: 'on-demand' | 'daily' | 'weekly' | 'monthly';
  format: 'PDF' | 'CSV' | 'Excel' | 'JSON';
  size?: string;
  status: 'ready' | 'generating' | 'stale';
}

const availableReports: Report[] = [
  {
    id: 'report-1-connection-inventory',
    name: 'Report 1: Connection Inventory & Segmentation',
    description: 'Total NetBond connections with breakdown by type (Cloud to Cloud, Internet to Cloud, Site to Cloud, VPN to Cloud, Datacenter to Cloud), bandwidth tiers, data center regions, cloud providers (AWS, Azure, Google, Oracle), Intelligent Peripheral Equipment (IPE), and average connections per customer',
    category: 'operations',
    lastGenerated: '2024-03-10T15:30:00Z',
    frequency: 'weekly',
    format: 'Excel',
    size: '2.1 MB',
    status: 'ready'
  },
  {
    id: 'report-2-ipe-capacity',
    name: 'Report 2: IPE Capacity & Provider Coverage',
    description: 'Total Intelligent Peripheral Equipment (IPE) that are NetBond enabled by region with provider on-ramp counts per location, total installed capacity per IPE (aggregated and per provider), and utilization for capacity planning',
    category: 'operations',
    lastGenerated: '2024-03-10T14:00:00Z',
    frequency: 'weekly',
    format: 'Excel',
    size: '1.9 MB',
    status: 'ready'
  },
  {
    id: 'report-3-utilization-analysis',
    name: 'Report 3: Connection Utilization Analysis',
    description: 'Total connection utilization per Intelligent Peripheral Equipment (IPE) site with installed capacity, average and max utilization at busiest hour, aggregated per site and portal level',
    category: 'performance',
    lastGenerated: '2024-03-10T12:00:00Z',
    frequency: 'daily',
    format: 'Excel',
    size: '3.4 MB',
    status: 'ready'
  },
  {
    id: 'report-4-weekly-trends',
    name: 'Report 4: Weekly Connection Trends',
    description: 'Weekly trends showing new connections added per week/site/provider, newly added customers per IPE and provider, upgraded/downgraded connections by MBC, deactivated connections, with trend visualization',
    category: 'operations',
    lastGenerated: '2024-03-10T08:00:00Z',
    frequency: 'weekly',
    format: 'PDF',
    size: '2.8 MB',
    status: 'ready'
  },
  {
    id: 'report-5-revenue-metrics',
    name: 'Report 5: Revenue & Financial Metrics',
    description: 'Total revenue per month for NetBond with last 12 months trend, total billed connections per month, average revenue per connection trends, average MBC trends, and average utilization of all aggregated connections',
    category: 'billing',
    lastGenerated: '2024-03-01T00:00:00Z',
    frequency: 'monthly',
    format: 'Excel',
    size: '2.5 MB',
    status: 'ready'
  },
  {
    id: 'report-6-service-reliability',
    name: 'Report 6: Service Reliability & Link Status',
    description: 'Total aggregated Links for NetBond, active/inactive/deactivated connections, active/inactive Links, connections impacted per site/region due to service disruption, and average minutes of service disruption',
    category: 'operations',
    lastGenerated: '2024-03-10T10:00:00Z',
    frequency: 'weekly',
    format: 'PDF',
    size: '1.7 MB',
    status: 'ready'
  },
  {
    id: 'report-7-customer-detail',
    name: 'Report 7: Per Customer Connection Report',
    description: 'Individual customer report showing my connections (active/inactive/deactivated), connection size and number of Links per connection, breakdown by provider and cloud region location, geographic regions, and utilization (average and max)',
    category: 'operations',
    lastGenerated: '2024-03-10T09:00:00Z',
    frequency: 'on-demand',
    format: 'PDF',
    size: '1.2 MB',
    status: 'ready'
  },
  {
    id: 'report-8-customer-analytics',
    name: 'Report 8: Customer Count & Analytics (PM Report)',
    description: 'Total number of customers by geographic region, net adds per month, average connections per customer per region, average spend per month per customer, and average spend per connection overall (ARPU)',
    category: 'billing',
    lastGenerated: '2024-03-08T16:30:00Z',
    frequency: 'monthly',
    format: 'Excel',
    size: '1.8 MB',
    status: 'ready'
  },
  {
    id: 'report-9-arpc-analysis',
    name: 'Report 9: ARPC & Revenue Per Connection Analysis',
    description: 'Average Revenue Per Connection (ARPC) breakdown by connection type, provider, region, and bandwidth tier with month-over-month trends and revenue optimization opportunities',
    category: 'billing',
    lastGenerated: '2024-03-10T14:30:00Z',
    frequency: 'monthly',
    format: 'Excel',
    size: '2.3 MB',
    status: 'ready'
  },
  {
    id: 'report-10-mbc-cost',
    name: 'Report 10: MBC Cost Analysis & Optimization',
    description: 'Maximum Billable Capacity (MBC) analysis showing current MBC per connection, actual utilization vs MBC, cost per Gbps, upgrade/downgrade recommendations, and potential cost savings',
    category: 'billing',
    lastGenerated: '2024-03-10T12:15:00Z',
    frequency: 'weekly',
    format: 'Excel',
    size: '2.7 MB',
    status: 'ready'
  },
  {
    id: 'report-11-provider-cost',
    name: 'Report 11: Provider Cost Comparison & Analysis',
    description: 'Cost comparison across providers (AWS, Azure, Google, Oracle) by region, connection type, bandwidth tier, total spend per provider, ARPC by provider, and cost efficiency metrics',
    category: 'billing',
    lastGenerated: '2024-03-09T10:00:00Z',
    frequency: 'monthly',
    format: 'PDF',
    size: '1.9 MB',
    status: 'ready'
  },
  {
    id: 'report-12-ipe-revenue',
    name: 'Report 12: IPE Revenue & Profitability Analysis',
    description: 'Total revenue per IPE site, revenue per region, capacity utilization impact on revenue, installed capacity ROI, and IPE site profitability rankings',
    category: 'billing',
    lastGenerated: '2024-03-08T08:30:00Z',
    frequency: 'monthly',
    format: 'Excel',
    size: '2.4 MB',
    status: 'ready'
  },
  {
    id: 'report-13-cost-forecast',
    name: 'Report 13: Revenue Forecast & Growth Projections',
    description: 'Revenue forecasting based on historical trends, new connection pipeline, MBC upgrade trends, customer growth projections, and 12-month revenue outlook by provider and region',
    category: 'billing',
    lastGenerated: '2024-03-07T15:45:00Z',
    frequency: 'monthly',
    format: 'PDF',
    size: '2.1 MB',
    status: 'ready'
  },
  {
    id: 'report-14-link-cost',
    name: 'Report 14: Link Cost & Economics Analysis',
    description: 'Cost per Link analysis, average Links per connection, revenue per Link, Link utilization economics, and cost efficiency by connection type and provider',
    category: 'billing',
    lastGenerated: '2024-03-10T11:00:00Z',
    frequency: 'weekly',
    format: 'Excel',
    size: '2.0 MB',
    status: 'ready'
  }
];

export function StandardReports() {
  const { selectedConnection, timeRange } = useMonitoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [generatingReports, setGeneratingReports] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  const getCategoryIcon = (category: Report['category']) => {
    switch (category) {
      case 'performance': return TrendingUp;
      case 'security': return Shield;
      case 'billing': return DollarSign;
      case 'operations': return Activity;
    }
  };

  const getCategoryColor = (category: Report['category']) => {
    switch (category) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-indigo-100 text-indigo-800';
      case 'billing': return 'bg-green-100 text-green-800';
      case 'operations': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Ready</span>;
      case 'generating':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Generating</span>;
      case 'stale':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Needs Update</span>;
    }
  };

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReports(prev => new Set(prev).add(reportId));

    setTimeout(() => {
      setGeneratingReports(prev => {
        const next = new Set(prev);
        next.delete(reportId);
        return next;
      });

      window.addToast?.({
        type: 'success',
        title: 'Report Generated',
        message: 'Your report has been generated and is ready to download',
        duration: 4000
      });
    }, 2000);
  };

  const handleDownloadReport = (report: Report) => {
    window.addToast?.({
      type: 'success',
      title: 'Download Started',
      message: `Downloading ${report.name}`,
      duration: 3000
    });
  };

  const getReportPreviewData = (reportId: string) => {
    switch (reportId) {
      case 'report-1-connection-inventory':
        return {
          summary: [
            { label: 'Total NetBond Connections', value: '1,247', trend: '+12%' },
            { label: 'Cloud to Cloud', value: '316', trend: '+18%' },
            { label: 'Internet to Cloud', value: '289', trend: '+15%' },
            { label: 'Site to Cloud', value: '342', trend: '+10%' }
          ],
          tables: [
            {
              title: 'Total Number of Connection Types and Breakdown',
              headers: ['Connection Type', 'Count', 'Percentage'],
              rows: [
                ['Cloud to Cloud', '316', '25.3%'],
                ['Internet to Cloud', '289', '23.2%'],
                ['Site to Cloud', '342', '27.4%'],
                ['VPN to Cloud', '187', '15.0%'],
                ['Datacenter to Cloud', '113', '9.1%']
              ]
            },
            {
              title: 'Connection Segmentation by Bandwidth Tier',
              headers: ['Bandwidth', 'Count', 'Percentage'],
              rows: [
                ['500 Mbps', '287', '23.0%'],
                ['1 Gbps', '421', '33.8%'],
                ['10 Gbps', '389', '31.2%'],
                ['100 Gbps', '150', '12.0%']
              ]
            },
            {
              title: 'Connections by Data Center Region',
              headers: ['Region', 'Connections', 'Percentage'],
              rows: [
                ['US East', '387', '31.0%'],
                ['US West', '342', '27.4%'],
                ['Europe', '298', '23.9%'],
                ['Asia Pacific', '220', '17.7%']
              ]
            },
            {
              title: 'Connections by Provider',
              headers: ['Provider', 'Connections', 'Avg per Customer'],
              rows: [
                ['AWS', '456', '3.2'],
                ['Azure', '398', '2.8'],
                ['Google', '247', '2.1'],
                ['Oracle', '146', '1.9']
              ]
            },
            {
              title: 'Connections per Intelligent Peripheral Equipment (IPE)',
              headers: ['IPE', 'Connections', 'Utilization'],
              rows: [
                ['Dallas-1', '142', '68%'],
                ['NYC-2', '158', '72%'],
                ['SFO-1', '127', '58%'],
                ['Chicago-1', '134', '76%']
              ]
            }
          ]
        };

      case 'report-2-ipe-capacity':
        return {
          summary: [
            { label: 'Total IPE', value: '42', trend: '+2' },
            { label: 'NetBond Enabled IPE', value: '38', trend: '90.5%' },
            { label: 'Total Installed Capacity', value: '2.4 Tbps', trend: '+240 Gbps' },
            { label: 'Total Utilization', value: '67%', trend: '+5%' }
          ],
          tables: [
            {
              title: 'NetBond-Enabled IPE by Region',
              headers: ['Region', 'Total IPE', 'NetBond Enabled', 'Geo Regions', 'Local Regions'],
              rows: [
                ['US East', '12', '11', '3', '8'],
                ['US West', '10', '9', '2', '7'],
                ['Europe', '8', '8', '4', '4'],
                ['Asia Pacific', '8', '7', '3', '4']
              ]
            },
            {
              title: 'Provider On-Ramps per IPE Location',
              headers: ['IPE Location', 'AWS', 'Azure', 'Google', 'Oracle', 'Total Providers'],
              rows: [
                ['Dallas-1', '✓', '✓', '✓', '✓', '4'],
                ['NYC-2', '✓', '✓', '✓', '—', '3'],
                ['SFO-1', '✓', '✓', '✓', '✓', '4'],
                ['London-1', '✓', '✓', '—', '—', '2']
              ]
            },
            {
              title: 'Total Installed Capacity per IPE Site',
              headers: ['IPE Site', 'AWS', 'Azure', 'Google', 'Oracle', 'Total Capacity', 'Utilization'],
              rows: [
                ['Dallas-1', '30 Gbps', '25 Gbps', '25 Gbps', '20 Gbps', '100 Gbps', '68%'],
                ['NYC-2', '40 Gbps', '35 Gbps', '30 Gbps', '—', '105 Gbps', '72%'],
                ['SFO-1', '25 Gbps', '20 Gbps', '20 Gbps', '15 Gbps', '80 Gbps', '58%'],
                ['Chicago-1', '30 Gbps', '25 Gbps', '20 Gbps', '15 Gbps', '90 Gbps', '76%']
              ]
            }
          ]
        };

      case 'report-3-utilization-analysis':
        return {
          summary: [
            { label: 'Peak Hour Utilization (Max)', value: '82%', trend: '+7%' },
            { label: 'Average Utilization', value: '64%', trend: '+3%' },
            { label: 'IPE Sites Over 80%', value: '8', trend: '+2' },
            { label: 'Total Installed Capacity', value: '2.4 Tbps', trend: '+240 Gbps' }
          ],
          tables: [
            {
              title: 'Total Connection Utilization per IPE Site',
              headers: ['IPE Site', 'Installed Capacity', 'Avg Utilization', 'Max Utilization (Busiest Hour)', 'Status'],
              rows: [
                ['Dallas-1', '100 Gbps', '68%', '85%', 'Healthy'],
                ['NYC-2', '105 Gbps', '72%', '89%', 'Monitor'],
                ['SFO-1', '80 Gbps', '58%', '72%', 'Healthy'],
                ['Chicago-1', '90 Gbps', '76%', '92%', 'Plan Upgrade'],
                ['Atlanta-1', '95 Gbps', '65%', '81%', 'Healthy'],
                ['Seattle-1', '75 Gbps', '62%', '78%', 'Healthy']
              ]
            },
            {
              title: 'Average and Max Utilization of All Aggregated Connections per Site',
              headers: ['Site', 'Total Connections', 'Avg Utilization', 'Max Utilization'],
              rows: [
                ['Dallas-1', '142', '68%', '85%'],
                ['NYC-2', '158', '72%', '89%'],
                ['SFO-1', '127', '58%', '72%'],
                ['Chicago-1', '134', '76%', '92%']
              ]
            },
            {
              title: 'Portal Level Average and Max Utilization',
              headers: ['Portal', 'Connections', 'Avg Utilization', 'Max Utilization'],
              rows: [
                ['Enterprise Portal', '847', '71%', '94%'],
                ['SMB Portal', '289', '54%', '78%'],
                ['Partner Portal', '111', '62%', '83%']
              ]
            }
          ]
        };

      case 'report-4-weekly-trends':
        return {
          summary: [
            { label: 'New Connections (This Week)', value: '47', trend: '+12 vs last week' },
            { label: 'New Customers', value: '14', trend: '+3' },
            { label: 'Upgraded Connections', value: '23', trend: '+5' },
            { label: 'Deactivated Connections', value: '12', trend: '-3' }
          ],
          tables: [
            {
              title: 'Total New Connections Added per Week',
              headers: ['Week Ending', 'New Connections', 'New per Site', 'New per Provider', 'Total Active'],
              rows: [
                ['Mar 3', '35', '8.8 avg', '8.8 avg', '1,188'],
                ['Mar 10', '42', '10.5 avg', '10.5 avg', '1,217'],
                ['Mar 17', '38', '9.5 avg', '9.5 avg', '1,243'],
                ['Mar 24', '47', '11.8 avg', '11.8 avg', '1,278']
              ]
            },
            {
              title: 'New Connections per Week by IPE Site and Provider',
              headers: ['Site', 'AWS', 'Azure', 'Google', 'Oracle', 'Total'],
              rows: [
                ['Dallas-1', '5', '4', '3', '2', '14'],
                ['NYC-2', '6', '5', '3', '1', '15'],
                ['SFO-1', '4', '4', '2', '1', '11'],
                ['Chicago-1', '3', '3', '1', '—', '7']
              ]
            },
            {
              title: 'Newly Added Customers per IPE and Provider',
              headers: ['IPE', 'New Customers', 'Primary Provider', 'Avg Connections'],
              rows: [
                ['Dallas-1', '4', 'AWS', '2.5'],
                ['NYC-2', '5', 'Azure', '3.0'],
                ['SFO-1', '3', 'AWS', '2.3'],
                ['Chicago-1', '2', 'Google', '2.0']
              ]
            },
            {
              title: 'Upgraded and Downgraded Connections by MBC',
              headers: ['Week', 'Upgraded MBC', 'Downgraded MBC', 'Net Change', 'Avg MBC'],
              rows: [
                ['Week 1', '18', '10', '+8', '4.1 Gbps'],
                ['Week 2', '21', '8', '+13', '4.2 Gbps'],
                ['Week 3', '19', '12', '+7', '4.3 Gbps'],
                ['Week 4', '23', '8', '+15', '4.5 Gbps']
              ]
            },
            {
              title: 'Deactivated Connections per Week Trend',
              headers: ['Week', 'Deactivated', 'Reason', 'Provider Impact'],
              rows: [
                ['Week 1', '15', 'Migration', 'AWS: 6, Azure: 5, Google: 3, Oracle: 1'],
                ['Week 2', '13', 'Cost Reduction', 'AWS: 5, Azure: 4, Google: 3, Oracle: 1'],
                ['Week 3', '14', 'Service End', 'AWS: 6, Azure: 4, Google: 3, Oracle: 1'],
                ['Week 4', '12', 'Migration', 'AWS: 5, Azure: 4, Google: 2, Oracle: 1']
              ]
            }
          ]
        };

      case 'report-5-revenue-metrics':
        return {
          summary: [
            { label: 'Monthly Revenue', value: '$2.8M', trend: '+8.2%' },
            { label: 'Billed Connections', value: '1,235', trend: '+47' },
            { label: 'ARPC', value: '$2,267', trend: '+$124' },
            { label: 'Average MBC', value: '4.2 Gbps', trend: '+0.3 Gbps' }
          ],
          tables: [
            {
              title: '12-Month Revenue Trend',
              headers: ['Month', 'Revenue', 'Connections', 'ARPC', 'Growth'],
              rows: [
                ['Jan 2024', '$2.58M', '1,188', '$2,172', '+6.2%'],
                ['Feb 2024', '$2.64M', '1,205', '$2,190', '+2.3%'],
                ['Mar 2024', '$2.72M', '1,221', '$2,228', '+3.0%'],
                ['Apr 2024', '$2.80M', '1,235', '$2,267', '+2.9%']
              ]
            },
            {
              title: 'Revenue by Connection Type',
              headers: ['Type', 'Connections', 'Revenue', 'ARPC'],
              rows: [
                ['AVPN', '542', '$1,465K', '$2,702'],
                ['Internet', '389', '$687K', '$1,766'],
                ['Cloud to Cloud', '316', '$648K', '$2,051']
              ]
            }
          ]
        };

      case 'report-6-service-reliability':
        return {
          summary: [
            { label: 'Total Aggregated Links', value: '3,847', trend: '+142' },
            { label: 'Active Connections', value: '1,235', trend: '+47' },
            { label: 'Active Links', value: '3,847', trend: '+142' },
            { label: 'Avg Downtime per Connection', value: '8.4 min', trend: '-2.1 min' }
          ],
          tables: [
            {
              title: 'Total Aggregated Links for NetBond',
              headers: ['Metric', 'Count', 'Percentage of Total'],
              rows: [
                ['Total Links', '3,870', '100%'],
                ['Active Links', '3,847', '99.4%'],
                ['Inactive Links', '23', '0.6%']
              ]
            },
            {
              title: 'Connection Status',
              headers: ['Status', 'Connections', 'Links', 'Percentage'],
              rows: [
                ['Active Connections', '1,235', '3,847', '99.0%'],
                ['Inactive Connections', '8', '14', '0.6%'],
                ['Deactivated/Deleted Connections', '4', '9', '0.3%']
              ]
            },
            {
              title: 'Links Status',
              headers: ['Status', 'Links', 'Avg per Connection', 'Percentage'],
              rows: [
                ['Active Links', '3,847', '3.1', '99.4%'],
                ['Inactive Links', '23', '2.9', '0.6%']
              ]
            },
            {
              title: 'Service Disruption Impact per Site/Region',
              headers: ['Region', 'IPE Sites', 'Connections Impacted', 'Incidents', 'Avg Downtime per Connection'],
              rows: [
                ['US East', '3', '47', '2', '12 min'],
                ['US West', '2', '23', '1', '6 min'],
                ['Europe', '4', '68', '3', '15 min'],
                ['Asia Pacific', '2', '19', '1', '8 min']
              ]
            },
            {
              title: 'Average Minutes of Service Disruption',
              headers: ['Period', 'Per Connection', 'Per Site', 'Per Region'],
              rows: [
                ['This Week', '8.4 min', '45 min', '127 min'],
                ['Last Week', '10.5 min', '52 min', '148 min'],
                ['This Month', '9.2 min', '48 min', '135 min']
              ]
            }
          ]
        };

      case 'report-7-customer-detail':
        return {
          summary: [
            { label: 'My Connections', value: '8', trend: '+2' },
            { label: 'Total Links', value: '24', trend: '+6' },
            { label: 'Average Utilization', value: '58%', trend: '+4%' },
            { label: 'Max Utilization', value: '89%', trend: '+8%' }
          ],
          tables: [
            {
              title: 'My Connections (Active/Inactive/Deactivated)',
              headers: ['Connection ID', 'Type', 'Connection Size', 'Number of Links', 'Status'],
              rows: [
                ['NB-47289', 'AWS Direct Connect', '10 Gbps', '4', 'Active'],
                ['NB-47291', 'Azure ExpressRoute', '5 Gbps', '3', 'Active'],
                ['NB-47305', 'Google Cloud Interconnect', '10 Gbps', '5', 'Active'],
                ['NB-47312', 'AWS Direct Connect', '1 Gbps', '2', 'Active'],
                ['NB-47156', 'Oracle FastConnect', '5 Gbps', '3', 'Active'],
                ['NB-46891', 'Azure ExpressRoute', '2 Gbps', '2', 'Inactive'],
                ['NB-45672', 'AWS Direct Connect', '1 Gbps', '1', 'Deactivated']
              ]
            },
            {
              title: 'My Connections per Provider',
              headers: ['Provider', 'Active', 'Inactive', 'Deactivated', 'Total', 'Total Links'],
              rows: [
                ['AWS', '3', '—', '1', '4', '11'],
                ['Azure', '2', '1', '—', '3', '8'],
                ['Google', '2', '—', '—', '2', '10'],
                ['Oracle', '1', '—', '—', '1', '3']
              ]
            },
            {
              title: 'My Connections per Cloud Region Location',
              headers: ['Provider', 'Cloud Region', 'Connections', 'Total Capacity'],
              rows: [
                ['AWS', 'us-east-1', '2', '11 Gbps'],
                ['AWS', 'us-west-2', '1', '10 Gbps'],
                ['Azure', 'East US', '2', '7 Gbps'],
                ['Google', 'us-central1', '1', '10 Gbps'],
                ['Google', 'us-west1', '1', '5 Gbps'],
                ['Oracle', 'us-ashburn-1', '1', '5 Gbps']
              ]
            },
            {
              title: 'My Connections per Geographic Region',
              headers: ['Geographic Region', 'Connections', 'Total Capacity', 'Providers'],
              rows: [
                ['US East', '4', '23 Gbps', 'AWS, Azure, Oracle'],
                ['US West', '3', '20 Gbps', 'AWS, Google'],
                ['US Central', '1', '10 Gbps', 'Google']
              ]
            },
            {
              title: 'Average and Max Utilization of My Connections',
              headers: ['Connection ID', 'Capacity', 'Avg Utilization', 'Max Utilization'],
              rows: [
                ['NB-47289', '10 Gbps', '62%', '89%'],
                ['NB-47291', '5 Gbps', '54%', '78%'],
                ['NB-47305', '10 Gbps', '58%', '82%'],
                ['NB-47312', '1 Gbps', '45%', '67%'],
                ['NB-47156', '5 Gbps', '61%', '85%']
              ]
            }
          ]
        };

      case 'report-8-customer-analytics':
        return {
          summary: [
            { label: 'Total Number of Customers', value: '427', trend: '+18 this month' },
            { label: 'Net Adds per Month', value: '+18', trend: '+6 vs last month' },
            { label: 'Avg Connections per Customer', value: '2.9', trend: '+0.2' },
            { label: 'ARPU (Avg Spend per Connection)', value: '$2,267', trend: '+$124' }
          ],
          tables: [
            {
              title: 'Total Number of Customers',
              headers: ['Period', 'Total Customers', 'Net Adds', 'Growth Rate'],
              rows: [
                ['Current Month', '427', '+18', '+4.4%'],
                ['Last Month', '409', '+12', '+3.0%'],
                ['2 Months Ago', '397', '+15', '+3.9%'],
                ['3 Months Ago', '382', '+19', '+5.2%']
              ]
            },
            {
              title: 'Customers per Geographic Region',
              headers: ['Geographic Region', 'Customers', 'Percentage', 'Net Adds', 'Growth'],
              rows: [
                ['US East', '147', '34.4%', '+8', '+5.8%'],
                ['US West', '122', '28.6%', '+5', '+4.3%'],
                ['Europe', '98', '23.0%', '+3', '+3.2%'],
                ['Asia Pacific', '60', '14.0%', '+2', '+3.4%']
              ]
            },
            {
              title: 'Net Adds per Month',
              headers: ['Month', 'New Customers', 'Churned', 'Net Adds', 'Total Customers'],
              rows: [
                ['January', '22', '4', '+18', '409'],
                ['February', '19', '6', '+13', '422'],
                ['March', '24', '5', '+19', '441'],
                ['April (Current)', '21', '3', '+18', '459']
              ]
            },
            {
              title: 'Average Connections per Customer, per Region',
              headers: ['Region', 'Total Customers', 'Total Connections', 'Avg Connections per Customer'],
              rows: [
                ['US East', '147', '471', '3.2'],
                ['US West', '122', '354', '2.9'],
                ['Europe', '98', '265', '2.7'],
                ['Asia Pacific', '60', '144', '2.4']
              ]
            },
            {
              title: 'Average Spend per Month per Customer',
              headers: ['Region', 'Avg Monthly Spend', 'Highest Spend', 'Lowest Spend'],
              rows: [
                ['US East', '$7,234', '$42,500', '$850'],
                ['US West', '$6,521', '$38,200', '$720'],
                ['Europe', '$6,189', '$35,800', '$690'],
                ['Asia Pacific', '$5,432', '$28,900', '$610']
              ]
            },
            {
              title: 'Average Spend per Connection Overall (ARPU)',
              headers: ['Month', 'Total Revenue', 'Total Connections', 'ARPU', 'Change'],
              rows: [
                ['January', '$2.58M', '1,188', '$2,172', '+$87'],
                ['February', '$2.64M', '1,205', '$2,190', '+$18'],
                ['March', '$2.72M', '1,221', '$2,228', '+$38'],
                ['April (Current)', '$2.80M', '1,235', '$2,267', '+$39']
              ]
            }
          ]
        };

      case 'report-9-arpc-analysis':
        return {
          summary: [
            { label: 'Overall ARPC', value: '$2,267', trend: '+$124 MoM' },
            { label: 'Highest ARPC (Provider)', value: '$2,845', trend: 'AWS' },
            { label: 'Highest ARPC (Type)', value: '$3,120', trend: 'Cloud to Cloud' },
            { label: 'Optimization Potential', value: '$142K/mo', trend: '+$28K vs last month' }
          ],
          tables: [
            {
              title: 'ARPC Breakdown by Connection Type',
              headers: ['Connection Type', 'Total Connections', 'Total Revenue', 'ARPC', 'MoM Change'],
              rows: [
                ['Cloud to Cloud', '316', '$986,320', '$3,120', '+$156'],
                ['Site to Cloud', '342', '$889,530', '$2,601', '+$98'],
                ['Internet to Cloud', '289', '$635,830', '$2,200', '+$112'],
                ['VPN to Cloud', '187', '$392,720', '$2,100', '+$87'],
                ['Datacenter to Cloud', '113', '$225,600', '$1,996', '+$45']
              ]
            },
            {
              title: 'ARPC by Provider',
              headers: ['Provider', 'Connections', 'Total Revenue', 'ARPC', 'YoY Change'],
              rows: [
                ['AWS', '456', '$1,297,320', '$2,845', '+14.2%'],
                ['Azure', '398', '$954,620', '$2,398', '+11.8%'],
                ['Google', '247', '$542,940', '$2,198', '+8.5%'],
                ['Oracle', '146', '$285,120', '$1,953', '+6.2%']
              ]
            },
            {
              title: 'ARPC by Region',
              headers: ['Region', 'Connections', 'Avg ARPC', 'Revenue Contribution', '%'],
              rows: [
                ['US East', '387', '$2,456', '$950,472', '33.9%'],
                ['US West', '342', '$2,312', '$790,704', '28.2%'],
                ['Europe', '298', '$2,187', '$651,726', '23.3%'],
                ['Asia Pacific', '220', '$2,045', '$449,900', '16.0%']
              ]
            },
            {
              title: 'ARPC by Bandwidth Tier',
              headers: ['Bandwidth', 'Connections', 'ARPC', 'Revenue', 'Cost per Gbps'],
              rows: [
                ['100 Gbps', '150', '$8,450', '$1,267,500', '$84.50'],
                ['10 Gbps', '389', '$3,280', '$1,275,920', '$328.00'],
                ['1 Gbps', '421', '$1,890', '$795,690', '$1,890.00'],
                ['500 Mbps', '287', '$1,245', '$357,315', '$2,490.00']
              ]
            }
          ]
        };

      case 'report-10-mbc-cost':
        return {
          summary: [
            { label: 'Avg MBC per Connection', value: '4.8 Gbps', trend: '+0.3 Gbps MoM' },
            { label: 'Underutilized (<60%)', value: '234 connections', trend: '18.9%' },
            { label: 'Right-sized (60-85%)', value: '847 connections', trend: '68.5%' },
            { label: 'Potential Savings', value: '$89K/mo', trend: 'Downgrade opportunities' }
          ],
          tables: [
            {
              title: 'MBC vs Actual Utilization Analysis',
              headers: ['Utilization Band', 'Connections', 'Avg MBC', 'Avg Utilization', 'Action', 'Est. Savings'],
              rows: [
                ['<40% (Under)', '87', '5.2 Gbps', '32%', 'Consider Downgrade', '$42,300/mo'],
                ['40-60% (Low)', '147', '4.8 Gbps', '52%', 'Monitor', '$28,400/mo'],
                ['60-85% (Optimal)', '847', '4.7 Gbps', '74%', 'No Action', '$0'],
                ['85-95% (High)', '123', '6.1 Gbps', '89%', 'Monitor', '$0'],
                ['>95% (Critical)', '43', '7.8 Gbps', '97%', 'Consider Upgrade', 'Revenue Opportunity']
              ]
            },
            {
              title: 'MBC Cost per Connection Type',
              headers: ['Connection Type', 'Avg MBC', 'Avg Cost per Gbps', 'Monthly Cost', 'Avg Utilization'],
              rows: [
                ['Cloud to Cloud', '6.2 Gbps', '$503', '$3,119', '78%'],
                ['Site to Cloud', '5.1 Gbps', '$510', '$2,601', '76%'],
                ['Internet to Cloud', '4.2 Gbps', '$524', '$2,201', '71%'],
                ['VPN to Cloud', '3.8 Gbps', '$553', '$2,101', '68%'],
                ['Datacenter to Cloud', '3.2 Gbps', '$624', '$1,997', '64%']
              ]
            },
            {
              title: 'Upgrade/Downgrade Recommendations',
              headers: ['Connection ID', 'Current MBC', 'Utilization', 'Recommendation', 'Monthly Impact'],
              rows: [
                ['NB-47289', '10 Gbps', '32%', 'Downgrade to 5 Gbps', '-$1,640 savings'],
                ['NB-47291', '5 Gbps', '96%', 'Upgrade to 10 Gbps', '+$1,300 revenue'],
                ['NB-47305', '10 Gbps', '28%', 'Downgrade to 5 Gbps', '-$1,640 savings'],
                ['NB-47312', '1 Gbps', '94%', 'Upgrade to 5 Gbps', '+$1,050 revenue'],
                ['NB-47156', '5 Gbps', '38%', 'Downgrade to 1 Gbps', '-$710 savings']
              ]
            },
            {
              title: 'MBC Trends by Provider',
              headers: ['Provider', 'Avg MBC', 'Change MoM', 'Upgraded This Month', 'Downgraded This Month'],
              rows: [
                ['AWS', '5.2 Gbps', '+0.4 Gbps', '18', '8'],
                ['Azure', '4.7 Gbps', '+0.3 Gbps', '16', '5'],
                ['Google', '4.3 Gbps', '+0.2 Gbps', '9', '4'],
                ['Oracle', '3.9 Gbps', '+0.1 Gbps', '4', '2']
              ]
            }
          ]
        };

      case 'report-11-provider-cost':
        return {
          summary: [
            { label: 'Total Monthly Revenue', value: '$2.80M', trend: '+8.2% MoM' },
            { label: 'Most Revenue (Provider)', value: '$1.30M', trend: 'AWS (46.3%)' },
            { label: 'Highest ARPC', value: '$2,845', trend: 'AWS' },
            { label: 'Most Efficient', value: '$84.50/Gbps', trend: '100 Gbps connections' }
          ],
          tables: [
            {
              title: 'Provider Revenue & Cost Comparison',
              headers: ['Provider', 'Connections', 'Total Revenue', 'ARPC', 'Market Share', 'MoM Growth'],
              rows: [
                ['AWS', '456', '$1,297,320', '$2,845', '46.3%', '+9.2%'],
                ['Azure', '398', '$954,620', '$2,398', '34.1%', '+8.4%'],
                ['Google', '247', '$542,940', '$2,198', '19.4%', '+6.8%'],
                ['Oracle', '146', '$285,120', '$1,953', '10.2%', '+5.1%']
              ]
            },
            {
              title: 'Provider Cost by Region',
              headers: ['Provider', 'US East', 'US West', 'Europe', 'Asia Pacific', 'Total'],
              rows: [
                ['AWS', '$442,320', '$398,200', '$287,900', '$168,900', '$1,297,320'],
                ['Azure', '$324,560', '$289,840', '$221,350', '$118,870', '$954,620'],
                ['Google', '$183,192', '$164,232', '$122,058', '$73,458', '$542,940'],
                ['Oracle', '$96,738', '$86,832', '$51,282', '$50,268', '$285,120']
              ]
            },
            {
              title: 'Provider Cost by Connection Type',
              headers: ['Connection Type', 'AWS', 'Azure', 'Google', 'Oracle', 'Total'],
              rows: [
                ['Cloud to Cloud', '$389,460', '$312,980', '$189,540', '$94,340', '$986,320'],
                ['Site to Cloud', '$356,040', '$267,030', '$162,780', '$103,680', '$889,530'],
                ['Internet to Cloud', '$254,330', '$190,990', '$114,600', '$75,910', '$635,830'],
                ['VPN to Cloud', '$157,090', '$117,810', '$70,720', '$47,100', '$392,720'],
                ['Datacenter to Cloud', '$90,240', '$67,680', '$45,120', '$22,560', '$225,600']
              ]
            },
            {
              title: 'Cost Efficiency Metrics by Provider',
              headers: ['Provider', 'Avg Cost per Gbps', 'Avg MBC', 'Utilization', 'Efficiency Score'],
              rows: [
                ['AWS', '$547', '5.2 Gbps', '76%', '94/100'],
                ['Azure', '$510', '4.7 Gbps', '73%', '91/100'],
                ['Google', '$511', '4.3 Gbps', '71%', '88/100'],
                ['Oracle', '$501', '3.9 Gbps', '68%', '85/100']
              ]
            }
          ]
        };

      case 'report-12-ipe-revenue':
        return {
          summary: [
            { label: 'Total IPE Sites', value: '42', trend: '+2 new sites' },
            { label: 'Total IPE Revenue', value: '$2.80M/mo', trend: '+$215K MoM' },
            { label: 'Avg Revenue per IPE', value: '$66,667', trend: '+$5,119' },
            { label: 'Most Profitable IPE', value: '$142,800', trend: 'NYC-2' }
          ],
          tables: [
            {
              title: 'Revenue per IPE Site',
              headers: ['IPE Site', 'Connections', 'Total Revenue', 'Avg per Connection', 'Capacity Util', 'ROI Score'],
              rows: [
                ['NYC-2', '158', '$442,530', '$2,801', '72%', '98/100'],
                ['Dallas-1', '142', '$398,420', '$2,806', '68%', '96/100'],
                ['Chicago-1', '134', '$378,240', '$2,823', '76%', '94/100'],
                ['SFO-1', '127', '$342,580', '$2,697', '58%', '89/100'],
                ['Atlanta-1', '118', '$312,890', '$2,652', '65%', '91/100'],
                ['Seattle-1', '104', '$268,340', '$2,580', '62%', '87/100']
              ]
            },
            {
              title: 'IPE Revenue by Region',
              headers: ['Region', 'IPE Sites', 'Total Connections', 'Total Revenue', 'Avg per Site', 'Growth'],
              rows: [
                ['US East', '11', '387', '$950,472', '$86,407', '+12.4%'],
                ['US West', '9', '342', '$790,704', '$87,856', '+10.8%'],
                ['Europe', '8', '298', '$651,726', '$81,466', '+8.9%'],
                ['Asia Pacific', '7', '220', '$449,900', '$64,271', '+7.2%']
              ]
            },
            {
              title: 'IPE Capacity ROI Analysis',
              headers: ['IPE Site', 'Installed Capacity', 'Utilization', 'Monthly Revenue', 'Revenue per Gbps', 'Status'],
              rows: [
                ['NYC-2', '105 Gbps', '72%', '$442,530', '$4,215', 'Optimal'],
                ['Dallas-1', '100 Gbps', '68%', '$398,420', '$3,984', 'Optimal'],
                ['Chicago-1', '90 Gbps', '76%', '$378,240', '$4,203', 'Consider Expansion'],
                ['SFO-1', '80 Gbps', '58%', '$342,580', '$4,282', 'Underutilized'],
                ['Atlanta-1', '95 Gbps', '65%', '$312,890', '$3,294', 'Optimal']
              ]
            },
            {
              title: 'IPE Site Profitability Rankings',
              headers: ['Rank', 'IPE Site', 'Revenue', 'Efficiency', 'Growth Rate', 'Customer Satisfaction'],
              rows: [
                ['1', 'NYC-2', '$442,530', '98%', '+14.2%', '4.8/5'],
                ['2', 'Dallas-1', '$398,420', '96%', '+12.8%', '4.7/5'],
                ['3', 'Chicago-1', '$378,240', '94%', '+11.5%', '4.6/5'],
                ['4', 'SFO-1', '$342,580', '89%', '+9.2%', '4.5/5'],
                ['5', 'Atlanta-1', '$312,890', '91%', '+10.1%', '4.6/5']
              ]
            }
          ]
        };

      case 'report-13-cost-forecast':
        return {
          summary: [
            { label: '12-Month Forecast', value: '$37.2M', trend: '+18.5% YoY' },
            { label: 'Next Quarter Projection', value: '$8.9M', trend: '+$1.2M vs Q1' },
            { label: 'New Connection Pipeline', value: '127 connections', trend: '$342K/mo potential' },
            { label: 'Confidence Level', value: '94%', trend: 'High confidence' }
          ],
          tables: [
            {
              title: '12-Month Revenue Forecast',
              headers: ['Month', 'Projected Revenue', 'New Connections', 'Upgrades', 'Total Connections', 'Growth Rate'],
              rows: [
                ['Apr 2024', '$2.89M', '52', '21', '1,289', '+3.2%'],
                ['May 2024', '$2.98M', '48', '19', '1,337', '+3.1%'],
                ['Jun 2024', '$3.08M', '54', '23', '1,391', '+3.4%'],
                ['Jul 2024', '$3.18M', '51', '20', '1,442', '+3.2%'],
                ['Aug 2024', '$3.26M', '47', '18', '1,489', '+2.5%'],
                ['Sep 2024', '$3.35M', '49', '22', '1,538', '+2.8%'],
                ['Oct 2024', '$3.44M', '53', '24', '1,591', '+2.7%'],
                ['Nov 2024', '$3.52M', '46', '19', '1,637', '+2.3%'],
                ['Dec 2024', '$3.61M', '50', '21', '1,687', '+2.6%']
              ]
            },
            {
              title: 'Revenue Forecast by Provider',
              headers: ['Provider', 'Current Revenue', 'Q2 Projection', 'Q3 Projection', 'Q4 Projection', 'YoY Growth'],
              rows: [
                ['AWS', '$1,297,320', '$1,426,052', '$1,568,457', '$1,725,303', '+19.2%'],
                ['Azure', '$954,620', '$1,050,082', '$1,155,090', '$1,270,599', '+18.4%'],
                ['Google', '$542,940', '$597,234', '$656,957', '$722,653', '+16.8%'],
                ['Oracle', '$285,120', '$313,632', '$344,995', '$379,495', '+15.2%']
              ]
            },
            {
              title: 'New Connection Pipeline Impact',
              headers: ['Status', 'Connections', 'Estimated MBC', 'Monthly Revenue', 'Expected Close', 'Probability'],
              rows: [
                ['Contract Signed', '23', '115 Gbps', '$78,200', 'Apr 2024', '95%'],
                ['Final Review', '34', '178 Gbps', '$112,400', 'May 2024', '85%'],
                ['Proposal Stage', '41', '198 Gbps', '$98,600', 'Jun 2024', '65%'],
                ['Discovery', '29', '142 Gbps', '$52,800', 'Jul 2024', '45%']
              ]
            },
            {
              title: 'MBC Upgrade Trend Forecast',
              headers: ['Quarter', 'Expected Upgrades', 'Avg MBC Increase', 'Revenue Impact', 'Expected Downgrades', 'Net Impact'],
              rows: [
                ['Q2 2024', '63', '+2.8 Gbps', '+$189,000', '16', '+$163,800'],
                ['Q3 2024', '68', '+3.1 Gbps', '+$204,000', '14', '+$181,600'],
                ['Q4 2024', '72', '+3.2 Gbps', '+$218,400', '15', '+$194,400']
              ]
            },
            {
              title: 'Revenue Growth by Region Forecast',
              headers: ['Region', 'Current', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Growth Rate'],
              rows: [
                ['US East', '$950,472', '$1,045,519', '$1,150,071', '$1,265,078', '+18.5%'],
                ['US West', '$790,704', '$869,774', '$956,752', '$1,052,427', '+18.9%'],
                ['Europe', '$651,726', '$716,899', '$788,589', '$867,448', '+17.2%'],
                ['Asia Pacific', '$449,900', '$494,890', '$544,379', '$598,817', '+16.8%']
              ]
            }
          ]
        };

      case 'report-14-link-cost':
        return {
          summary: [
            { label: 'Total Active Links', value: '3,847', trend: '+142 links' },
            { label: 'Avg Links per Connection', value: '3.1', trend: '+0.2' },
            { label: 'Revenue per Link', value: '$728', trend: '+$42' },
            { label: 'Most Efficient', value: '3.8 Links', trend: 'Cloud to Cloud' }
          ],
          tables: [
            {
              title: 'Cost per Link Analysis',
              headers: ['Connection Type', 'Total Links', 'Total Connections', 'Avg Links/Conn', 'Revenue/Link', 'Cost Efficiency'],
              rows: [
                ['Cloud to Cloud', '1,201', '316', '3.8', '$821', 'Excellent'],
                ['Site to Cloud', '1,061', '342', '3.1', '$838', 'Excellent'],
                ['Internet to Cloud', '896', '289', '3.1', '$710', 'Good'],
                ['VPN to Cloud', '542', '187', '2.9', '$725', 'Good'],
                ['Datacenter to Cloud', '338', '113', '3.0', '$667', 'Fair']
              ]
            },
            {
              title: 'Link Utilization Economics',
              headers: ['Link Utilization', 'Links', 'Avg Revenue/Link', 'Total Revenue', 'Optimization Status'],
              rows: [
                ['High (>80%)', '1,234', '$842', '$1,039,428', 'Optimal - Monitor for upgrades'],
                ['Medium (60-80%)', '2,089', '$728', '$1,520,792', 'Optimal - No action needed'],
                ['Low (40-60%)', '401', '$645', '$258,645', 'Review - Possible consolidation'],
                ['Very Low (<40%)', '123', '$512', '$62,976', 'Action - Consider deactivation']
              ]
            },
            {
              title: 'Average Links per Connection by Provider',
              headers: ['Provider', 'Total Links', 'Total Connections', 'Avg Links/Connection', 'Link Cost', 'Change MoM'],
              rows: [
                ['AWS', '1,459', '456', '3.2', '$889', '+4.2%'],
                ['Azure', '1,234', '398', '3.1', '$774', '+3.8%'],
                ['Google', '765', '247', '3.1', '$710', '+2.9%'],
                ['Oracle', '453', '146', '3.1', '$629', '+2.1%']
              ]
            },
            {
              title: 'Link Cost Efficiency by Connection Type and Provider',
              headers: ['Connection Type', 'AWS', 'Azure', 'Google', 'Oracle', 'Avg'],
              rows: [
                ['Cloud to Cloud', '$878', '$812', '$798', '$745', '$821'],
                ['Site to Cloud', '$892', '$842', '$821', '$798', '$838'],
                ['Internet to Cloud', '$745', '$712', '$689', '$672', '$710'],
                ['VPN to Cloud', '$768', '$732', '$701', '$689', '$725'],
                ['Datacenter to Cloud', '$712', '$672', '$645', '$621', '$667']
              ]
            },
            {
              title: 'Link Economics Optimization Opportunities',
              headers: ['Opportunity', 'Links Affected', 'Current Revenue', 'Potential Revenue', 'Monthly Impact', 'Priority'],
              rows: [
                ['Consolidate underutilized links', '123', '$62,976', '$0', '-$62,976 cost', 'High'],
                ['Upgrade high-utilization links', '87', '$73,254', '$94,500', '+$21,246 revenue', 'High'],
                ['Right-size medium links', '234', '$151,020', '$168,900', '+$17,880 revenue', 'Medium'],
                ['Optimize provider mix', '456', '$331,968', '$362,880', '+$30,912 revenue', 'Medium'],
                ['Deactivate inactive links', '23', '$11,776', '$0', '-$11,776 cost', 'Low']
              ]
            }
          ]
        };

      default:
        return null;
    }
  };

  const filteredReports = availableReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Reports', count: availableReports.length },
    { id: 'performance', label: 'Performance', count: availableReports.filter(r => r.category === 'performance').length },
    { id: 'security', label: 'Security', count: availableReports.filter(r => r.category === 'security').length },
    { id: 'billing', label: 'Billing', count: availableReports.filter(r => r.category === 'billing').length },
    { id: 'operations', label: 'Operations', count: availableReports.filter(r => r.category === 'operations').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Standard Reports</h3>
          <p className="text-sm text-gray-600 mt-1">
            NetBond service reports for inventory, capacity, utilization, trends, and customer analytics
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            window.addToast?.({
              type: 'info',
              title: 'Generating Reports',
              message: 'Generating all standard reports. This may take a few minutes.',
              duration: 5000
            });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Generate All Reports
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label} ({cat.count})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'card'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-500'
            }`}
            title="Card View"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'table'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-500'
            }`}
            title="Table View"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Reports View */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => {
            const Icon = getCategoryIcon(report.category);
            const isGenerating = generatingReports.has(report.id);

            return (
              <div
                key={report.id}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {report.name}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(report.category)}`}>
                  {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                </span>
                {getStatusBadge(isGenerating ? 'generating' : report.status)}
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  {report.format}
                </span>
                <span className="px-2 py-1 text-xs text-gray-500">
                  {report.frequency}
                </span>
              </div>

              {report.lastGenerated && (
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>
                    Last generated: {new Date(report.lastGenerated).toLocaleDateString()} at{' '}
                    {new Date(report.lastGenerated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {report.size && (
                    <span className="ml-2 text-gray-400">• {report.size}</span>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                {report.lastGenerated && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewReport(report)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      Preview
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadReport(report)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Download
                    </Button>
                  </>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-1.5" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => {
                const Icon = getCategoryIcon(report.category);
                const isGenerating = generatingReports.has(report.id);

                return (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gray-100 rounded-lg">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-xs text-gray-500">
                            {report.format} • {report.frequency}
                            {report.size && ` • ${report.size}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(report.category)}`}>
                        {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.lastGenerated ? (
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span>
                            {new Date(report.lastGenerated).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(isGenerating ? 'generating' : report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {report.lastGenerated && (
                          <>
                            <button
                              onClick={() => setPreviewReport(report)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadReport(report)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleGenerateReport(report.id)}
                          disabled={isGenerating}
                          className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Generate"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Report Preview Modal */}
      {previewReport && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewReport(null)}
          title={previewReport.name}
          size="xl"
        >
          <div className="space-y-6">
            {(() => {
              const previewData = getReportPreviewData(previewReport.id);
              if (!previewData) return null;

              return (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewData.summary.map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          {item.label}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <div className="text-2xl font-bold text-gray-900">
                            {item.value}
                          </div>
                          <div className="text-xs font-semibold text-green-600">
                            {item.trend}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Data Tables */}
                  {previewData.tables.map((table, tableIdx) => (
                    <div key={tableIdx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900">{table.title}</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {table.headers.map((header, headerIdx) => (
                                <th
                                  key={headerIdx}
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {table.rows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="secondary"
                      onClick={() => setPreviewReport(null)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="secondary"
                      icon={Download}
                      onClick={() => {
                        handleDownloadReport(previewReport);
                        setPreviewReport(null);
                      }}
                    >
                      Download Report
                    </Button>
                    <Button
                      variant="primary"
                      icon={FileText}
                      onClick={() => {
                        handleGenerateReport(previewReport.id);
                        setPreviewReport(null);
                      }}
                    >
                      Generate New
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
}
