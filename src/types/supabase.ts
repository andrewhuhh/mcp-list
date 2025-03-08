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
      mcps: {
        Row: {
          id: string
          name: string
          company: string
          description: string
          hosting_type: string
          status: 'official' | 'community'
          setup_type: string
          pricing: string
          categories: string[]
          github_url: string
          logo_url: string | null
          last_updated: string
          created_at: string
          is_promoted: boolean | null
        }
        Insert: {
          id?: string
          name: string
          company: string
          description: string
          hosting_type: string
          status: 'official' | 'community'
          setup_type: string
          pricing: string
          categories: string[]
          github_url: string
          logo_url?: string | null
          last_updated?: string
          created_at?: string
          is_promoted?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          company?: string
          description?: string
          hosting_type?: string
          status?: 'official' | 'community'
          setup_type?: string
          pricing?: string
          categories?: string[]
          github_url?: string
          logo_url?: string | null
          last_updated?: string
          created_at?: string
          is_promoted?: boolean | null
        }
      }
      features: {
        Row: {
          id: string
          mcp_id: string
          title: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mcp_id: string
          title: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mcp_id?: string
          title?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      setup_guides: {
        Row: {
          id: string
          mcp_id: string
          steps: string[]
          command: string | null
          url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          mcp_id: string
          steps: string[]
          command?: string | null
          url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          mcp_id?: string
          steps?: string[]
          command?: string | null
          url?: string | null
          created_at?: string
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
  }
} 