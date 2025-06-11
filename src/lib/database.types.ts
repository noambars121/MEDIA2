export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_assistant_settings: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean
          personality: string
          preferred_language: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean
          personality?: string
          preferred_language?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean
          personality?: string
          preferred_language?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_conversation_history: {
        Row: {
          client_id: string | null
          content: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversation_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          industry: string | null
          brand_voice: string | null
          target_audience: string | null
          brand_guidelines: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          industry?: string | null
          brand_voice?: string | null
          target_audience?: string | null
          brand_guidelines?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          industry?: string | null
          brand_voice?: string | null
          target_audience?: string | null
          brand_guidelines?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          name: string
          description: string | null
          status: 'planning' | 'active' | 'completed' | 'cancelled'
          type: 'wedding' | 'portrait' | 'event' | 'commercial' | 'other'
          start_date: string | null
          end_date: string | null
          budget: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          name: string
          description?: string | null
          status?: 'planning' | 'active' | 'completed' | 'cancelled'
          type?: 'wedding' | 'portrait' | 'event' | 'commercial' | 'other'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          name?: string
          description?: string | null
          status?: 'planning' | 'active' | 'completed' | 'cancelled'
          type?: 'wedding' | 'portrait' | 'event' | 'commercial' | 'other'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          project_id: string | null
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          project_id?: string | null
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          project_id?: string | null
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          project_id: string | null
          invoice_number: string
          amount: number
          currency: string
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date: string | null
          issued_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          project_id?: string | null
          invoice_number: string
          amount: number
          currency?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string | null
          issued_date: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          project_id?: string | null
          invoice_number?: string
          amount?: number
          currency?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string | null
          issued_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          client_id: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          metadata: Json | null
          tags: string[]
          status: 'uploaded' | 'processing' | 'ready' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          client_id?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          metadata?: Json | null
          tags?: string[]
          status?: 'uploaded' | 'processing' | 'ready' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          client_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          metadata?: Json | null
          tags?: string[]
          status?: 'uploaded' | 'processing' | 'ready' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          business_name: string | null
          business_type: string | null
          phone: string | null
          website: string | null
          bio: string | null
          avatar_url: string | null
          timezone: string | null
          language: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          business_name?: string | null
          business_type?: string | null
          phone?: string | null
          website?: string | null
          bio?: string | null
          avatar_url?: string | null
          timezone?: string | null
          language?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          business_name?: string | null
          business_type?: string | null
          phone?: string | null
          website?: string | null
          bio?: string | null
          avatar_url?: string | null
          timezone?: string | null
          language?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_content: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter'
          content_type: 'post' | 'story' | 'reel' | 'carousel'
          topic: string
          tone: 'professional' | 'casual' | 'friendly' | 'enthusiastic' | 'elegant'
          language: 'en' | 'he'
          content: string
          hashtags: string[]
          call_to_action: string | null
          content_tips: string[]
          custom_instructions: string | null
          status: 'generated' | 'edited' | 'published' | 'archived'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter'
          content_type: 'post' | 'story' | 'reel' | 'carousel'
          topic: string
          tone: 'professional' | 'casual' | 'friendly' | 'enthusiastic' | 'elegant'
          language: 'en' | 'he'
          content: string
          hashtags?: string[]
          call_to_action?: string | null
          content_tips?: string[]
          custom_instructions?: string | null
          status?: 'generated' | 'edited' | 'published' | 'archived'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          platform?: 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter'
          content_type?: 'post' | 'story' | 'reel' | 'carousel'
          topic?: string
          tone?: 'professional' | 'casual' | 'friendly' | 'enthusiastic' | 'elegant'
          language?: 'en' | 'he'
          content?: string
          hashtags?: string[]
          call_to_action?: string | null
          content_tips?: string[]
          custom_instructions?: string | null
          status?: 'generated' | 'edited' | 'published' | 'archived'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ai_content_stats: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_content: number
          content_by_platform: Json
          content_by_status: Json
          content_by_month: Json
          most_used_platforms: string[]
          average_content_length: number
        }[]
      }
      search_ai_content: {
        Args: {
          user_uuid: string
          search_query?: string
          platform_filter?: string
          status_filter?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          client_id: string | null
          platform: string
          content_type: string
          topic: string
          tone: string
          language: string
          content: string
          hashtags: string[]
          call_to_action: string | null
          content_tips: string[]
          status: string
          created_at: string
          updated_at: string
          client_name: string | null
          client_industry: string | null
        }[]
      }
      get_content_suggestions: {
        Args: {
          user_uuid: string
          client_uuid?: string
          topic_query?: string
        }
        Returns: {
          suggested_platform: string
          suggested_tone: string
          usage_count: number
          last_used: string
        }[]
      }
    }
    Enums: {
      user_role: "owner" | "team_member" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

// Convenient type aliases
export type Client = Tables<'clients'>
export type Project = Tables<'projects'>

// AI Content specific types
export type AIContent = Database['public']['Tables']['ai_content']['Row']
export type AIContentInsert = Database['public']['Tables']['ai_content']['Insert']
export type AIContentUpdate = Database['public']['Tables']['ai_content']['Update']

// Platform and content type enums
export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter'
export type ContentType = 'post' | 'story' | 'reel' | 'carousel'
export type ContentTone = 'professional' | 'casual' | 'friendly' | 'enthusiastic' | 'elegant'
export type ContentLanguage = 'en' | 'he'
export type ContentStatus = 'generated' | 'edited' | 'published' | 'archived'

// Content analytics types
export type AIContentStats = {
  total_content: number
  content_by_platform: Record<string, number>
  content_by_status: Record<string, number>
  content_by_month: Record<string, number>
  most_used_platforms: string[]
  average_content_length: number
}

export type ContentSuggestion = {
  suggested_platform: Platform
  suggested_tone: ContentTone
  usage_count: number
  last_used: string
}

// Extended types for UI components
export type AIContentWithClient = AIContent & {
  clients?: {
    name: string
    industry?: string
  }
}

// Other table types
export type ClientInsert = TablesInsert<'clients'>
export type ClientUpdate = TablesUpdate<'clients'>

export type ProjectInsert = TablesInsert<'projects'>
export type ProjectUpdate = TablesUpdate<'projects'>

export type Appointment = Tables<'appointments'>
export type AppointmentInsert = TablesInsert<'appointments'>
export type AppointmentUpdate = TablesUpdate<'appointments'>

export type Invoice = Tables<'invoices'>
export type InvoiceInsert = TablesInsert<'invoices'>
export type InvoiceUpdate = TablesUpdate<'invoices'>

export type Media = Tables<'media'>
export type MediaInsert = TablesInsert<'media'>
export type MediaUpdate = TablesUpdate<'media'>

export type UserProfile = Tables<'user_profiles'>
export type UserProfileInsert = TablesInsert<'user_profiles'>
export type UserProfileUpdate = TablesUpdate<'user_profiles'>

export type UserRole = Database['public']['Enums']['user_role']

// Enhanced Client Management Types
export interface ClientContact {
  id: string;
  client_id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  is_primary: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientCommunicationHistory {
  id: string;
  client_id: string;
  user_id: string;
  communication_type: 'email' | 'phone' | 'meeting' | 'text' | 'video_call' | 'note';
  subject?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  status: 'pending' | 'completed' | 'scheduled';
  scheduled_at?: string;
  completed_at?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientPreferences {
  id: string;
  client_id: string;
  user_id: string;
  primary_colors: string[];
  secondary_colors: string[];
  fonts: string[];
  photography_style?: string[];
  video_style?: string[];
  mood_keywords: string[];
  content_themes: string[];
  preferred_posting_times: Record<string, any>;
  content_approval_required: boolean;
  created_at: string;
  updated_at: string;
}

// Enhanced Client type with new fields
export interface EnhancedClient extends Client {
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  website?: string;
  linkedin_url?: string;
  instagram_handle?: string;
  facebook_url?: string;
  referral_source?: string;
  client_status: 'active' | 'inactive' | 'prospect' | 'vip' | 'archived';
  priority_level: number;
  lifetime_value: number;
  avatar_url?: string;
  tags: string[];
  
  // Related data
  contacts?: ClientContact[];
  communication_history?: ClientCommunicationHistory[];
  preferences?: ClientPreferences;
  project_summary?: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_value: number;
  };
}

export interface ClientStats {
  total_clients: number;
  active_clients: number;
  vip_clients: number;
  prospect_clients: number;
  total_lifetime_value: number;
  avg_project_value: number;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
}

export interface RecentClientActivity {
  activity_type: 'communication' | 'project' | 'feedback';
  client_id: string;
  client_name: string;
  description: string;
  activity_date: string;
} 