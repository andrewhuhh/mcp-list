export type VoteType = 'up' | 'down';

export interface Vote {
  id: string;
  mcp_id: string;
  vote_type: VoteType;
  created_at: string;
}

export interface VoteStats {
  upvotes: number;
  downvotes: number;
  total: number;
  userVote?: VoteType | null;
} 