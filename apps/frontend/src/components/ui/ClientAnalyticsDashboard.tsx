import React, { useState, useEffect } from 'react';

interface ClientMetrics {
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  clientRetentionRate: number;
  averageLifetimeValue: number;
  totalRevenue: number;
  averageProjectValue: number;
  topIndustries: Array<{ industry: string; count: number; percentage: number }>;
  clientStatusDistribution: Array<{ status: string; count: number; percentage: number }>;
  monthlyGrowth: Array<{ month: string; newClients: number; revenue: number }>;
  communicationStats: {
    totalCommunications: number;
    averageResponseTime: number;
    mostUsedChannel: string;
  };
}

export default function ClientAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<ClientMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockMetrics: ClientMetrics = {
        totalClients: 156,
        activeClients: 142,
        newClientsThisMonth: 12,
        clientRetentionRate: 94.5,
        averageLifetimeValue: 2850,
        totalRevenue: 445200,
        averageProjectValue: 1850,
        topIndustries: [
          { industry: 'Wedding Photography', count: 45, percentage: 28.8 },
          { industry: 'Corporate Events', count: 32, percentage: 20.5 },
          { industry: 'Real Estate', count: 28, percentage: 17.9 },
          { industry: 'Fashion', count: 22, percentage: 14.1 },
          { industry: 'Food & Beverage', count: 18, percentage: 11.5 }
        ],
        clientStatusDistribution: [
          { status: 'Active', count: 142, percentage: 91.0 },
          { status: 'VIP', count: 23, percentage: 14.7 },
          { status: 'Prospect', count: 8, percentage: 5.1 },
          { status: 'Inactive', count: 6, percentage: 3.8 }
        ],
        monthlyGrowth: [
          { month: 'Jan 2024', newClients: 8, revenue: 24500 },
          { month: 'Feb 2024', newClients: 12, revenue: 38200 },
          { month: 'Mar 2024', newClients: 15, revenue: 42800 },
          { month: 'Apr 2024', newClients: 18, revenue: 51200 },
          { month: 'May 2024', newClients: 14, revenue: 47600 },
          { month: 'Jun 2024', newClients: 12, revenue: 38900 }
        ],
        communicationStats: {
          totalCommunications: 1248,
          averageResponseTime: 4.2,
          mostUsedChannel: 'Email'
        }
      };
      
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Analytics</h2>
          <p className="text-gray-400">Insights into your client relationships and business performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="1month" className="bg-gray-800">Last Month</option>
          <option value="3months" className="bg-gray-800">Last 3 Months</option>
          <option value="6months" className="bg-gray-800">Last 6 Months</option>
          <option value="1year" className="bg-gray-800">Last Year</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-green-400 text-sm font-medium">
              +{metrics.newClientsThisMonth} this month
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.totalClients}</div>
          <div className="text-gray-400 text-sm">Total Clients</div>
        </div>

        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-blue-400 text-sm font-medium">
              {formatCurrency(metrics.averageProjectValue)} avg project
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatCurrency(metrics.totalRevenue)}</div>
          <div className="text-gray-400 text-sm">Total Revenue</div>
        </div>

        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-yellow-400 text-sm font-medium">
              {formatPercentage(metrics.clientRetentionRate)} retention
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatCurrency(metrics.averageLifetimeValue)}</div>
          <div className="text-gray-400 text-sm">Avg Lifetime Value</div>
        </div>

        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-blue-400 text-sm font-medium">
              {metrics.communicationStats.averageResponseTime}h avg response
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.communicationStats.totalCommunications}</div>
          <div className="text-gray-400 text-sm">Total Communications</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Industry Distribution */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Top Industries</h3>
          <div className="space-y-4">
            {metrics.topIndustries.map((industry, index) => (
              <div key={industry.industry} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-white">{industry.industry}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${industry.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-sm w-12 text-right">
                    {industry.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Status Distribution */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Client Status</h3>
          <div className="space-y-4">
            {metrics.clientStatusDistribution.map((status, index) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status.status === 'Active' ? 'bg-green-500' :
                    status.status === 'VIP' ? 'bg-purple-500' :
                    status.status === 'Prospect' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-white">{status.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status.status === 'Active' ? 'bg-green-500' :
                        status.status === 'VIP' ? 'bg-purple-500' :
                        status.status === 'Prospect' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-sm w-12 text-right">
                    {status.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Growth Chart */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Monthly Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {metrics.monthlyGrowth.map((month, index) => (
            <div key={month.month} className="text-center">
              <div className="relative mb-4">
                <div className="bg-white/10 rounded-lg h-32 flex items-end justify-center p-2">
                  <div 
                    className="bg-blue-500 rounded w-full flex flex-col justify-end items-center"
                    style={{ 
                      height: `${(month.newClients / Math.max(...metrics.monthlyGrowth.map(m => m.newClients))) * 100}%`,
                      minHeight: '20px'
                    }}
                  >
                    <span className="text-white text-xs font-medium mb-1">
                      {month.newClients}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">{month.month}</div>
              <div className="text-white text-sm font-medium">
                {formatCurrency(month.revenue)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Insights */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Communication Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {metrics.communicationStats.totalCommunications}
            </div>
            <div className="text-gray-400">Total Communications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {metrics.communicationStats.averageResponseTime}h
            </div>
            <div className="text-gray-400">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {metrics.communicationStats.mostUsedChannel}
            </div>
            <div className="text-gray-400">Most Used Channel</div>
          </div>
        </div>
      </div>
    </div>
  );
} 