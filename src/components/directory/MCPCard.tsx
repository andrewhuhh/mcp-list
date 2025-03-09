import type { MCP } from '../../types/mcp';
import { useVotes } from '../../hooks/useVotes';
import { Card, CardHeader, CardContent } from '../ui/card';
import { StarRating } from '../voting/StarRating';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
// import { CheckCircle2 } from 'lucide-react';

interface MCPCardProps {
  mcp: MCP;
}

export const MCPCard = ({ mcp }: MCPCardProps) => {
  const navigate = useNavigate();
  const { stats, vote } = useVotes(mcp.id);

  // Get the platform from app_integrations or default to 'cursor'
  const getPlatform = () => {
    if (!mcp.app_integrations?.length) return 'cursor';
    return mcp.app_integrations.includes('cursor') ? 'cursor' : mcp.app_integrations[0].toLowerCase();
  };

  return (
    <Card 
      as="article" 
      className="group relative flex flex-col h-full transition-colors hover:border-border/60" 
      onClick={() => navigate(`/mcps/${getPlatform()}/${mcp.slug}`)} 
      role="link" 
      tabIndex={0}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4 pb-0 justify-between">
        <div className="flex gap-3">
          {/* Logo and Name */}
          {mcp.logo_url && (
            <img 
              src={mcp.logo_url} 
              alt={`${mcp.name} logo`} 
              className="w-12 h-12 object-contain rounded-lg"
            />
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-semibold text-foreground tracking-tight">{mcp.name}</h3>
                {/* {mcp.status === 'official' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                )} */}
              </div>
              <div className="flex gap-1">
                {mcp.is_promoted && (
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                    Featured
                  </Badge>
                )}
                {mcp.is_recommended && (
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                    Recommended
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground font-medium">{mcp.company}</p>
            </div>
          </div>
        </div>

        <StarRating 
          stats={stats} 
          onVote={vote} 
          size="sm"
          className="text-xs"
        />
      </CardHeader>

      <CardContent className="p-4 pt-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{mcp.summary}</p>
      </CardContent>
    </Card>
  );
}; 