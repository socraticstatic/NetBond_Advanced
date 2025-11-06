import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, TrendingUp, AlertCircle, Search, Filter,
  X, ArrowLeft, Menu, ChevronRight, Plus
} from 'lucide-react';
import { Connection } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatMobileDate, formatMobileBandwidth, truncateText } from '../../utils/mobileHelpers';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileConnectionGridProps {
  connections: Connection[];
}

export function MobileConnectionGrid({ connections }: MobileConnectionGridProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conn.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conn.status === statusFilter;
    const matchesType = typeFilter === 'all' || conn.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: connections.length,
    active: connections.filter(c => c.status === 'active').length,
    provisioning: connections.filter(c => c.status === 'provisioning').length,
    avgUtilization: connections.reduce((sum, c) => sum + (c.utilization || 0), 0) / connections.length || 0,
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center flex-1">
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Connections</h1>
              <p className="text-sm text-gray-500">{filteredConnections.length} connections</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              aria-label="Filter connections"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/create')}
              className="p-2 text-white bg-brand-blue hover:bg-brand-darkBlue rounded-full"
              aria-label="Create connection"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="provisioning">Provisioning</option>
                  <option value="deprovisioning">Deprovisioning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                >
                  <option value="all">All Types</option>
                  <option value="E-Line">E-Line</option>
                  <option value="E-LAN">E-LAN</option>
                  <option value="E-Access">E-Access</option>
                  <option value="Cloud Router">Cloud Router</option>
                </select>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-darkBlue"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
            <div className="text-xs text-gray-500 mt-1">Active</div>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.provisioning}</div>
            <div className="text-xs text-gray-500 mt-1">Provisioning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.avgUtilization.toFixed(0)}%</div>
            <div className="text-xs text-gray-500 mt-1">Avg. Usage</div>
          </div>
        </div>
      </div>

      {/* Connection List */}
      <div className="flex-1 p-4 space-y-3 pb-20">
        {filteredConnections.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No connections found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first connection to get started'}
            </p>
            {(!searchTerm && statusFilter === 'all' && typeFilter === 'all') && (
              <button
                onClick={() => navigate('/create')}
                className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-darkBlue"
              >
                Create Connection
              </button>
            )}
          </div>
        ) : (
          filteredConnections.map((connection) => (
            <motion.div
              key={connection.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              onClick={() => navigate(`/connections/${connection.id}`)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                      {connection.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {connection.provider} • {connection.type}
                    </p>
                  </div>
                  <StatusBadge status={connection.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {formatMobileBandwidth(connection.bandwidth)}
                      </div>
                      <div className="text-xs text-gray-500">Bandwidth</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {connection.utilization?.toFixed(0) || 0}%
                      </div>
                      <div className="text-xs text-gray-500">Utilization</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Updated {formatMobileDate(connection.lastUpdated || new Date())}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
