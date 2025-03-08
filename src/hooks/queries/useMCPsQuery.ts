import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { MCP, HostingType, SetupType, Pricing, Feature, SetupGuide } from '../../types/mcp';

interface QueryOptions {
  sortBy?: 'weighted' | 'rating' | 'last_updated' | 'created_at';
  sortDirection?: 'asc' | 'desc';
  hostingType?: HostingType;
  setupType?: SetupType;
  pricing?: Pricing;
  promotedOnly?: boolean;
  limit?: number;
}

interface PageParam {
  cursor: number;
  searchQuery: string;
  options: QueryOptions;
}

interface MCPResponse extends Omit<MCP, 'setupGuide' | 'features'> {
  setup_guides: SetupGuide[];
  features: Feature[];
  vote_count: number;
}

interface PageResult {
  mcps: MCP[];
  nextCursor: number | null;
}

const DEFAULT_PAGE_LIMIT = 50;

async function fetchMCPsPage({ cursor, searchQuery, options }: PageParam): Promise<PageResult> {
  const limit = options.limit || DEFAULT_PAGE_LIMIT;

  // First, get the upvote counts
  const { data: voteCounts, error: voteError } = await supabase
    .from('mcps_votes')
    .select('mcp_id')
    .eq('vote_type', 'up')
    .throwOnError();

  if (voteError) throw voteError;

  // Calculate upvote counts per MCP
  const voteMap = new Map<string, number>();
  voteCounts?.forEach(vote => {
    const currentCount = voteMap.get(vote.mcp_id) || 0;
    voteMap.set(vote.mcp_id, currentCount + 1);
  });

  // Build the main query
  let query = supabase
    .from('mcps')
    .select(`
      *,
      setup_guides (
        id,
        mcp_id,
        steps,
        command,
        url,
        created_at
      ),
      features (
        id,
        mcp_id,
        title,
        description,
        created_at,
        updated_at
      )
    `);

  // Apply search filter if query exists
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,categories.cs.{${searchQuery}}`);
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
  if (options.sortBy === 'last_updated' || options.sortBy === 'created_at') {
    query = query.order(options.sortBy, { ascending: options.sortDirection === 'asc' });
  } else {
    // Default to sorting by promotion status and last_updated
    query = query.order('is_promoted', { ascending: false })
                .order('last_updated', { ascending: false });
  }

  // Apply pagination
  query = query.range(cursor, cursor + limit - 1);

  const { data: mcps, error: mcpsError } = await query;

  if (mcpsError) throw mcpsError;

  // Transform and sort the data
  let transformedData: MCP[] = (mcps || []).map((mcp: MCPResponse) => ({
    ...mcp,
    setupGuide: mcp.setup_guides?.[0],
    features: mcp.features || [],
    rating: voteMap.get(mcp.id) || 0
  }));

  // Handle rating sort separately since it depends on the vote counts
  if (options.sortBy === 'rating') {
    transformedData.sort((a, b) => {
      const diff = (b.rating || 0) - (a.rating || 0);
      return options.sortDirection === 'asc' ? -diff : diff;
    });
  } else if (options.sortBy === 'weighted') {
    // Custom weighted sort that considers votes, promotion, and recency
    transformedData.sort((a, b) => {
      const aScore = calculateWeightedScore(a, voteMap.get(a.id) || 0);
      const bScore = calculateWeightedScore(b, voteMap.get(b.id) || 0);
      return bScore - aScore;
    });
  }

  const nextCursor = mcps?.length === limit ? cursor + limit : null;

  return {
    mcps: transformedData,
    nextCursor
  };
}

// Helper function to calculate weighted score
function calculateWeightedScore(mcp: MCP, voteCount: number): number {
  const now = new Date().getTime();
  const lastUpdated = new Date(mcp.last_updated).getTime();
  const daysSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60 * 24);
  
  return (
    (mcp.is_promoted ? 1000 : 0) + // Base promotion score
    (voteCount * 100) + // Vote weight
    (10 / (daysSinceUpdate + 1)) // Recency weight (max 10, decaying over time)
  );
}

export function useMCPsQuery(searchQuery: string = '', options: QueryOptions = {}) {
  return useInfiniteQuery<PageResult, Error, PageResult>({
    queryKey: ['mcps', searchQuery, options],
    queryFn: ({ pageParam = 0 }) => fetchMCPsPage({ 
      cursor: pageParam as number, 
      searchQuery, 
      options: { ...options, limit: DEFAULT_PAGE_LIMIT } 
    }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
} 