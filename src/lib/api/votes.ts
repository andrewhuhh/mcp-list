import { supabase } from '../supabase';
import { VoteType, VoteStats } from '../../types/vote';

const VOTE_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to get user's IP address
async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    throw new Error('Failed to get IP address');
  }
}

export async function getVoteStats(mcpId: string): Promise<VoteStats> {
  if (!mcpId) {
    return {
      upvotes: 0,
      downvotes: 0,
      total: 0,
      userVote: null
    };
  }

  // Count all upvotes for this MCP
  const { count } = await supabase
    .from('mcps_votes')
    .select('*', { count: 'exact', head: true })
    .eq('mcp_id', mcpId)
    .eq('vote_type', 'up');

  return {
    upvotes: count || 0,
    downvotes: 0,
    total: count || 0,
    userVote: null, // This will be set by the hook based on localStorage
  };
}

export async function vote(mcpId: string, type: VoteType, _ip: string, remove: boolean = false): Promise<VoteStats> {
  if (type === 'down') {
    throw new Error('Downvoting is not supported');
  }

  // Get the user's IP address
  const ip = await getUserIP();

  // Check if the user has voted recently
  const { data: existingVotes, error: queryError } = await supabase
    .from('mcps_votes')
    .select('*')
    .eq('mcp_id', mcpId)
    .eq('ip_address', ip);

  if (queryError) {
    throw new Error('Failed to check existing votes');
  }

  const existingVote = existingVotes?.[0];

  if (existingVote) {
    const timeSinceLastVote = Date.now() - new Date(existingVote.created_at).getTime();
    
    if (!remove && timeSinceLastVote < VOTE_COOLDOWN) {
      throw new Error('You can only vote once every 24 hours');
    }

    // Remove the existing vote
    const { error: deleteError } = await supabase
      .from('mcps_votes')
      .delete()
      .eq('mcp_id', mcpId)
      .eq('ip_address', ip);

    if (deleteError) {
      throw new Error('Failed to remove vote');
    }

    if (remove) {
      return getVoteStats(mcpId);
    }
  }

  if (!remove) {
    // Add the new vote
    const { error: insertError } = await supabase
      .from('mcps_votes')
      .insert([
        {
          mcp_id: mcpId,
          vote_type: type,
          ip_address: ip,
        },
      ]);

    if (insertError) {
      throw new Error('Failed to add vote');
    }
  }

  return getVoteStats(mcpId);
} 