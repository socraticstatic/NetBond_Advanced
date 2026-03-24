import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cloud, Network, Globe, Plus, Undo, Play, Check, Save, Trash2, Sparkles, Shield, Router, Database, Cpu, Workflow, Car, Home, Gamepad, Smartphone, Clock, FileText, Users,
  Server, MessageSquare, Send, ArrowRight, X, Building, Zap, Star, Search, Filter, Lock, Activity, BarChart3, Layers, Plug, Code, Wrench, ShieldCheck
} from 'lucide-react';
import { MarketplaceItem, MarketplaceFilter, MarketplaceCategory } from '../types/connection';
import { AttIcon } from './icons/AttIcon';
import { Button } from './common/Button';
import { CategoryGrid } from './marketplace/CategoryGrid';
import { CollectionGrid } from './marketplace/CollectionGrid';
import { ApplicationSolutionZone } from './marketplace/ApplicationSolutionZone';
import { AWSPartnerZone } from './marketplace/AWSPartnerZone';

interface MarketplaceProps {
  onSelectItem: (item: MarketplaceItem) => void;
}

// Marketplace items organized by type
const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  // Connections
  {
    id: 'internet-to-cloud',
    provider: 'Multi-Cloud',
    name: 'Internet to Cloud',
    description: 'High-performance internet connectivity to cloud services',
    type: 'Internet to Cloud',
    bandwidthOptions: ['100 Mbps', '200 Mbps', '500 Mbps', '1 Gbps'],
    basePrice: 40,
    features: [
      'Dynamic Defense',
      'DDoS protection',
      'Web application firewall',
      'Public IP addressing'
    ],
    icon: 'internet',
    category: 'Internet',
    tags: ['Internet', 'Public Access', 'DDoS Protection', 'WAF'],
    rating: { score: 4.8, count: 156 },
    popularity: 95,
    sla: {
      uptime: '99.99%',
      latency: '<10ms',
      support: '24/7'
    }
  },
  {
    id: 'aws-direct',
    provider: '24 hour Internet',
    name: 'AT&T Direct Connect',
    description: 'Dedicated network connection to AT&T cloud services',
    type: 'Direct Connect',
    bandwidthOptions: ['1 Gbps', '10 Gbps', '100 Gbps'],
    basePrice: 100,
    features: [
      'Dedicated connection',
      'Low latency',
      'Consistent performance',
      'Private connectivity'
    ],
    icon: 'cloud',
    category: 'Direct Connect',
    tags: ['AWS', 'Enterprise', 'High Performance'],
    rating: { score: 4.9, count: 234 },
    popularity: 98,
    sla: {
      uptime: '99.99%',
      latency: '<5ms',
      support: '24/7'
    }
  },
  {
    id: 'azure-express',
    provider: 'Azure',
    name: 'AT&T ExpressRoute',
    description: 'Private connection to Microsoft Azure',
    type: 'ExpressRoute',
    bandwidthOptions: ['1 Gbps', '10 Gbps', '100 Gbps'],
    basePrice: 100,
    features: [
      'Private peering',
      'Microsoft peering',
      'Global reach',
      'Redundant connections'
    ],
    icon: 'cloud',
    category: 'Direct Connect',
    tags: ['Azure', 'Enterprise', 'Global'],
    rating: { score: 4.7, count: 189 },
    popularity: 92,
    sla: {
      uptime: '99.95%',
      latency: '<5ms',
      support: '24/7'
    }
  },
  {
    id: 'vpn-service',
    provider: 'AT&T',
    name: 'Site-to-Site VPN',
    description: 'Secure VPN tunnels between locations',
    type: 'VPN',
    bandwidthOptions: ['100 Mbps', '500 Mbps', '1 Gbps'],
    basePrice: 60,
    features: [
      'IPSec encryption',
      'Redundant tunnels',
      'BGP routing',
      'NAT traversal'
    ],
    icon: 'network',
    category: 'VPN',
    tags: ['VPN', 'Security', 'Remote Access'],
    rating: { score: 4.4, count: 123 },
    popularity: 82,
    sla: {
      uptime: '99.9%',
      latency: '<20ms',
      support: '24/7'
    }
  },
  {
    id: 'cloud-router',
    provider: 'Multi-Cloud',
    name: 'Cloud Router',
    description: 'Intelligent routing between cloud providers',
    type: 'Router',
    bandwidthOptions: ['1 Gbps', '10 Gbps', '100 Gbps'],
    basePrice: 120,
    features: [
      'Multi-cloud routing',
      'Load balancing',
      'Traffic optimization',
      'Failover'
    ],
    icon: 'network',
    category: 'Network Services',
    tags: ['Multi-Cloud', 'Enterprise', 'Routing'],
    rating: { score: 4.7, count: 98 },
    popularity: 78,
    sla: {
      uptime: '99.99%',
      latency: '<8ms',
      support: '24/7'
    } 
  },
  {
    id: 'private-connect',
    provider: 'AT&T',
    name: 'Private Connect',
    description: 'Dedicated private network connection',
    type: 'Private Network',
    bandwidthOptions: ['1 Gbps', '10 Gbps', '40 Gbps'],
    basePrice: 200,
    features: [
      'Dedicated bandwidth',
      'End-to-end encryption',
      'Custom routing',
      'Priority support'
    ],
    icon: 'network',
    category: 'Private Network',
    tags: ['Private', 'Enterprise', 'Dedicated'],
    rating: { score: 4.8, count: 145 },
    popularity: 89,
    sla: {
      uptime: '99.999%',
      latency: '<2ms',
      support: '24/7'
    }
  },

  // AT&T Add-ons & Services
  {
    id: 'dynamic-defense',
    provider: 'AT&T',
    name: 'Dynamic Defense',
    description: 'Advanced DDoS protection and threat mitigation',
    type: 'Security Add-on',
    bandwidthOptions: ['Included'],
    basePrice: 250,
    features: [
      'Real-time DDoS mitigation',
      'Layer 3-7 protection',
      'Threat intelligence',
      'Traffic analysis',
      'Automated response'
    ],
    icon: 'shield',
    category: 'Security',
    tags: ['Security', 'DDoS', 'Threat Protection', 'Add-on'],
    rating: { score: 4.9, count: 312 },
    popularity: 96,
    sla: {
      uptime: '99.99%',
      latency: '<2ms',
      support: '24/7'
    },
    addon: true
  },
  {
    id: 'enhanced-internet',
    provider: 'AT&T',
    name: 'Enhanced Internet',
    description: 'Burstable bandwidth internet with built-in DDoS protection and performance monitoring',
    type: 'Internet Service',
    bandwidthOptions: ['10 Mbps', '100 Mbps', '1 Gbps', '10 Gbps'],
    basePrice: 150,
    features: [
      'Burstable bandwidth up to 10 Gbps',
      'Built-in DDoS scrubbing',
      'BGP routing support',
      'Performance SLA guarantees',
      'Proactive network monitoring'
    ],
    icon: 'internet',
    category: 'Internet',
    tags: ['Internet', 'DDoS', 'Burstable', 'Enterprise'],
    rating: { score: 4.7, count: 287 },
    popularity: 93,
    sla: {
      uptime: '99.95%',
      latency: '<15ms',
      support: '24/7'
    },
    addon: false
  },
  {
    id: 'dedicated-internet',
    provider: 'AT&T',
    name: 'Dedicated Internet',
    description: 'Symmetrical, guaranteed-bandwidth internet with SLA-backed performance',
    type: 'Internet Service',
    bandwidthOptions: ['100 Mbps', '1 Gbps', '10 Gbps', '100 Gbps'],
    basePrice: 300,
    features: [
      'Symmetrical upload/download speeds',
      'Guaranteed bandwidth commitment',
      'Multiple IP address blocks',
      'Dual-stack IPv4/IPv6',
      '24/7 proactive monitoring'
    ],
    icon: 'internet',
    category: 'Internet',
    tags: ['Internet', 'Dedicated', 'Symmetrical', 'Enterprise'],
    rating: { score: 4.8, count: 412 },
    popularity: 94,
    sla: {
      uptime: '99.99%',
      latency: '<10ms',
      support: '24/7'
    },
    addon: false
  },
  {
    id: 'att-netbond',
    provider: 'AT&T',
    name: 'NetBond for Cloud',
    description: 'Private, secure connectivity to major cloud providers over AT&T MPLS backbone',
    type: 'Direct Connect',
    bandwidthOptions: ['50 Mbps', '100 Mbps', '1 Gbps', '10 Gbps'],
    basePrice: 500,
    features: [
      'Private MPLS backbone to cloud',
      'Multi-cloud support (AWS, Azure, GCP, Oracle)',
      'Traffic encryption in transit',
      'Dynamic bandwidth allocation',
      'Integrated cloud gateway'
    ],
    icon: 'cloud',
    category: 'Direct Connect',
    tags: ['Cloud', 'MPLS', 'Private', 'Multi-Cloud'],
    rating: { score: 4.9, count: 356 },
    popularity: 97,
    sla: {
      uptime: '99.99%',
      latency: '<5ms',
      support: '24/7'
    },
    addon: false
  },
  {
    id: 'att-sd-wan',
    provider: 'AT&T',
    name: 'AT&T SD-WAN',
    description: 'Software-defined WAN with application-aware routing and centralized orchestration',
    type: 'Network Service',
    bandwidthOptions: ['100 Mbps', '500 Mbps', '1 Gbps', '10 Gbps'],
    basePrice: 800,
    features: [
      'Application-aware path selection',
      'Centralized policy orchestration',
      'Multi-transport support (MPLS, broadband, LTE)',
      'Zero-touch provisioning',
      'Real-time analytics dashboard'
    ],
    icon: 'network',
    category: 'Network Services',
    tags: ['SD-WAN', 'WAN', 'Automation', 'Enterprise'],
    rating: { score: 4.8, count: 298 },
    popularity: 91,
    sla: {
      uptime: '99.99%',
      latency: '<10ms',
      support: '24/7'
    },
    addon: false
  },
  {
    id: 'att-flexware',
    provider: 'AT&T',
    name: 'AT&T FlexWare',
    description: 'Universal CPE platform running virtual network functions on commodity hardware',
    type: 'VNF',
    bandwidthOptions: ['100 Mbps', '1 Gbps', '10 Gbps'],
    basePrice: 600,
    features: [
      'Universal CPE platform',
      'Multiple VNFs on single device',
      'Remote lifecycle management',
      'Service chaining',
      'White-box hardware'
    ],
    icon: 'network',
    category: 'VNF',
    tags: ['VNF', 'uCPE', 'FlexWare', 'Network Functions'],
    rating: { score: 4.6, count: 178 },
    popularity: 84,
    sla: {
      uptime: '99.99%',
      latency: '<5ms',
      support: '24/7'
    },
    vnf: true
  },
  {
    id: 'att-ddos-defense',
    provider: 'AT&T',
    name: 'AT&T DDoS Defense',
    description: 'Carrier-grade volumetric DDoS detection and mitigation at network edge',
    type: 'Security Add-on',
    bandwidthOptions: ['Included'],
    basePrice: 400,
    features: [
      'Volumetric attack mitigation up to Tbps',
      'Always-on or on-demand modes',
      'Network-edge scrubbing centers',
      'AT&T threat intelligence feeds',
      'Real-time attack dashboards'
    ],
    icon: 'shield',
    category: 'Security',
    tags: ['Security', 'DDoS', 'Mitigation', 'Add-on'],
    rating: { score: 4.9, count: 345 },
    popularity: 95,
    sla: {
      uptime: '99.99%',
      latency: '<2ms',
      support: '24/7'
    },
    addon: true
  },
  {
    id: 'att-threat-manager',
    provider: 'AT&T',
    name: 'Threat Manager',
    description: 'Unified security management with SIEM, vulnerability scanning, and compliance reporting',
    type: 'Security Add-on',
    bandwidthOptions: ['Included'],
    basePrice: 550,
    features: [
      'SIEM and log management',
      'Vulnerability scanning',
      'Asset discovery',
      'Compliance reporting (PCI, HIPAA)',
      'Threat intelligence correlation'
    ],
    icon: 'shield',
    category: 'Security',
    tags: ['Security', 'SIEM', 'Compliance', 'Threat Detection', 'Add-on'],
    rating: { score: 4.7, count: 234 },
    popularity: 88,
    sla: {
      uptime: '99.99%',
      latency: '<5ms',
      support: '24/7'
    },
    addon: true
  },
  {
    id: 'att-internet-protect',
    provider: 'AT&T',
    name: 'Internet Protect',
    description: 'Cloud-based secure web gateway with DNS filtering and malware protection',
    type: 'Security Add-on',
    bandwidthOptions: ['Included'],
    basePrice: 200,
    features: [
      'DNS-layer security',
      'Web content filtering',
      'Malware and phishing protection',
      'Cloud-delivered - no hardware required',
      'Per-user or per-site licensing'
    ],
    icon: 'shield',
    category: 'Security',
    tags: ['Security', 'DNS', 'Web Filtering', 'Cloud Security', 'Add-on'],
    rating: { score: 4.6, count: 189 },
    popularity: 86,
    sla: {
      uptime: '99.9%',
      latency: '<10ms',
      support: '24/7'
    },
    addon: true
  },
  {
    id: 'att-managed-firewall',
    provider: 'AT&T',
    name: 'AT&T Managed Firewall',
    description: 'Fully managed next-gen firewall with 24/7 SOC monitoring and policy management',
    type: 'Security Add-on',
    bandwidthOptions: ['Included'],
    basePrice: 450,
    features: [
      'Next-gen firewall management',
      'Intrusion prevention system',
      'Application-layer control',
      'URL and content filtering',
      '24/7 SOC monitoring'
    ],
    icon: 'shield',
    category: 'Security',
    tags: ['Firewall', 'Security', 'Managed Service', 'SOC', 'Add-on'],
    rating: { score: 4.7, count: 256 },
    popularity: 89,
    sla: {
      uptime: '99.99%',
      latency: '<3ms',
      support: '24/7'
    },
    addon: true
  },

  // Virtual Network Functions (VNFs)
  {
    id: 'vnf-palo-alto',
    provider: 'Palo Alto Networks',
    name: 'VM-Series Firewall',
    description: 'Next-generation firewall with ML-powered security',
    type: 'VNF',
    bandwidthOptions: ['1 Gbps', '5 Gbps', '10 Gbps'],
    basePrice: 1500,
    features: [
      'Advanced threat prevention',
      'URL filtering',
      'Application control',
      'SSL decryption',
      'WildFire malware analysis'
    ],
    icon: 'shield',
    category: 'VNF',
    tags: ['VNF', 'Firewall', 'Security', 'Enterprise'],
    rating: { score: 4.9, count: 445 },
    popularity: 94,
    sla: {
      uptime: '99.99%',
      latency: '<5ms',
      support: '24/7'
    },
    vnf: true
  },
  {
    id: 'vnf-cisco-sdwan',
    provider: 'Cisco',
    name: 'Viptela SD-WAN',
    description: 'Software-defined WAN with intelligent path selection',
    type: 'VNF',
    bandwidthOptions: ['1 Gbps', '10 Gbps', '100 Gbps'],
    basePrice: 2000,
    features: [
      'Multi-cloud connectivity',
      'Application-aware routing',
      'Zero-touch provisioning',
      'Integrated security',
      'Real-time analytics'
    ],
    icon: 'network',
    category: 'VNF',
    tags: ['VNF', 'SD-WAN', 'Routing', 'Multi-Cloud'],
    rating: { score: 4.8, count: 389 },
    popularity: 92,
    sla: {
      uptime: '99.99%',
      latency: '<8ms',
      support: '24/7'
    },
    vnf: true
  },
  {
    id: 'vnf-fortinet',
    provider: 'Fortinet',
    name: 'FortiGate Virtual Firewall',
    description: 'High-performance virtual security appliance',
    type: 'VNF',
    bandwidthOptions: ['2 Gbps', '10 Gbps', '20 Gbps'],
    basePrice: 1200,
    features: [
      'IPS/IDS',
      'Web filtering',
      'Anti-malware',
      'VPN gateway',
      'Traffic shaping'
    ],
    icon: 'shield',
    category: 'VNF',
    tags: ['VNF', 'Firewall', 'IPS', 'Security'],
    rating: { score: 4.7, count: 334 },
    popularity: 88,
    sla: {
      uptime: '99.99%',
      latency: '<6ms',
      support: '24/7'
    },
    vnf: true
  },
  {
    id: 'vnf-f5-load-balancer',
    provider: 'F5 Networks',
    name: 'BIG-IP Virtual Edition',
    description: 'Advanced application delivery and load balancing',
    type: 'VNF',
    bandwidthOptions: ['5 Gbps', '10 Gbps', '25 Gbps'],
    basePrice: 1800,
    features: [
      'Layer 4-7 load balancing',
      'SSL offloading',
      'Application security',
      'Traffic management',
      'Health monitoring'
    ],
    icon: 'network',
    category: 'VNF',
    tags: ['VNF', 'Load Balancer', 'ADC', 'Performance'],
    rating: { score: 4.8, count: 267 },
    popularity: 85,
    sla: {
      uptime: '99.99%',
      latency: '<4ms',
      support: '24/7'
    },
    vnf: true
  },

  // APIs & Integration
  {
    id: 'api-network-insights',
    provider: 'AT&T',
    name: 'Network Insights API',
    description: 'Real-time network telemetry and analytics API',
    type: 'API',
    bandwidthOptions: ['N/A'],
    basePrice: 500,
    features: [
      'REST API access',
      'Real-time metrics',
      'Historical data',
      'Custom dashboards',
      'Webhook notifications'
    ],
    icon: 'code',
    category: 'API',
    tags: ['API', 'Analytics', 'Monitoring', 'Integration'],
    rating: { score: 4.6, count: 156 },
    popularity: 79,
    sla: {
      uptime: '99.9%',
      latency: '<50ms',
      support: 'Business Hours'
    },
    api: true
  },
  {
    id: 'api-provisioning',
    provider: 'AT&T',
    name: 'Network Provisioning API',
    description: 'Automate network configuration and deployment',
    type: 'API',
    bandwidthOptions: ['N/A'],
    basePrice: 750,
    features: [
      'Automated provisioning',
      'Configuration management',
      'Change tracking',
      'Rollback capability',
      'Audit logs'
    ],
    icon: 'code',
    category: 'API',
    tags: ['API', 'Automation', 'DevOps', 'Provisioning'],
    rating: { score: 4.7, count: 203 },
    popularity: 82,
    sla: {
      uptime: '99.9%',
      latency: '<100ms',
      support: 'Business Hours'
    },
    api: true
  },
  {
    id: 'api-billing',
    provider: 'AT&T',
    name: 'Billing & Usage API',
    description: 'Access billing data and usage reports',
    type: 'API',
    bandwidthOptions: ['N/A'],
    basePrice: 300,
    features: [
      'Usage reports',
      'Cost allocation',
      'Invoice details',
      'Budget alerts',
      'Export capabilities'
    ],
    icon: 'code',
    category: 'API',
    tags: ['API', 'Billing', 'Reports', 'Finance'],
    rating: { score: 4.5, count: 128 },
    popularity: 74,
    sla: {
      uptime: '99.9%',
      latency: '<100ms',
      support: 'Business Hours'
    },
    api: true
  },

  // Managed Services
  {
    id: 'managed-sase',
    provider: 'AT&T',
    name: 'Managed SASE',
    description: 'Secure Access Service Edge as a managed service',
    type: 'Managed Service',
    bandwidthOptions: ['Customized'],
    basePrice: 3500,
    features: [
      'Cloud-native security',
      'Zero Trust Network Access',
      'Secure Web Gateway',
      'Cloud Access Security Broker',
      '24/7 management'
    ],
    icon: 'shield',
    category: 'Managed Service',
    tags: ['SASE', 'Security', 'Zero Trust', 'Managed'],
    rating: { score: 4.8, count: 234 },
    popularity: 89,
    sla: {
      uptime: '99.99%',
      latency: '<10ms',
      support: '24/7'
    },
    addon: true
  },
  {
    id: 'network-monitoring',
    provider: 'AT&T',
    name: 'Advanced Network Monitoring',
    description: 'Comprehensive network visibility and alerting',
    type: 'Monitoring Add-on',
    bandwidthOptions: ['Included'],
    basePrice: 400,
    features: [
      'Real-time monitoring',
      'Performance analytics',
      'Alerting & notifications',
      'Custom reports',
      'Historical trends'
    ],
    icon: 'activity',
    category: 'Monitoring',
    tags: ['Monitoring', 'Analytics', 'Alerts', 'Add-on'],
    rating: { score: 4.6, count: 189 },
    popularity: 83,
    sla: {
      uptime: '99.9%',
      latency: '<10ms',
      support: '24/7'
    },
    addon: true
  }
];

