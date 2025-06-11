import { supabase } from './supabase';
import type { Database } from './database.types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export class ClientService {
  /**
   * Get all clients for a user
   */
  async getAllClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  /**
   * Get a single client by ID
   */
  async getClientById(id: string) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  }

  /**
   * Create a new client
   */
  async createClient(clientData: Omit<ClientInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  /**
   * Update an existing client
   */
  async updateClient(id: string, updates: ClientUpdate) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  /**
   * Delete a client
   */
  async deleteClient(id: string) {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  /**
   * Search clients by name or business name
   */
  async searchClients(searchTerm: string, filters: {
    status?: string;
    priority?: number;
    industry?: string;
  } = {}) {
    try {
      let query = supabase
        .from('clients')
        .select('*');

      // Add search functionality
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      // Add filters
      if (filters.status) {
        query = query.eq('client_status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority_level', filters.priority);
      }
      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }

      query = query.order('updated_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching clients:', error);
      throw error;
    }
  }

  /**
   * Get clients by business type
   */
  async getClientsByType(userId: string, businessType: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .eq('business_type', businessType)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch clients by type: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get client statistics for a user
   */
  async getClientStats() {
    try {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('client_status, priority_level, lifetime_value');

      if (error) throw error;

      const stats = {
        total: clients?.length || 0,
        active: clients?.filter(c => c.client_status === 'active' || c.client_status === 'vip').length || 0,
        vip: clients?.filter(c => c.client_status === 'vip').length || 0,
        prospects: clients?.filter(c => c.client_status === 'prospect').length || 0,
        inactive: clients?.filter(c => c.client_status === 'inactive').length || 0,
        totalLifetimeValue: clients?.reduce((sum, c) => sum + (c.lifetime_value || 0), 0) || 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting client stats:', error);
      throw error;
    }
  }
}

export const clientService = new ClientService(); 