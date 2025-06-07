export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          brand_style: string | null
          brand_voice: string | null
          business_name: string | null
          business_type: string | null
          category: string | null
          content_preferences: Json | null
          created_at: string | null
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          tags: string[] | null
          tiktok: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          brand_style?: string | null
          brand_voice?: string | null
          business_name?: string | null
          business_type?: string | null
          category?: string | null
          content_preferences?: Json | null
          created_at?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          tiktok?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          brand_style?: string | null
          brand_voice?: string | null
          business_name?: string | null
          business_type?: string | null
          category?: string | null
          content_preferences?: Json | null
          created_at?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          tiktok?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          project_type: string
          start_date: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          project_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          project_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          business_type: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          phone_text: string | null
          preferred_language: string | null
          profile_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          phone_text?: string | null
          preferred_language?: string | null
          profile_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          phone_text?: string | null
          preferred_language?: string | null
          profile_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenient type aliases
export type Client = Tables<'clients'>
export type User = Tables<'users'>
export type Project = Tables<'projects'>
export type UserRole = Database['public']['Enums']['user_role'] 