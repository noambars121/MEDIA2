import { supabase } from './supabase';
import type { 
  EnhancedClient, 
  ClientContact, 
  ClientCommunicationHistory, 
  ClientPreferences,
  ClientStats,
  RecentClientActivity 
} from './database.types';

export class EnhancedClientService {
  // Client Management
  async getEnhancedClients(): Promise<EnhancedClient[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select(`
        *,
        client_contacts(*),
        client_preferences(*),
        projects(id, name, status, budget),
        invoices(id, amount, status)
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return clients?.map(client => ({
      ...client,
      project_summary: {
        total_projects: client.projects?.length || 0,
        active_projects: client.projects?.filter((p: any) => p.status === 'active').length || 0,
        completed_projects: client.projects?.filter((p: any) => p.status === 'completed').length || 0,
        total_value: client.projects?.reduce((sum: number, p: any) => sum + (p.budget || 0), 0) || 0
      }
    })) || [];
  }

  async getClientById(id: string): Promise<EnhancedClient | null> {
    const { data: client, error } = await supabase
      .from('clients')
      .select(`
        *,
        client_contacts(*),
        client_preferences(*),
        projects(id, name, status, budget, created_at),
        invoices(id, amount, status, created_at)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!client) return null;

    return {
      ...client,
      project_summary: {
        total_projects: client.projects?.length || 0,
        active_projects: client.projects?.filter((p: any) => p.status === 'active').length || 0,
        completed_projects: client.projects?.filter((p: any) => p.status === 'completed').length || 0,
        total_value: client.projects?.reduce((sum: number, p: any) => sum + (p.budget || 0), 0) || 0
      }
    };
  }

  async createClient(client: Partial<EnhancedClient>): Promise<EnhancedClient> {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name: client.name!,
        email: client.email,
        phone: client.phone,
        company: client.company,
        industry: client.industry,
        address: client.address,
        city: client.city,
        state: client.state,
        zip_code: client.zip_code,
        country: client.country || 'US',
        website: client.website,
        linkedin_url: client.linkedin_url,
        instagram_handle: client.instagram_handle,
        facebook_url: client.facebook_url,
        referral_source: client.referral_source,
        client_status: client.client_status || 'active',
        priority_level: client.priority_level || 3,
        lifetime_value: client.lifetime_value || 0,
        avatar_url: client.avatar_url,
        tags: client.tags || [],
        brand_voice: client.brand_voice,
        target_audience: client.target_audience,
        brand_guidelines: client.brand_guidelines,
        notes: client.notes
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateClient(id: string, updates: Partial<EnhancedClient>): Promise<EnhancedClient> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Client Contacts Management
  async getClientContacts(clientId: string): Promise<ClientContact[]> {
    const { data, error } = await supabase
      .from('client_contacts')
      .select('*')
      .eq('client_id', clientId)
      .order('is_primary', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createClientContact(contact: Omit<ClientContact, 'id' | 'created_at' | 'updated_at'>): Promise<ClientContact> {
    const { data, error } = await supabase
      .from('client_contacts')
      .insert([contact])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateClientContact(id: string, updates: Partial<ClientContact>): Promise<ClientContact> {
    const { data, error } = await supabase
      .from('client_contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteClientContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('client_contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Communication History
  async getCommunicationHistory(clientId: string): Promise<ClientCommunicationHistory[]> {
    const { data, error } = await supabase
      .from('client_communication_history')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addCommunication(communication: Omit<ClientCommunicationHistory, 'id' | 'created_at' | 'updated_at'>): Promise<ClientCommunicationHistory> {
    const { data, error } = await supabase
      .from('client_communication_history')
      .insert([communication])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCommunication(id: string, updates: Partial<ClientCommunicationHistory>): Promise<ClientCommunicationHistory> {
    const { data, error } = await supabase
      .from('client_communication_history')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Client Preferences
  async getClientPreferences(clientId: string): Promise<ClientPreferences | null> {
    const { data, error } = await supabase
      .from('client_preferences')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return data;
  }

  async createOrUpdatePreferences(preferences: Omit<ClientPreferences, 'id' | 'created_at' | 'updated_at'>): Promise<ClientPreferences> {
    const { data, error } = await supabase
      .from('client_preferences')
      .upsert([preferences])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Statistics and Analytics
  async getClientStats(): Promise<ClientStats> {
    const { data, error } = await supabase
      .rpc('get_client_stats', { 
        user_uuid: (await supabase.auth.getUser()).data.user?.id 
      });

    if (error) throw error;
    return data[0] || {
      total_clients: 0,
      active_clients: 0,
      vip_clients: 0,
      prospect_clients: 0,
      total_lifetime_value: 0,
      avg_project_value: 0,
      total_projects: 0,
      active_projects: 0,
      completed_projects: 0
    };
  }

  async getRecentActivity(daysBack: number = 30): Promise<RecentClientActivity[]> {
    const { data, error } = await supabase
      .rpc('get_recent_client_activity', { 
        user_uuid: (await supabase.auth.getUser()).data.user?.id,
        days_back: daysBack
      });

    if (error) throw error;
    return data || [];
  }

  // Search and Filter
  async searchClients(searchTerm: string, filters?: {
    status?: string;
    priority?: number;
    tags?: string[];
  }): Promise<EnhancedClient[]> {
    let query = supabase
      .from('clients')
      .select(`
        *,
        client_contacts(*),
        client_preferences(*),
        projects(id, name, status, budget)
      `);

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
    }

    if (filters?.status) {
      query = query.eq('client_status', filters.status);
    }

    if (filters?.priority) {
      query = query.eq('priority_level', filters.priority);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    const { data, error } = await query.order('updated_at', { ascending: false });

    if (error) throw error;

    return data?.map(client => ({
      ...client,
      project_summary: {
        total_projects: client.projects?.length || 0,
        active_projects: client.projects?.filter((p: any) => p.status === 'active').length || 0,
        completed_projects: client.projects?.filter((p: any) => p.status === 'completed').length || 0,
        total_value: client.projects?.reduce((sum: number, p: any) => sum + (p.budget || 0), 0) || 0
      }
    })) || [];
  }

  // Utility Methods
  async updateClientLifetimeValue(clientId: string): Promise<void> {
    // Calculate lifetime value from completed projects and paid invoices
    const { data: projects } = await supabase
      .from('projects')
      .select('budget')
      .eq('client_id', clientId)
      .eq('status', 'completed');

    const { data: invoices } = await supabase
      .from('invoices')
      .select('amount')
      .eq('client_id', clientId)
      .eq('status', 'paid');

    const projectValue = projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;
    const invoiceValue = invoices?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
    const lifetimeValue = Math.max(projectValue, invoiceValue);

    await this.updateClient(clientId, { lifetime_value: lifetimeValue });
  }

  async getUpcomingFollowUps(): Promise<ClientCommunicationHistory[]> {
    const { data, error } = await supabase
      .from('client_communication_history')
      .select(`
        *,
        clients(name, email)
      `)
      .eq('follow_up_required', true)
      .gte('follow_up_date', new Date().toISOString().split('T')[0])
      .order('follow_up_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

export const enhancedClientService = new EnhancedClientService(); 