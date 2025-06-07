import React, { useState, useEffect } from 'react';
import { Clock, Search, Filter, Copy, Edit, Trash2, Eye, Hash, MessageSquare, Calendar, User } from 'lucide-react';

interface AIContent {
  id: string;
  content: string;
  hashtags: string[];
  call_to_action: string;
  content_tips: string[];
  platform: string;
  content_type: string;
  topic: string;
  tone: string;
  language: string;
  status: string;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    industry?: string;
  };
}

interface AIContentHistoryProps {
  onEditContent?: (content: AIContent) => void;
  onDeleteContent?: (contentId: string) => void;
}

const platformIcons: Record<string, string> = {
  instagram: '📷',
  facebook: '👥',
  linkedin: '💼',
  tiktok: '🎵',
  twitter: '🐦'
};

const platformColors: Record<string, string> = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  facebook: 'bg-blue-600',
  linkedin: 'bg-blue-700',
  tiktok: 'bg-black',
  twitter: 'bg-gray-800'
};

const statusColors: Record<string, string> = {
  generated: 'bg-blue-100 text-blue-800',
  edited: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800'
};

export const AIContentHistory: React.FC<AIContentHistoryProps> = ({
  onEditContent,
  onDeleteContent
}) => {
  const [contents, setContents] = useState<AIContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<AIContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContent, setSelectedContent] = useState<AIContent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchContent();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [contents, searchTerm, platformFilter, statusFilter]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('supabase_access_token');
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(platformFilter && { platform: platformFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/ai/content?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setContents(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...contents];

    if (searchTerm) {
      filtered = filtered.filter(content => 
        content.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.topic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (platformFilter) {
      filtered = filtered.filter(content => content.platform === platformFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(content => content.status === statusFilter);
    }

    setFilteredContents(filtered);
  };

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const token = localStorage.getItem('supabase_access_token');
      
      const response = await fetch('/api/ai/content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: contentId })
      });

      if (response.ok) {
        setContents(prev => prev.filter(c => c.id !== contentId));
        onDeleteContent?.(contentId);
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content History</h2>
            <p className="text-gray-600">Manage your AI-generated content</p>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="generated">Generated</option>
                <option value="edited">Edited</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content List */}
      {filteredContents.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Found</h3>
          <p className="text-gray-500">
            {searchTerm || platformFilter || statusFilter 
              ? 'No content matches your current filters.'
              : 'Start generating content to see your history here.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContents.map((content) => (
            <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${platformColors[content.platform] || 'bg-gray-500'}`}>
                      <span className="text-white text-sm">{platformIcons[content.platform] || '📱'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{content.topic}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[content.status] || 'bg-gray-100 text-gray-800'}`}>
                          {content.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="capitalize">{content.platform} • {content.content_type}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(content.created_at)}
                        </span>
                        {content.clients && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {content.clients.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="mb-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {truncateContent(content.content)}
                    </p>
                  </div>

                  {/* Hashtags */}
                  {content.hashtags && content.hashtags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <Hash className="h-3 w-3 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.slice(0, 3).map((hashtag, index) => (
                          <span key={index} className="text-xs text-blue-600">
                            #{hashtag}
                          </span>
                        ))}
                        {content.hashtags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{content.hashtags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedContent(content);
                      setShowDetailModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(content.content)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy Content"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditContent?.(content)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Content"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Content"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Content Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap text-gray-900">{selectedContent.content}</p>
                  </div>
                </div>

                {selectedContent.hashtags && selectedContent.hashtags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedContent.call_to_action && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">{selectedContent.call_to_action}</p>
                    </div>
                  </div>
                )}

                {selectedContent.content_tips && selectedContent.content_tips.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Tips</label>
                    <ul className="space-y-2">
                      {selectedContent.content_tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};