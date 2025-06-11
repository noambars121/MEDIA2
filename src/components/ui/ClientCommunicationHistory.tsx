import React, { useState, useEffect } from 'react';

interface Communication {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'text' | 'video_call';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  status: 'pending' | 'completed' | 'follow_up_required';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  follow_up_date?: string;
  tags?: string[];
}

interface ClientCommunicationHistoryProps {
  clientId: string;
  clientName: string;
}

export default function ClientCommunicationHistory({ clientId, clientName }: ClientCommunicationHistoryProps) {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'email' as Communication['type'],
    direction: 'outbound' as Communication['direction'],
    subject: '',
    content: '',
    priority: 'medium' as Communication['priority'],
    follow_up_date: ''
  });

  const communicationTypes = [
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'phone', label: 'Phone Call', icon: '📞' },
    { value: 'meeting', label: 'Meeting', icon: '🤝' },
    { value: 'text', label: 'Text/SMS', icon: '💬' },
    { value: 'video_call', label: 'Video Call', icon: '📹' }
  ];

  useEffect(() => {
    fetchCommunications();
  }, [clientId]);

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockData: Communication[] = [
        {
          id: '1',
          type: 'email',
          direction: 'outbound',
          subject: 'Project Proposal - Wedding Photography',
          content: 'Hi! I wanted to follow up on our conversation about your upcoming wedding photography needs...',
          status: 'completed',
          priority: 'high',
          created_at: '2024-01-15T14:30:00Z',
          tags: ['proposal', 'wedding']
        },
        {
          id: '2',
          type: 'phone',
          direction: 'inbound',
          subject: 'Initial Consultation Call',
          content: 'Client called to discuss wedding photography package options. Very interested in premium package.',
          status: 'completed',
          priority: 'medium',
          created_at: '2024-01-10T10:15:00Z',
          follow_up_date: '2024-01-20T00:00:00Z',
          tags: ['consultation', 'wedding']
        }
      ];
      setCommunications(mockData);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommunication = async () => {
    try {
      const newComm: Communication = {
        id: Date.now().toString(),
        type: newCommunication.type,
        direction: newCommunication.direction,
        subject: newCommunication.subject,
        content: newCommunication.content,
        status: 'completed',
        priority: newCommunication.priority,
        created_at: new Date().toISOString(),
        follow_up_date: newCommunication.follow_up_date || undefined
      };

      setCommunications(prev => [newComm, ...prev]);
      setShowAddForm(false);
      setNewCommunication({
        type: 'email',
        direction: 'outbound',
        subject: '',
        content: '',
        priority: 'medium',
        follow_up_date: ''
      });
    } catch (error) {
      console.error('Error adding communication:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = communicationTypes.find(t => t.value === type);
    return typeConfig?.icon || '📝';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'follow_up_required': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Communication History</h3>
          <p className="text-gray-400">Track all interactions with {clientName}</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
        >
          Add Communication
        </button>
      </div>

      {/* Add Communication Form */}
      {showAddForm && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Add New Communication</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Type</label>
              <select
                value={newCommunication.type}
                onChange={(e) => setNewCommunication(prev => ({ ...prev, type: e.target.value as Communication['type'] }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {communicationTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-gray-800">
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Direction</label>
              <select
                value={newCommunication.direction}
                onChange={(e) => setNewCommunication(prev => ({ ...prev, direction: e.target.value as Communication['direction'] }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="outbound" className="bg-gray-800">Outbound</option>
                <option value="inbound" className="bg-gray-800">Inbound</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Subject</label>
            <input
              type="text"
              value={newCommunication.subject}
              onChange={(e) => setNewCommunication(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Communication subject or title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Content</label>
            <textarea
              value={newCommunication.content}
              onChange={(e) => setNewCommunication(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Details about the communication..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAddCommunication}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
            >
              Add Communication
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Communications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading communications...</p>
          </div>
        ) : communications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No communications found</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
            >
              Add First Communication
            </button>
          </div>
        ) : (
          communications.map((comm) => (
            <div key={comm.id} className="bg-white/5 border border-white/20 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <span className="text-lg">{getTypeIcon(comm.type)}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{comm.subject}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{communicationTypes.find(t => t.value === comm.type)?.label}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(comm.status)}`}>
                        {comm.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs mb-1 ${
                    comm.direction === 'inbound' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {comm.direction === 'inbound' ? '↓ Inbound' : '↑ Outbound'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {formatDate(comm.created_at)}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{comm.content}</p>

              {comm.tags && comm.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {comm.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {comm.follow_up_date && (
                <div className="flex items-center space-x-2 text-sm text-orange-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Follow-up: {formatDate(comm.follow_up_date)}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}