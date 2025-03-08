import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { MCPReview } from '../../types/mcp';

export const useReviews = (mcpId: string) => {
  return useQuery({
    queryKey: ['reviews', mcpId],
    queryFn: async (): Promise<MCPReview[]> => {
      const { data, error } = await supabase
        .from('mcp_reviews')
        .select('*')
        .eq('mcp_id', mcpId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};

// Get aggregated review stats
export const useReviewStats = (mcpId: string) => {
  return useQuery({
    queryKey: ['review-stats', mcpId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mcp_reviews')
        .select('rating')
        .eq('mcp_id', mcpId);

      if (error) throw error;

      const ratings = data.map(r => r.rating);
      const avgRating = ratings.length 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;

      return {
        totalReviews: ratings.length,
        averageRating: avgRating,
        ratingDistribution: ratings.reduce((acc, rating) => {
          acc[rating] = (acc[rating] || 0) + 1;
          return acc;
        }, {} as Record<number, number>)
      };
    }
  });
}; 