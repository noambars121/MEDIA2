import React from 'react';
import type { EnhancedClient } from '@/lib/database.types';

interface EnhancedClientCardProps {
  client: EnhancedClient;
  onViewDetails: (client: EnhancedClient) => void;
  onContact: (client: EnhancedClient) => void;
  onCreateProject: (client: EnhancedClient) => void;
  onEditClient: (client: EnhancedClient) => void;
}

export const EnhancedClientCard: React.FC<EnhancedClientCardProps> = ({
  client,
  onViewDetails,
  onContact,
  onCreateProject,
  onEditClient
}) => {
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

  const getPriorityIcon = (priority: number) => {
    if (priority >= 4) {
      return (
        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    } else if (priority >= 3) {
      return (
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
        </svg>
      );
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="card p-6 group hover:border-white/20 transition-all duration-200">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative">
            {client.avatar_url ? (
              <img 
                src={client.avatar_url} 
                alt={client.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm tracking-tight">
                  {getInitials(client.name)}
                </span>
              </div>
            )}
            {/* Priority Indicator */}
            <div className="absolute -top-1 -right-1">
              {getPriorityIcon(client.priority_level)}
            </div>
          </div>

          {/* Client Info */}
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight mb-1">
              {client.name}
            </h3>
            <div className="flex items-center space-x-2">
              {client.company && (
                <span className="text-gray-400 text-sm font-light">{client.company}</span>
              )}
              {client.industry && (
                <span className="text-gray-500 text-sm">-</span>
              )}
              {client.industry && (
                <span className="text-gray-400 text-sm font-light">{client.industry}</span>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.client_status)}`}>
          {client.client_status.charAt(0).toUpperCase() + client.client_status.slice(1)}
        </span>
      </div>

      {/* Tags */}
      {client.tags && client.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {client.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {client.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-md">
              +{client.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Project Summary */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm font-light">Active Projects</span>
              <span className="text-white font-medium tracking-tight">
                {client.project_summary?.active_projects || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-light">Completed</span>
              <span className="text-white font-medium tracking-tight">
                {client.project_summary?.completed_projects || 0}
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm font-light">Total Value</span>
              <span className="text-white font-medium tracking-tight">
                {formatCurrency(client.project_summary?.total_value || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-light">Lifetime Value</span>
              <span className="text-green-400 font-medium tracking-tight">
                {formatCurrency(client.lifetime_value || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-4 border-t border-white/10">
          {client.email && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm font-light">Email</span>
              <span className="text-gray-300 font-light text-sm truncate max-w-[150px]">
                {client.email}
              </span>
            </div>
          )}
          {client.phone && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm font-light">Phone</span>
              <span className="text-gray-300 font-light text-sm">
                {client.phone}
              </span>
            </div>
          )}
          {client.city && client.state && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-light">Location</span>
              <span className="text-gray-300 font-light text-sm">
                {client.city}, {client.state}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onContact(client)}
          className="btn-secondary flex items-center justify-center space-x-2 py-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Contact</span>
        </button>

        <button 
          onClick={() => onViewDetails(client)}
          className="btn-primary flex items-center justify-center space-x-2 py-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>View Details</span>
        </button>
      </div>

      {/* Quick Actions Menu (Hidden by default, shown on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-3 pt-3 border-t border-white/10">
        <div className="flex justify-between">
          <button 
            onClick={() => onCreateProject(client)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            + New Project
          </button>
          <button 
            onClick={() => onEditClient(client)}
            className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors"
          >
            Edit Client
          </button>
        </div>
      </div>
    </div>
  );
}; 