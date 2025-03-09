import type { MCP } from '../../types/mcp';
import { useVotes } from '../../hooks/useVotes';
import { Card, CardHeader, CardContent } from '../ui/card';
import { StarRating } from '../voting/StarRating';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
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
      className={cn(
        "group relative flex flex-col h-full transition-colors hover:border-border/60 bg-background/50 hover:bg-secondary/50 backdrop-blur-md hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.05)]",
        mcp.is_recommended && "border-blue-500/50 shadow-[0_0_0_1px_rgba(59,130,246,0.1)] bg-gradient-to-br from-blue-50/10 to-blue-100/80 dark:from-blue-950/10 dark:to-blue-900/50 hover:border-blue-500 hover:bg-blue-500/10"
      )}
      onClick={() => navigate(`/mcps/${getPlatform()}/${mcp.slug}`)} 
      role="link" 
      tabIndex={0}
    >
      <CardHeader className="flex flex-row items-start gap-2 p-6 sm:gap-4 pb-0 justify-between">
        <div className="flex flex-row gap-3">
          {/* Logo and Name */}
          {mcp.logo_url && (
            <img 
              src={mcp.logo_url} 
              alt={`${mcp.name} logo`} 
              className="w-12 h-12 object-contain rounded-lg"
            />
          )}
          <div>
            <div className="flex items-center flex-wrap">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg/6 font-semibold text-foreground tracking-tight line-clamp-1">{mcp.name}</h3>
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
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-mono tracking-tight text-sm text-muted-foreground font-medium line-clamp-1">{mcp.company}</p>
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

      <CardContent className="p-6 pt-3">
        <p className="text-base text-muted-foreground line-clamp-3 sm:line-clamp-3">{mcp.summary}</p>
      </CardContent>

      <div className={`mt-auto p-6 py-4 ${mcp.is_recommended ? 'border-t border-blue-500/50' : 'border-t'}`}>
        <div className="flex items-center gap-2">
          {mcp.app_integrations?.map((app) => (
            <img
              key={app}
              src={`/assets/logos/${app.toLowerCase()}.jpeg`}
              alt={`${app} integration`}
              className="w-5 h-5 object-contain rounded-sm opacity-75"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}; 