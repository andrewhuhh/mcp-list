import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { MCP } from '../../types/mcp';

export const useMCPQuery = (idOrSlug: string, platform?: string) => {
  return useQuery({
    queryKey: ['mcp', idOrSlug, platform],
    queryFn: async (): Promise<MCP> => {
      // Check if the idOrSlug looks like a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      
      let query = supabase
        .from('mcps')
        .select(`
          *,
          setupGuide:setup_guides(
            id,
            steps,
            command,
            url
          ),
          features(
            id,
            title,
            description
          )
        `);

      // If it looks like a UUID, search by ID, otherwise search by slug
      if (isUUID) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      // If platform is specified and not 'cursor', filter by app_integrations
      if (platform && platform !== 'cursor') {
        query = query.contains('app_integrations', [platform]);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      if (!data) throw new Error('MCP not found');

      // Transform setup guide data from array to single object
      const transformedData = {
        ...data,
        setupGuide: data.setupGuide?.[0] || null
      };

      return transformedData;
    },
    enabled: !!idOrSlug
  });
};

// Hook for fetching MCPs with search and filters
export const useMCPsQuery = (filters?: {
  search?: string;
  categories?: string[];
  hosting_type?: string[];
  setup_type?: string[];
  status?: string[];
  platform?: string;
}) => {
  return useQuery({
    queryKey: ['mcps', filters],
    queryFn: async () => {
      let query = supabase
        .from('mcps')
        .select(`
          *,
          setupGuide:setup_guides(
            id,
            steps,
            command,
            url
          ),
          features(
            id,
            title,
            description
          )
        `);

      // Apply filters
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,seo_aliases.cs.{${filters.search}},categories.cs.{${filters.search}},app_integrations.cs.{${filters.search}}`
        );
      }

      if (filters?.categories?.length) {
        query = query.contains('categories', filters.categories);
      }

      if (filters?.hosting_type?.length) {
        query = query.in('hosting_type', filters.hosting_type);
      }

      if (filters?.setup_type?.length) {
        query = query.in('setup_type', filters.setup_type);
      }

      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }

      // Filter by platform if specified
      if (filters?.platform && filters.platform !== 'cursor') {
        query = query.contains('app_integrations', [filters.platform]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });
}; 