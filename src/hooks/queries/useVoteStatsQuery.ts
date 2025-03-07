import { useQuery } from '@tanstack/react-query';
import { getVoteStats } from '../../lib/api/votes';

export function useVoteStatsQuery(mcpId: string) {
  return useQuery({
    queryKey: ['voteStats', mcpId],
    queryFn: () => getVoteStats(mcpId),
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });
} 