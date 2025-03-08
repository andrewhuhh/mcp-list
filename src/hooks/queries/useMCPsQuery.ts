import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { MCP } from '../../types/mcp';

interface QueryOptions {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  hostingType?: string;
  setupType?: string;
  pricing?: string;
  promotedOnly?: boolean;
  limit?: number;
}

interface PageParam {
  cursor: number;
  searchQuery: string;
  options: QueryOptions;
}

async function fetchMCPsPage({ cursor, searchQuery, options }: PageParam): Promise<{ mcps: MCP[], nextCursor: number | null }> {
  const limit = options.limit || 12;

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
      setup_guides!left (
        steps,
        command,
        url
      ),
      features!left (
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

  // Apply sorting
  if (options.sortBy === 'rating') {
    // For rating sort, we need to handle it client-side
    query = query.range(cursor, cursor + limit - 1);
  } else if (options.sortBy === 'last_updated' || options.sortBy === 'created_at') {
    query = query
      .order(options.sortBy, { ascending: options.sortDirection === 'asc' })
      .range(cursor, cursor + limit - 1);
  } else {
    // Default weighted sort
    query = query
      .order('is_promoted', { ascending: false })
      .order('last_updated', { ascending: false })
      .range(cursor, cursor + limit - 1);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Transform the data
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

  // Apply rating sort if needed
  if (options.sortBy === 'rating') {
    transformedData.sort((a, b) => 
      options.sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating
    );
  }

  // Determine if there are more pages
  const nextCursor = data?.length === limit ? cursor + limit : null;

  return {
    mcps: transformedData,
    nextCursor
  };
}

export function useMCPsQuery(searchQuery: string = '', options: QueryOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['mcps', searchQuery, options],
    queryFn: ({ pageParam = 0 }) => fetchMCPsPage({ 
      cursor: pageParam, 
      searchQuery, 
      options: { ...options, limit: 12 } 
    }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
} 