export function Marketplace({ onSelectItem }: MarketplaceProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MarketplaceFilter>({
    categories: [],
    providers: [],
    priceRange: [0, 200],
    tags: [],
    rating: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price'>('popular');
  const [activeTab, setActiveTab] = useState<'solutions' | 'all' | 'connections' | 'addons' | 'vnf' | 'api' | 'managed' | 'aws'>('all');

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'internet':
        return <Globe className="h-6 w-6 text-fw-link" />;
      case 'cloud':
        return <Cloud className="h-6 w-6 text-fw-link" />;
      case 'network':
        return <Network className="h-6 w-6 text-fw-link" />;
      case 'shield':
        return <Shield className="h-6 w-6 text-fw-link" />;
      case 'code':
        return <Code className="h-6 w-6 text-fw-link" />;
      case 'activity':
        return <Activity className="h-6 w-6 text-fw-link" />;
      default:
        return <Database className="h-6 w-6 text-fw-link" />;
    }
  };

  // Filter items based on active tab
  const getFilteredItems = () => {
    let items = MARKETPLACE_ITEMS;

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'connections') {
        items = items.filter(item => !item.addon && !item.vnf && !item.api);
      } else if (activeTab === 'addons') {
        items = items.filter(item => item.addon);
      } else if (activeTab === 'vnf') {
        items = items.filter(item => item.vnf);
      } else if (activeTab === 'api') {
        items = items.filter(item => item.api);
      } else if (activeTab === 'managed') {
        items = items.filter(item => item.type.includes('Managed'));
      }
    }

    // Filter by search
    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort items
    if (sortBy === 'popular') {
      items = [...items].sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === 'rating') {
      items = [...items].sort((a, b) => b.rating.score - a.rating.score);
    } else if (sortBy === 'price') {
      items = [...items].sort((a, b) => a.basePrice - b.basePrice);
    }

    return items;
  };

  const handleSelectItem = (item: MarketplaceItem) => {
    if (item.disabled) return;
    navigate('/create');
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner - Figma: rounded-[32px], AT&T brand gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0057b8] via-[#003d82] to-[#009fdb] rounded-[32px] p-10">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/15 text-figma-sm font-medium text-white">
                <Sparkles className="h-3 w-3 mr-1.5" />
                Enterprise Network Services
              </span>
            </div>
            <h1 className="text-[40px] font-bold text-white leading-tight tracking-[-0.03em]">
              Marketplace
            </h1>
            <p className="text-figma-base font-medium text-white/70 mt-2 max-w-md tracking-[-0.03em]">
              Products, services, and solutions for your network
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <AttIcon name="router" className="h-8 w-8 text-white/80" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <AttIcon name="check-shield" className="h-8 w-8 text-white/80" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <AttIcon name="cloud" className="h-8 w-8 text-white/80" />
            </div>
          </div>
        </div>
      </div>

    <div className="flex gap-6">
      {/* Sidebar - Always visible */}
      <div className="w-[186px] shrink-0 space-y-6 border-r border-fw-secondary pr-4 animate-in fade-in slide-in-from-left duration-500">
        {/* Main Tabs - VerticalTabGroup standard */}
        <nav className="space-y-1" aria-label="Browse">
          <h3 className="text-figma-sm font-medium text-fw-bodyLight uppercase tracking-wider mb-2 px-4">Browse</h3>
          <button
            onClick={() => setActiveTab('aws')}
            className={`w-full flex items-center text-left px-4 py-3 text-figma-base font-medium no-rounded tracking-[-0.03em] transition-colors duration-200 border-l-2 ${
              activeTab === 'aws'
                ? 'border-fw-active text-fw-link'
                : 'border-transparent text-fw-heading hover:text-fw-link hover:border-fw-secondary'
            }`}
          >
            AWS Partner
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`w-full flex items-center text-left px-4 py-3 text-figma-base font-medium no-rounded tracking-[-0.03em] transition-colors duration-200 border-l-2 ${
              activeTab === 'all'
                ? 'border-fw-active text-fw-link'
                : 'border-transparent text-fw-heading hover:text-fw-link hover:border-fw-secondary'
            }`}
          >
            Browse Products
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`w-full flex items-center text-left px-4 py-3 text-figma-base font-medium no-rounded tracking-[-0.03em] transition-colors duration-200 border-l-2 ${
              activeTab === 'solutions'
                ? 'border-fw-active text-fw-link'
                : 'border-transparent text-fw-heading hover:text-fw-link hover:border-fw-secondary'
            }`}
          >
            Browse Solutions
          </button>
        </nav>

        {/* Category Grid - Always visible */}
        <CategoryGrid
          categories={[
            {
              id: 'business-continuity',
              name: 'Business Continuity',
              description: 'Ensure uninterrupted operations',
              icon: Clock,
              count: 3,
              color: 'blue'
            },
            {
              id: 'secure-collaboration',
              name: 'Secure Collaboration',
              description: 'Enable secure team productivity',
              icon: Users,
              count: 2,
              color: 'purple'
            },
            {
              id: 'global-expansion',
              name: 'Global Expansion',
              description: 'Extend your business worldwide',
              icon: Building,
              count: 2,
              color: 'amber'
            },
            {
              id: 'data-protection',
              name: 'Data Protection',
              description: 'Safeguard critical business data',
              icon: Shield,
              count: 1,
              color: 'rose'
            },
            {
              id: 'hybrid-workforce',
              name: 'Hybrid Workforce',
              description: 'Support remote and office teams',
              icon: Home,
              count: 2,
              color: 'emerald'
            },
            {
              id: 'digital-transformation',
              name: 'Digital Transformation',
              description: 'Accelerate business innovation',
              icon: Zap,
              count: 3,
              color: 'cyan'
            }
          ]}
          selectedCategories={[]}
          onCategoryToggle={() => {}}
          title="Browse by Category"
          className="bg-fw-base rounded-2xl p-4 border border-fw-secondary"
        />
      </div>

      <div className="flex-1 space-y-6">
        {/* AWS Partner Zone */}
        {activeTab === 'aws' && (
          <AWSPartnerZone />
        )}

        {/* Application Solution Zone */}
        {activeTab === 'solutions' && (
          <ApplicationSolutionZone />
        )}

      {/* Traditional Marketplace */}
      {activeTab !== 'solutions' && activeTab !== 'aws' && (
        <>
          {/* Promo Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0057b8] to-[#009fdb] rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-figma-xl font-bold text-white tracking-[-0.03em]">New product in Marketplace!</h2>
                <p className="text-figma-base font-medium text-white/80 mt-2 max-w-lg tracking-[-0.03em]">
                  Explore our latest network solutions and services designed for enterprise cloud connectivity.
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-white/60 flex-shrink-0" />
            </div>
          </div>

          {/* Breadcrumbs */}
            <div className="mb-4">
              <span className="text-figma-sm font-medium text-fw-bodyLight">Browse &gt; Browse by Category</span>
            </div>


        {/* Sub-category Tabs */}
        <div className="border-b border-fw-secondary">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-1 py-3 text-figma-base font-medium transition-all duration-200 border-b-2 no-rounded ${
                activeTab === 'all'
                  ? 'border-fw-link text-fw-link'
                  : 'border-transparent text-fw-heading hover:text-fw-link'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`px-1 py-3 text-figma-base font-medium transition-all duration-200 border-b-2 no-rounded ${
                activeTab === 'connections'
                  ? 'border-fw-link text-fw-link'
                  : 'border-transparent text-fw-heading hover:text-fw-link'
              }`}
            >
              <div className="flex items-center justify-center">
                <Network className="h-4 w-4 mr-1.5" />
                Connections
              </div>
            </button>
            <button
              onClick={() => setActiveTab('addons')}
              className={`px-1 py-3 text-figma-base font-medium transition-all duration-200 border-b-2 no-rounded ${
                activeTab === 'addons'
                  ? 'border-fw-link text-fw-link'
                  : 'border-transparent text-fw-heading hover:text-fw-link'
              }`}
            >
              <div className="flex items-center justify-center">
                <Plug className="h-4 w-4 mr-1.5" />
                Add-ons
              </div>
            </button>
            <button
              onClick={() => setActiveTab('vnf')}
              className={`px-1 py-3 text-figma-base font-medium transition-all duration-200 border-b-2 no-rounded ${
                activeTab === 'vnf'
                  ? 'border-fw-link text-fw-link'
                  : 'border-transparent text-fw-heading hover:text-fw-link'
              }`}
            >
              <div className="flex items-center justify-center">
                <Layers className="h-4 w-4 mr-1.5" />
                VNFs
              </div>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-1 py-3 text-figma-base font-medium transition-all duration-200 border-b-2 no-rounded ${
                activeTab === 'api'
                  ? 'border-fw-link text-fw-link'
                  : 'border-transparent text-fw-heading hover:text-fw-link'
              }`}
            >
              <div className="flex items-center justify-center">
                <Code className="h-4 w-4 mr-1.5" />
                APIs
              </div>
            </button>
            <button
              onClick={() => setActiveTab('managed')}
              className={`px-1 py-3 text-figma-base font-medium transition-all duration-200 border-b-2 no-rounded ${
                activeTab === 'managed'
                  ? 'border-fw-link text-fw-link'
                  : 'border-transparent text-fw-heading hover:text-fw-link'
              }`}
            >
              <div className="flex items-center justify-center">
                <Wrench className="h-4 w-4 mr-1.5" />
                Managed
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fw-link h-5 w-5" />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 bg-fw-base border border-fw-secondary rounded-lg text-figma-base focus:ring-2 focus:ring-fw-active transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-9 bg-fw-neutral border-0 rounded-lg px-3 text-figma-base focus:ring-2 focus:ring-fw-active"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price">Lowest Price</option>
            </select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={Filter}
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {getFilteredItems().map((item, index) => (
            <div
              key={item.id}
              className="group bg-fw-base rounded-2xl border border-fw-secondary hover:shadow-lg hover:border-fw-link hover:-translate-y-0.5 transition-all duration-300 flex flex-col relative overflow-visible"
            >
              {/* Recommendation badge on the first item */}
              {index === 0 && (
                <div className="absolute -top-3 -right-3 z-50">
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-figma-sm font-bold shadow-lg animate-pulse">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Top Pick
                  </div>
                </div>
              )}

              {/* Recommendation badge for the second item */}
              {index === 1 && (
                <div className="absolute -top-3 -right-3 z-50">
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-[#003184] to-blue-600 text-white text-figma-sm font-bold shadow-lg">
                    <Zap className="h-3 w-3 mr-1.5 fill-current" />
                    Recommended
                  </div>
                </div>
              )}

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-fw-link/5 group-hover:to-transparent transition-all duration-300 pointer-events-none rounded-2xl" />

              <div className="relative p-5 border-b border-fw-secondary">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-fw-wash rounded-lg flex items-center justify-center">
                    {getIcon(item.icon)}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.addon && (
                      <span className="px-2 py-0.5 text-figma-sm font-medium rounded-full bg-emerald-100 text-emerald-700">
                        Add-on
                      </span>
                    )}
                    {item.vnf && (
                      <span className="px-2 py-0.5 text-figma-sm font-medium rounded-full bg-purple-100 text-purple-700">
                        VNF
                      </span>
                    )}
                    {item.api && (
                      <span className="px-2 py-0.5 text-figma-sm font-medium rounded-full bg-blue-100 text-blue-700">
                        API
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-figma-lg font-medium text-fw-heading mb-1 group-hover:text-fw-link transition-colors">{item.name}</h3>
                <p className="text-figma-sm text-fw-bodyLight mb-2 font-medium">{item.provider}</p>
                <p className="text-figma-base text-fw-body leading-relaxed">{item.description}</p>
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= item.rating.score ? 'text-yellow-400 fill-current' : 'text-fw-bodyLight'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-figma-sm text-fw-bodyLight">
                    {item.rating.score} ({item.rating.count})
                  </span>
                </div>
              </div>

              <div className="relative p-5 flex-1">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-fw-neutral text-fw-body rounded-lg text-figma-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-figma-base">
                      <span className="text-fw-bodyLight">Bandwidth Options</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.bandwidthOptions.map((bandwidth) => (
                        <span
                          key={bandwidth}
                          className="px-2 py-1 bg-fw-accent text-fw-link rounded-lg text-figma-sm"
                        >
                          {bandwidth}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-figma-sm text-fw-bodyLight">Uptime</div>
                      <div className="text-figma-base font-bold text-fw-heading">{item.sla.uptime}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-figma-sm text-fw-bodyLight">Latency</div>
                      <div className="text-figma-base font-bold text-fw-heading">{item.sla.latency}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-figma-sm text-fw-bodyLight">Support</div>
                      <div className="text-figma-base font-bold text-fw-heading">{item.sla.support}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative p-5 mt-auto border-t border-fw-secondary bg-fw-base">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <div className="text-figma-sm text-fw-bodyLight font-medium">Starting at</div>
                    <div className="text-figma-xl font-bold text-fw-heading">
                      ${item.basePrice}
                      <span className="text-figma-base font-normal text-fw-bodyLight">/mo</span>
                    </div>
                  </div>
                  {item.popularity >= 90 && (
                    <div className="flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-figma-sm font-bold">
                      <Zap className="h-3.5 w-3.5 mr-1 fill-current" />
                      Popular
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSelectItem(item)}
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 font-semibold transition-all duration-200 text-figma-base bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary-focus-ring)] focus:ring-offset-2 rounded-lg shadow-sm hover:shadow-md active:shadow-sm group/btn"
                >
                  <span>{item.addon || item.vnf || item.api ? 'Add to Connection' : 'Select Plan'}</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
      </div>
    </div>
    </div>
  );
}