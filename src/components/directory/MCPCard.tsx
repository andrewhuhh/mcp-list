import type { MCP } from '../../types/mcp';
import { useVotes } from '../../hooks/useVotes';
import { useTheme } from '../../hooks/useTheme';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { VoteButtons } from '../voting/VoteButtons';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';

interface MCPCardProps {
  mcp: MCP;
}

export const MCPCard = ({ mcp }: MCPCardProps) => {
  const navigate = useNavigate();
  const { stats, vote } = useVotes(mcp.id);
  const isDark = useTheme();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);

  // Format the last updated date
  const lastUpdated = new Date(mcp.last_updated);
  const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((lastUpdated.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );
  const formattedDate = lastUpdated.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  useEffect(() => {
    const calculateVisibleCategories = () => {
      const container = categoriesRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      let currentWidth = 0;
      const tempVisible: string[] = [];
      
      // Create a temporary span to measure text width
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.className = 'px-2.5 py-1 text-sm rounded-sm bg-muted text-foreground/80 font-semibold tracking-tight';
      document.body.appendChild(tempSpan);

      for (const category of mcp.categories) {
        tempSpan.textContent = category;
        const elementWidth = tempSpan.offsetWidth + 6; // 6px for gap

        if (currentWidth + elementWidth <= containerWidth) {
          currentWidth += elementWidth;
          tempVisible.push(category);
        } else {
          setHasMore(true);
          break;
        }
      }

      document.body.removeChild(tempSpan);
      setVisibleCategories(tempVisible);
      setHasMore(mcp.categories.length > tempVisible.length);
    };

    calculateVisibleCategories();
    window.addEventListener('resize', calculateVisibleCategories);
    return () => window.removeEventListener('resize', calculateVisibleCategories);
  }, [mcp.categories]);

  return (
    <div className="group relative flex flex-col flex-1 gap-3 h-full">
      <Card 
        as="article" 
        className="flex flex-1 flex-col h-full justify-between transition-colors hover:border-border/60" 
        onClick={() => navigate(`/mcp/${mcp.id}`)} 
        role="link" 
        tabIndex={0}
      >
        
        {/* Card Header */}
        <CardHeader className="flex flex-row gap-4 p-5 justify-between">

          <div className="flex flex-col gap-4">
            {/* Logo and Name */}
            <div className="flex gap-3">
              {mcp.logo_url && (
                <img 
                  src={mcp.logo_url} 
                  alt={`${mcp.name} logo`} 
                  className="w-16 h-16 object-contain rounded-lg"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground tracking-tight">{mcp.name}</h3>
                  {mcp.is_promoted && (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">{mcp.company}</p>
              </div>
            </div>
            
            {/* Hosting Type */}
            <div className="flex items-center text-md text-foreground font-normal opacity-80 tracking-tight">
              <img 
                src={`/assets/icons/${mcp.hosting_type === 'self-hosted' 
                  ? 'pc' 
                  : 'cloud'
                }${isDark ? '_dark' : ''}.png`}
                alt={mcp.hosting_type === 'self-hosted' ? 'Self-Hosted' : 'Cloud-Hosted'}
                className="w-4 h-4 mr-2"
              />
              {mcp.hosting_type === 'self-hosted' ? 'Self-Hosted' : 'Cloud-Hosted'}
            </div>
          </div>

          {/* Vote Column */}
          <div 
            className="flex flex-col items-center justify-center" 
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <VoteButtons 
              stats={stats} 
              onVote={(type) => {
                vote(type);
              }} 
              size="sm"
              className="w-auto"
            />
          </div>

        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex flex-col gap-4 px-5">
          {/* Badges */}
          <div className="flex flex-row items-center gap-5">
            <span className="text-md text-foreground font-semibold">
              {mcp.status === 'official' ? 'Official' : 'Community'}
            </span>
            <span className="text-md text-foreground font-semibold">
              {mcp.setup_type === 'easy-setup' ? 'Quick Setup' : 
               mcp.setup_type === 'flexible-config' ? 'Flexible Config' : 
               'For Developers'}
            </span>
            <span className="text-md text-foreground font-semibold">
              {mcp.pricing.charAt(0).toUpperCase() + mcp.pricing.slice(1)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 font-inter">
            {mcp.description}
          </p>

          {/* Categories */}
          <div ref={categoriesRef} className="flex flex-nowrap gap-1.5 overflow-hidden">
            {visibleCategories.map((category) => (
              <span 
                key={category}
                className="px-2.5 py-1 text-sm rounded-sm bg-muted text-foreground/80 font-semibold tracking-tight whitespace-nowrap"
              >
                {category}
              </span>
            ))}
            {hasMore && (
              <span 
                className="px-2.5 py-1 text-sm rounded-sm bg-muted text-foreground/80 font-semibold tracking-tight whitespace-nowrap"
              >
                +{mcp.categories.length - visibleCategories.length}
              </span>
            )}
          </div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex flex-row items-center justify-between px-5 pb-5">
          <div className="flex flex-row items-center gap-5">
            <span className="text-sm font-medium text-foreground/80">{formattedDate}</span>
            <span className="text-sm font-medium text-foreground/50">{timeAgo}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(mcp.github_url, '_blank', 'noopener,noreferrer');
            }}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Github
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}; 