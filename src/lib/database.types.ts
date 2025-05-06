
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
      health_datasets: {
        Row: {
          id: string
          name: string
          description: string | null
          source: string
          created_at: string | null
          updated_at: string | null
          metadata: Json | null
          tags: string[] | null
          is_public: boolean | null
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          source: string
          created_at?: string | null
          updated_at?: string | null
          metadata?: Json | null
          tags?: string[] | null
          is_public?: boolean | null
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          source?: string
          created_at?: string | null
          updated_at?: string | null
          metadata?: Json | null
          tags?: string[] | null
          is_public?: boolean | null
          user_id?: string | null
        }
      }
      dataset_fields: {
        Row: {
          id: string
          dataset_id: string | null
          name: string
          display_name: string
          data_type: string
          description: string | null
          required: boolean | null
          statistics: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          dataset_id?: string | null
          name: string
          display_name: string
          data_type: string
          description?: string | null
          required?: boolean | null
          statistics?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          dataset_id?: string | null
          name?: string
          display_name?: string
          data_type?: string
          description?: string | null
          required?: boolean | null
          statistics?: Json | null
          created_at?: string | null
        }
      }
      dataset_data: {
        Row: {
          id: string
          dataset_id: string | null
          data: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          dataset_id?: string | null
          data: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          dataset_id?: string | null
          data?: Json
          created_at?: string | null
        }
      }
      user_dashboards: {
        Row: {
          id: string
          name: string
          description: string | null
          layout: Json
          created_at: string | null
          updated_at: string | null
          user_id: string | null
          is_public: boolean | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          layout: Json
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          is_public?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          layout?: Json
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          is_public?: boolean | null
        }
      }
      analysis_results: {
        Row: {
          id: string
          analysis_type: string
          parameters: Json
          results: Json
          created_at: string | null
          dataset_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          analysis_type: string
          parameters: Json
          results: Json
          created_at?: string | null
          dataset_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          analysis_type?: string
          parameters?: Json
          results?: Json
          created_at?: string | null
          dataset_id?: string | null
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for better type inference
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types for easier access
export type HealthDataset = Tables<'health_datasets'>
export type DatasetField = Tables<'dataset_fields'>
export type DatasetData = Tables<'dataset_data'>
export type UserDashboard = Tables<'user_dashboards'>
export type AnalysisResult = Tables<'analysis_results'>
