import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { VoteType, VoteStats } from '../types/vote';
import { useVoteStatsQuery } from './queries/useVoteStatsQuery';
import { vote } from '../lib/api/votes';
import { toast } from 'sonner';

const VOTE_STORAGE_KEY = 'mcp_votes';

interface StoredVote {
  mcpId: string;
  type: VoteType;
  timestamp: number;
}

function getStoredVotes(): Record<string, StoredVote> {
  try {
    const stored = localStorage.getItem(VOTE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function storeVote(mcpId: string, type: VoteType) {
  try {
    const votes = getStoredVotes();
    votes[mcpId] = { mcpId, type, timestamp: Date.now() };
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // Ignore storage errors
  }
}

export function useVotes(mcpId: string) {
  const queryClient = useQueryClient();
  const { data: stats = { upvotes: 0, downvotes: 0, total: 0 } } = useVoteStatsQuery(mcpId);
  const storedVote = getStoredVotes()[mcpId];

  const voteStats: VoteStats = {
    ...stats,
    userVote: storedVote?.type
  };

  const handleVote = useCallback(async (type: VoteType) => {
    if (type === 'down') {
      console.warn('Downvoting is not supported');
      return;
    }

    const oldStats = { ...voteStats };
    try {
      // If the user already voted the same way, treat it as removing their vote
      const isRemovingVote = type === voteStats.userVote;
      
      // Optimistically update the UI
      const newStats: VoteStats = {
        ...voteStats,
        userVote: isRemovingVote ? null : type,
        upvotes: voteStats.upvotes + (isRemovingVote ? -1 : 1),
        total: voteStats.upvotes + (isRemovingVote ? -1 : 1),
      };

      queryClient.setQueryData(['voteStats', mcpId], newStats);

      // Update local storage
      if (isRemovingVote) {
        const votes = getStoredVotes();
        delete votes[mcpId];
        localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
      } else {
        storeVote(mcpId, type);
      }

      // Make the API call
      await vote(mcpId, type, '', isRemovingVote);

      // Invalidate the query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['voteStats', mcpId] });
    } catch (error) {
      // Revert the optimistic update
      queryClient.setQueryData(['voteStats', mcpId], oldStats);
      
      // Show error message
      const errorMessage = error instanceof Error ? error.message : 'Error voting';
      toast.error(errorMessage);
      
      // Remove from local storage if there was an error
      const votes = getStoredVotes();
      delete votes[mcpId];
      localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
    }
  }, [mcpId, voteStats, queryClient]);

  return {
    stats: voteStats,
    vote: handleVote,
  };
} 