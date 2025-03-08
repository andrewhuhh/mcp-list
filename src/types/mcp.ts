export type HostingType = 'self-hosted' | 'cloud-hosted';
export type SetupType = 'easy-setup' | 'flexible-config' | 'for-developers';
export type Status = 'official' | 'community';
export type Pricing = 'free' | 'paid' | 'enterprise';

export interface Feature {
  id: string;
  mcp_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SetupGuide {
  id: string;
  mcp_id: string;
  steps: string[];
  command?: string | null;
  url?: string | null;
  created_at: string;
}

export interface MCP {
  id: string;
  name: string;
  company: string;
  description: string;
  summary: string;
  hosting_type: HostingType;
  status: Status;
  setup_type: SetupType;
  pricing: Pricing;
  categories: string[];
  github_url: string;
  logo_url?: string | null;
  last_updated: string;
  created_at: string;
  is_promoted?: boolean;
  features?: Feature[];
  setupGuide?: SetupGuide;
  seo_aliases: string[];
  app_integrations: string[];
  rating?: number;
  slug: string;
}

export interface MCPReview {
  id: string;
  mcp_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  pros: string[];
  cons: string[];
  use_case: string;
  created_at: string;
  helpful_votes: number;
  is_verified_user: boolean;
} 