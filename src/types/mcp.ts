export type HostingType = 'self-hosted' | 'cloud-hosted';
export type SetupType = 'easy-setup' | 'flexible-config' | 'for-developers';
export type Status = 'official' | 'community';
export type Pricing = 'free' | 'paid' | 'enterprise';

export interface Feature {
  title: string;
  description: string;
}

export interface MCP {
  id: string;
  name: string;
  company: string;
  description: string;
  hosting_type: HostingType;
  status: Status;
  setup_type: SetupType;
  pricing: Pricing;
  categories: string[];
  github_url: string;
  logo_url?: string;
  thumbnail_url?: string;
  last_updated: string;
  created_at: string;
  is_promoted?: boolean;
  features?: Feature[];
  setupGuide?: {
    cursor: {
      steps: string[];
      command?: string;
      url?: string;
    };
  };
  quickstart?: {
    prerequisites?: string[];
    installation?: string;
    usage?: string;
  };
} 