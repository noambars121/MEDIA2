import React, { useState, useEffect } from 'react';
import type { EnhancedClient, ClientCommunicationHistory, ClientContact, ClientPreferences } from '@/lib/database.types';

interface ClientDetailModalProps {
  client: EnhancedClient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: EnhancedClient) => void;
  onAddCommunication: (clientId: string) => void;
  onCreateProject: (client: EnhancedClient) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
  onEdit,
  onAddCommunication,
  onCreateProject
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'communication' | 'projects' | 'preferences'>('overview');
  const [communicationHistory, setCommunicationHistory] = useState<ClientCommunicationHistory[]>([]);
  const [contacts, setContacts] = useState<ClientContact[]>([]);
  const [preferences, setPreferences] = useState<ClientPreferences | null>(null);

  useEffect(() => {
    if (client && isOpen) {
      // Load additional client data when modal opens
      loadClientData();
    }
  }, [client, isOpen]);

  const loadClientData = async () => {
    if (!client) return;
    
    try {
      // In a real implementation, these would be API calls
      // For now, we'll use mock data
      setCommunicationHistory([
        {
          id: '1',
          client_id: client.id,
          user_id: 'user-1',
          communication_type: 'email',
          subject: 'Wedding Photography Consultation',
          content: 'Initial discussion about wedding photography package and timeline.',
          direction: 'outbound',
          status: 'completed',
          completed_at: '2024-01-15T10:30:00Z',
          follow_up_required: false,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          client_id: client.id,
          user_id: 'user-1',
          communication_type: 'phone',
          subject: 'Contract Discussion',
          content: 'Discussed contract details and answered questions about deliverables.',
          direction: 'inbound',
          status: 'completed',
          completed_at: '2024-01-18T14:15:00Z',
          follow_up_required: true,
          follow_up_date: '2024-01-25',
          created_at: '2024-01-18T14:15:00Z',
          updated_at: '2024-01-18T14:15:00Z'
        }
      ]);

      setContacts([
        {
          id: '1',
          client_id: client.id,
          user_id: 'user-1',
          name: client.name,
          email: client.email || '',
          phone: client.phone || '',
          role: 'primary',
          is_primary: true,
          created_at: '2024-01-10T00:00:00Z',
          updated_at: '2024-01-10T00:00:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error loading client data:', error);
    }
  };

  if (!isOpen || !client) return null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'vip': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'prospect': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'archived': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/70"
          onClick={onClose}
        />

        {/* Modal container */}
        <div className="inline-block w-full max-w-6xl px-6 py-8 my-8 text-left align-middle transition-all transform bg-gray-900 border border-white/10 shadow-xl rounded-xl sm:my-16">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                {client.avatar_url ? (
                  <img 
                    src={client.avatar_url} 
                    alt={client.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg tracking-tight">
                      {getInitials(client.name)}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.client_status)}`}>
                    {client.client_status.charAt(0).toUpperCase() + client.client_status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{client.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  {client.company && <span>{client.company}</span>}
                  {client.industry && client.company && <span>-</span>}
                  {client.industry && <span>{client.industry}</span>}
                  {client.city && client.state && <span>-</span>}
                  {client.city && client.state && <span>{client.city}, {client.state}</span>}
                </div>
                <div className="flex items-center space-x-6 mt-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Priority:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= client.priority_level ? 'text-yellow-400' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">LTV:</span>
                    <span className="text-sm font-medium text-green-400">
                      {formatCurrency(client.lifetime_value || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button 
              onClick={() => onEdit(client)}
              className="btn-primary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Client</span>
            </button>
            
            <button 
              onClick={() => onAddCommunication(client.id)}
              className="btn-secondary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Add Communication</span>
            </button>
            
            <button 
              onClick={() => onCreateProject(client)}
              className="btn-outline flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Project</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'communication', label: 'Communication', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                { id: 'projects', label: 'Projects', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { id: 'preferences', label: 'Preferences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    {client.email && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white">{client.email}</p>
                        </div>
                      </div>
                    )}
                    
                    {client.phone && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-white">{client.phone}</p>
                        </div>
                      </div>
                    )}

                    {(client.address || client.city || client.state) && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">Address</p>
                          <p className="text-white">
                            {client.address && <span>{client.address}<br /></span>}
                            {client.city && client.state && <span>{client.city}, {client.state}</span>}
                            {client.zip_code && <span> {client.zip_code}</span>}
                          </p>
                        </div>
                      </div>
                    )}

                    {client.website && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">Website</p>
                          <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            {client.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Social Media */}
                  {(client.instagram_handle || client.linkedin_url || client.facebook_url) && (
                    <div>
                      <h4 className="text-md font-medium text-white mb-3">Social Media</h4>
                      <div className="space-y-2">
                        {client.instagram_handle && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Instagram:</span>
                            <span className="text-white">@{client.instagram_handle}</span>
                          </div>
                        )}
                        {client.linkedin_url && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">LinkedIn:</span>
                            <a href={client.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                              View Profile
                            </a>
                          </div>
                        )}
                        {client.facebook_url && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Facebook:</span>
                            <a href={client.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                              View Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {client.tags && client.tags.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-white mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {client.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="card p-4">
                      <h4 className="text-sm text-gray-400 mb-2">Total Projects</h4>
                      <p className="text-2xl font-bold text-white">{client.project_summary?.total_projects || 0}</p>
                    </div>
                    <div className="card p-4">
                      <h4 className="text-sm text-gray-400 mb-2">Active Projects</h4>
                      <p className="text-2xl font-bold text-green-400">{client.project_summary?.active_projects || 0}</p>
                    </div>
                    <div className="card p-4">
                      <h4 className="text-sm text-gray-400 mb-2">Total Value</h4>
                      <p className="text-2xl font-bold text-white">{formatCurrency(client.project_summary?.total_value || 0)}</p>
                    </div>
                    <div className="card p-4">
                      <h4 className="text-sm text-gray-400 mb-2">Lifetime Value</h4>
                      <p className="text-2xl font-bold text-green-400">{formatCurrency(client.lifetime_value || 0)}</p>
                    </div>
                  </div>

                  {client.referral_source && (
                    <div>
                      <h4 className="text-md font-medium text-white mb-2">Referral Source</h4>
                      <p className="text-gray-300">{client.referral_source}</p>
                    </div>
                  )}

                  {client.notes && (
                    <div>
                      <h4 className="text-md font-medium text-white mb-2">Notes</h4>
                      <p className="text-gray-300 leading-relaxed">{client.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Communication History</h3>
                  <button 
                    onClick={() => onAddCommunication(client.id)}
                    className="btn-primary text-sm"
                  >
                    Add Communication
                  </button>
                </div>

                <div className="space-y-4">
                  {communicationHistory.map((comm) => (
                    <div key={comm.id} className="card p-4 border-l-4 border-blue-400">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-white">{comm.subject}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                            <span className="capitalize">{comm.communication_type}</span>
                            <span>•</span>
                            <span className="capitalize">{comm.direction}</span>
                            <span>•</span>
                            <span>{formatDate(comm.created_at)}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          comm.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          comm.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {comm.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{comm.content}</p>
                      {comm.follow_up_required && (
                        <div className="flex items-center space-x-2 text-sm">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-yellow-400">Follow-up required</span>
                          {comm.follow_up_date && (
                            <span className="text-gray-400">by {comm.follow_up_date}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Projects</h3>
                  <button 
                    onClick={() => onCreateProject(client)}
                    className="btn-primary text-sm"
                  >
                    Create Project
                  </button>
                </div>

                {/* Mock project data */}
                <div className="space-y-4">
                  <div className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">Wedding Photography Package</h4>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Active</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">Full wedding day coverage including ceremony and reception</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Start Date: March 15, 2024</span>
                      <span className="text-white font-medium">$3,500</span>
                    </div>
                  </div>
                  
                  <div className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">Engagement Session</h4>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">Completed</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">Pre-wedding engagement photography session</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Completed: January 20, 2024</span>
                      <span className="text-white font-medium">$800</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Client Preferences</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-medium text-white mb-4">Brand & Visual Preferences</h4>
                    
                    {client.brand_voice && (
                      <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">Brand Voice</label>
                        <p className="text-white">{client.brand_voice}</p>
                      </div>
                    )}
                    
                    {client.target_audience && (
                      <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">Target Audience</label>
                        <p className="text-white">{client.target_audience}</p>
                      </div>
                    )}
                    
                    {client.brand_guidelines && (
                      <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">Brand Guidelines</label>
                        <p className="text-white">{client.brand_guidelines}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-white mb-4">Communication Preferences</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Email Updates</span>
                        <span className="text-green-400">✓ Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">SMS Notifications</span>
                        <span className="text-gray-500">✗ Disabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Marketing Materials</span>
                        <span className="text-green-400">✓ Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 