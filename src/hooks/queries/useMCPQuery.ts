import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { MCP } from '../../types/mcp';

async function fetchMCP(id: string): Promise<MCP> {
  const { data, error } = await supabase
    .from('mcps')
    .select(`
      *,
      setup_guides (
        steps,
        command,
        url
      ),
      features (
        title,
        description
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  // Transform the data to match the expected format
  return {
    ...data,
    setupGuide: data.setup_guides?.[0] ? {
      cursor: {
        steps: data.setup_guides[0].steps,
        command: data.setup_guides[0].command || undefined,
        url: data.setup_guides[0].url || undefined
      }
    } : undefined,
    features: data.features?.map((feature: { title: string; description: string }) => ({
      title: feature.title,
      description: feature.description
    })) || []
  };
}

export function useMCPQuery(id: string) {
  return useQuery({
    queryKey: ['mcp', id],
    queryFn: () => fetchMCP(id),
    enabled: !!id, // Only run the query if we have an ID
  });
} 