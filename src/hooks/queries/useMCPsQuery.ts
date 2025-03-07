import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { MCP } from '../../types/mcp';

interface QueryOptions {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  hostingType?: string;
  setupType?: string;
  pricing?: string;
  promotedOnly?: boolean;
}


async function fetchMCPs(searchQuery: string = '', options: QueryOptions = {}): Promise<MCP[]> {
  // First, get the ratings for each MCP
  const { data: ratingsData } = await supabase
    .from('mcps_votes')
    .select('mcp_id, vote_type');

  // Calculate ratings
  const ratings = new Map();
  ratingsData?.forEach(vote => {
    const currentRating = ratings.get(vote.mcp_id) || 0;
    ratings.set(vote.mcp_id, currentRating + 1);
  });

  let query = supabase
    .from('mcps')
    .select(`
      *,
      setup_guides:setup_guides!left (
        steps,
        command,
        url
      ),
      features:features!left (
        title,
        description
      )
    `);

  // Apply search filter if query exists
  if (searchQuery) {
    query = query.or(
      `name.ilike.%${searchQuery}%,` +
      `description.ilike.%${searchQuery}%,` +
      `categories.cs.{${searchQuery}}`
    );
  }

  // Apply filters
  if (options.hostingType) {
    query = query.eq('hosting_type', options.hostingType);
  }

  if (options.setupType) {
    query = query.eq('setup_type', options.setupType);
  }

  if (options.pricing) {
    query = query.eq('pricing', options.pricing);
  }

  if (options.promotedOnly) {
    query = query.eq('is_promoted', true);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Transform the data and apply sorting
  const transformedData = (data || []).map(mcp => ({
    ...mcp,
    setupGuide: mcp.setup_guides?.[0] ? {
      cursor: {
        steps: mcp.setup_guides[0].steps,
        command: mcp.setup_guides[0].command || undefined,
        url: mcp.setup_guides[0].url || undefined
      }
    } : undefined,
    features: mcp.features?.map((feature: { title: string; description: string }) => ({
      title: feature.title,
      description: feature.description
    })) || [],
    rating: ratings.get(mcp.id) || 0
  }));

  // Apply sorting
  return transformedData.sort((a, b) => {
    if (options.sortBy === 'weighted') {
      // Custom weighted sorting
      if (a.is_promoted !== b.is_promoted) {
        return b.is_promoted ? 1 : -1;
      }
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
    }
    
    if (options.sortBy === 'rating') {
      return options.sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    }
    
    if (options.sortBy === 'last_updated' || options.sortBy === 'created_at') {
      const aDate = new Date(a[options.sortBy]).getTime();
      const bDate = new Date(b[options.sortBy]).getTime();
      return options.sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }

    // Default to weighted sort
    if (a.is_promoted !== b.is_promoted) {
      return b.is_promoted ? 1 : -1;
    }
    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }
    return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
  });
}

export function useMCPsQuery(searchQuery: string = '', options: QueryOptions = {}) {
  return useQuery({
    queryKey: ['mcps', searchQuery, options],
    queryFn: () => fetchMCPs(searchQuery, options),
  });
} 