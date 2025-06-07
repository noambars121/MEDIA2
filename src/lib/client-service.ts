import { supabase } from './supabase';
import type { Client, TablesInsert, TablesUpdate } from './database.types';

export class ClientService {
  /**
   * Get all clients for a user
   */
  static async getAllClients(userId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get a single client by ID
   */
  static async getClient(clientId: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to fetch client: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new client
   */
  static async createClient(clientData: TablesInsert<'clients'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing client
   */
  static async updateClient(
    clientId: string,
    updates: TablesUpdate<'clients'>
  ): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', clientId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update client: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a client
   */
  static async deleteClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) {
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }

  /**
   * Search clients by name or business name
   */
  static async searchClients(userId: string, searchTerm: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search clients: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get clients by business type
   */
  static async getClientsByType(userId: string, businessType: string): Promise<Client[]> {
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
  static async getClientStats(userId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('status, business_type')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch client statistics: ${error.message}`);
    }

    const stats = {
      total: data.length,
      active: data.filter(c => c.status === 'active').length,
      inactive: data.filter(c => c.status === 'inactive').length,
      byType: {} as Record<string, number>
    };

    // Group by business type
    data.forEach(client => {
      if (client.business_type) {
        stats.byType[client.business_type] = (stats.byType[client.business_type] || 0) + 1;
      }
    });

    return stats;
  }
} 