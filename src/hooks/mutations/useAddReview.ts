import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { MCPReview } from '../../types/mcp';

type AddReviewInput = Omit<MCPReview, 'id' | 'created_at' | 'helpful_votes'>;

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: AddReviewInput) => {
      const { data, error } = await supabase
        .from('mcp_reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.mcp_id] });
      queryClient.invalidateQueries({ queryKey: ['review-stats', variables.mcp_id] });
    }
  });
};

// Hook for voting on review helpfulness
export const useVoteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, helpful }: { reviewId: string; helpful: boolean }) => {
      // First get current votes
      const { data: currentReview, error: fetchError } = await supabase
        .from('mcp_reviews')
        .select('helpful_votes, mcp_id')
        .eq('id', reviewId)
        .single();

      if (fetchError) throw fetchError;

      // Then update with new vote count
      const newVotes = (currentReview.helpful_votes || 0) + (helpful ? 1 : -1);
      const { data, error } = await supabase
        .from('mcp_reviews')
        .update({ helpful_votes: newVotes })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.mcp_id] });
    }
  });
}; 