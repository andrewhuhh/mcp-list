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
          description: string
          author: string
          github_url: string
          logo_url: string | null
          thumbnail_url: string | null
          status: 'official' | 'community'
          tags: string[]
          categories: string[]
          verified: boolean
          quick_setup: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          author: string
          github_url: string
          logo_url?: string | null
          thumbnail_url?: string | null
          status: 'official' | 'community'
          tags: string[]
          categories: string[]
          verified?: boolean
          quick_setup?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          author?: string
          github_url?: string
          logo_url?: string | null
          thumbnail_url?: string | null
          status?: 'official' | 'community'
          tags?: string[]
          categories?: string[]
          verified?: boolean
          quick_setup?: boolean
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
          updated_at: string
        }
        Insert: {
          id?: string
          mcp_id: string
          steps: string[]
          command?: string | null
          url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mcp_id?: string
          steps?: string[]
          command?: string | null
          url?: string | null
          created_at?: string
          updated_at?: string
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