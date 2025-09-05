import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cloud, Network, Globe, Plus, Undo, Play, Check, Save, Trash2, Sparkles, Shield, Router, Database, Cpu, Workflow, Car, Home, Gamepad, Smartphone, Clock, FileText, Users,
  Server, MessageSquare, Send, ArrowRight, X, Building, Zap, Star, Search, Filter
} from 'lucide-react';
import { MarketplaceItem, MarketplaceFilter, MarketplaceCategory } from '../types/connection';
import { Button } from './common/Button';
import { CategoryGrid } from './marketplace/CategoryGrid';
import { CollectionGrid } from './marketplace/CollectionGrid';

interface MarketplaceProps {
  onSelectItem: (item: MarketplaceItem) => void;
}

// Code snippet templates
const MARKETPLACE_ITEMS: MarketplaceItem[] = [
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
    provider: 'AWS',
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

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'internet':
        return <Globe className="h-6 w-6 text-blue-600" />;
      case 'cloud':
        return <Cloud className="h-6 w-6 text-blue-600" />;
      case 'network':
        return <Network className="h-6 w-6 text-blue-600" />;
      case 'shield':
        return <Shield className="h-6 w-6 text-blue-600" />;
      default:
        return <Database className="h-6 w-6 text-blue-600" />;
    }
  };

  const handleSelectItem = (item: MarketplaceItem) => {
    if (item.disabled) return;
    navigate('/create');
  };

  return (
    <div className="flex gap-6">
      {/* Categories Sidebar */}
      <div className="w-72 shrink-0 space-y-6">
        {/* Collections Grid */}
        <CollectionGrid
          collections={[
            { 
              id: 'personal-devices',
              name: 'Personal Devices',
              description: 'IoT and device connectivity',
              icon: Smartphone,
              count: 2,
              color: 'pink'
            },
            { 
              id: 'ai',
              name: 'AI & ML',
              description: 'AI/ML optimized networking',
              icon: Cpu,
              count: 2,
              color: 'purple'
            }
          ]}
          selectedCategories={[]}
          onCategoryToggle={() => {}}
          className="bg-white rounded-lg p-4 border border-gray-200"
        />

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
            },
          ]}
          selectedCategories={[]}
          onCategoryToggle={() => {}}
          title="Browse by Category"
          className="bg-white rounded-lg p-4 border border-gray-200"
        />
      </div>

      <div className="flex-1 space-y-6 relative">
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        </div>

        {/* Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MARKETPLACE_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative"
            >
              {/* Recommendation badge on the first item */}
              {index === 0 && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-[#003184] text-white text-xs font-medium shadow-lg">
                    Top Pick
                  </div>
                </div>
              )}
              
              {/* Recommendation badge for the second item */}
              {index === 1 && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-[#003184] text-white text-xs font-medium shadow-lg">
                    <Zap className="h-3 w-3 mr-1.5" />
                    Recommended
                  </div>
                </div>
              )}
              
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getIcon(item.icon)}
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= item.rating.score ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      ({item.rating.count})
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>

              <div className="p-4 flex-1">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Bandwidth Options</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.bandwidthOptions.map((bandwidth) => (
                        <span
                          key={bandwidth}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                        >
                          {bandwidth}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Uptime</div>
                      <div className="text-sm font-medium text-gray-900">{item.sla.uptime}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Latency</div>
                      <div className="text-sm font-medium text-gray-900">{item.sla.latency}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Support</div>
                      <div className="text-sm font-medium text-gray-900">{item.sla.support}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 mt-auto border-t border-gray-100">
                <button
                  onClick={() => item.id === 'internet-to-cloud' && handleSelectItem(item)}
                  disabled={item.id !== 'internet-to-cloud'}
                  className={`
                    w-full inline-flex items-center justify-center px-6 py-3 rounded-lg
                    font-medium transition-all duration-200 text-sm
                    ${item.id !== 'internet-to-cloud'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : `
                        bg-[#003184] text-white
                        hover:bg-[#002255]
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                        active:bg-[#002255] active:transform active:scale-[0.98]
                      `
                    }
                  `}
                >
                  {item.id === 'internet-to-cloud' ? 'Select Plan' : 'Coming Soon'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}