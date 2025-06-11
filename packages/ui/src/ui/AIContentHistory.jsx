import React, { useState, useEffect } from 'react';

export default function AIContentHistory() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    platform: '',
    contentType: '',
    status: '',
    search: '',
  });

  const platforms = [
    { value: '', label: 'All Platforms', icon: '🌐' },
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'facebook', label: 'Facebook', icon: '👥' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
  ];

  const contentTypes = [
    { value: '', label: 'All Types', icon: '📋' },
    { value: 'post', label: 'Post', icon: '📝' },
    { value: 'story', label: 'Story', icon: '📱' },
    { value: 'reel', label: 'Reel/Video', icon: '🎬' },
    { value: 'carousel', label: 'Carousel', icon: '🎠' },
  ];

  const statuses = [
    { value: '', label: 'All Statuses', color: 'bg-gray-500', icon: '📄' },
    { value: 'draft', label: 'Draft', color: 'bg-yellow-500', icon: '📝' },
    { value: 'published', label: 'Published', color: 'bg-green-500', icon: '✅' },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-500', icon: '⏰' },
    { value: 'archived', label: 'Archived', color: 'bg-gray-500', icon: '📦' },
  ];

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      // Import and use Supabase for authentication
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to view content history');
      }
      
      const token = session.access_token;

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/ai/history?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content history');
      }

      const result = await response.json();
      setContent(result.contents || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.message || 'Failed to load content history');
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.icon || '📄';
  };

  const getPlatformIcon = (platform) => {
    const platformObj = platforms.find(p => p.value === platform);
    return platformObj?.icon || '📱';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/20 rounded-3xl p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-white text-lg font-medium">Loading content history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Content Library</h2>
            <p className="text-gray-400 text-lg">Manage your AI-generated content collection</p>
          </div>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
          <div className="text-2xl font-bold text-white">{content.length}</div>
          <div className="text-sm text-gray-400">Content{content.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-white/20 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🔍</span>
          <h3 className="text-xl font-bold text-white">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              🔎 Search Content
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search content..."
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/15 transition-all duration-300"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              🌐 Platform
            </label>
            <select
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/15 transition-all duration-300"
            >
              {platforms.map((platform) => (
                <option key={platform.value} value={platform.value} className="bg-gray-800">
                  {platform.icon} {platform.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content Type Filter */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              📄 Content Type
            </label>
            <select
              value={filters.contentType}
              onChange={(e) => handleFilterChange('contentType', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/15 transition-all duration-300"
            >
              {contentTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-gray-800">
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              📊 Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/15 transition-all duration-300"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value} className="bg-gray-800">
                  {status.icon} {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <span className="text-red-400 text-2xl">⚠️</span>
            <div>
              <h4 className="text-red-400 font-semibold text-lg">Error Loading Content</h4>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {content.length === 0 && !loading && !error ? (
        <div className="bg-white/5 border border-white/20 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-2xl font-bold text-white mb-4">No Content Found</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            {Object.values(filters).some(v => v) 
              ? 'Try adjusting your filters to discover more content.'
              : 'Start creating your first AI-generated content to build your library!'}
          </p>
          <button 
            onClick={() => setFilters({ platform: '', contentType: '', status: '', search: '' })}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
          >
            🔄 Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {content.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/20 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                    <span className="text-white text-2xl">{getPlatformIcon(item.platform)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)} {item.content_type}
                      </h3>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs text-white ${getStatusColor(item.status)}`}>
                        <span>{getStatusIcon(item.status)}</span>
                        <span className="font-medium">{item.status || 'draft'}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{formatDate(item.created_at)}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(item.content)}
                  className="text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-500/20 rounded-full hover:bg-blue-500/30 text-sm font-medium transition-colors"
                >
                  📋 Copy
                </button>
              </div>

              <div className="space-y-4">
                {/* Content Preview */}
                <div>
                  <label className="text-lg font-semibold text-white mb-2 block">📝 Content Preview</label>
                  <div className="bg-gray-800/50 p-4 rounded-2xl border border-white/20">
                    <p className="text-gray-200 leading-relaxed">
                      {item.content.length > 200 
                        ? `${item.content.substring(0, 200)}...` 
                        : item.content}
                    </p>
                  </div>
                </div>

                {/* Hashtags */}
                {item.hashtags && (
                  <div>
                    <label className="text-lg font-semibold text-white mb-2 block">#️⃣ Hashtags</label>
                    <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/30">
                      <p className="text-blue-300 font-medium">{item.hashtags}</p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">🎭</span>
                      {item.tone}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-pink-400">🌍</span>
                      {item.language === 'en' ? 'English' : 'Hebrew'}
                    </span>
                    {item.client_name && (
                      <span className="flex items-center gap-1">
                        <span className="text-indigo-400">👤</span>
                        {item.client_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 