import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { MCP } from '../types/mcp';
import { useMCPQuery } from '../hooks/queries/useMCPQuery';
import { VoteButtons } from '../components/voting/VoteButtons';
import { useVotes } from '../hooks/useVotes';
import { useTheme } from '../hooks/useTheme';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { CodeBlock } from '../components/blocks/CodeBlock';
import { PlainCodeBlock } from '../components/blocks/PlainCodeBlock';
import { MCPMetaTags } from '../components/seo/MCPMetaTags';

// Platform Config section component
const PlatformConfigSection: React.FC<{ 
  platform: string;
  setupGuide: MCP['setupGuide'];
  isDark: boolean;
}> = ({ platform, setupGuide }) => {
  if (!setupGuide) return null;

  const getPlatformConfig = () => {
    if (!setupGuide.command) return null;
    
    const parts = setupGuide.command.split(' ');
    const mainCommand = parts[0];
    const args = parts.slice(1);
    
    switch (platform.toLowerCase()) {
      case 'cursor':
        return {
          type: 'json',
          config: {
            name: "my-mcp-server",
            type: "command",
            command: setupGuide.command
          }
        };
      case 'windsurf':
      case 'codeium':
        return {
          type: 'json',
          config: {
            mcpServers: {
              ["my-mcp-server"]: {
                command: mainCommand,
                args: args,
              }
            }
          }
        };
      case 'vscode':
        return {
          type: 'json',
          config: {
            "mcp.servers": {
              "my-mcp-server": {
                "command": setupGuide.command
              }
            }
          }
        };
      default:
        return null;
    }
  };

  const config = getPlatformConfig();
  if (!config) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <img 
          src={`/assets/logos/${platform.toLowerCase()}.jpeg`}
          alt={`${platform} logo`}
          className="w-6 h-6 rounded-md"
        />
        <h3 className="font-medium text-lg text-card-foreground capitalize">{platform} Configuration</h3>
      </div>
      <CodeBlock 
        code={JSON.stringify(config.config, null, 2)}
        language={config.type}
      />
      <p className="text-sm text-muted-foreground">
        {platform === 'cursor' && 'Add this configuration in Cursor\'s Settings → Features → MCP Servers → Add new MCP server'}
        {platform === 'windsurf' && 'Add this to your ~/.codeium/windsurf/mcp_config.json file'}
        {platform === 'vscode' && 'Add this to your VS Code settings.json file'}
      </p>
    </div>
  );
};

// Setup Guide section component

export const MCPDetail = () => {
  const { id, platform } = useParams<{ id: string; platform: string }>();
  const { data: mcp, isLoading: loading, error } = useMCPQuery(id || '', platform);
  const { stats, vote } = useVotes(id || '');
  const isDark = useTheme();
  const errorMessage = error instanceof Error ? error.message : 'An error occurred';

  // Format the last updated date
  const lastUpdated = mcp ? new Date(mcp.last_updated) : new Date();
  const formattedDate = lastUpdated.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Get all supported platforms
  const platforms = mcp?.app_integrations || ['cursor'];
  const currentPlatform = platform || 'cursor';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
        </div>
      </div>
    );
  }

  if (error || !mcp) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-sm p-6 text-center border border-border">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading MCP</h2>
          <p className="text-muted-foreground mb-6">
            {errorMessage || "The MCP you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-5xl mx-auto">
      {/* Add SEO Meta Tags */}
      {mcp && <MCPMetaTags mcp={mcp} platform={currentPlatform} />}

      {/* Back button */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to List
        </Link>
      </div>

      {/* Platform Navigation */}
      {platforms.length > 1 && (
        <div className="mb-6 flex gap-2">
          {platforms.map(p => (
            <Link
              key={p}
              to={`/mcps/${p.toLowerCase()}/${id}`}
              className={`inline-flex items-center px-3 py-1 rounded-md ${
                p.toLowerCase() === currentPlatform.toLowerCase()
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <img 
                src={`/assets/logos/${p.toLowerCase()}.jpeg`}
                alt={`${p} logo`}
                className="w-4 h-4 mr-2 rounded-sm"
              />
              {p}
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header section with gradient background */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch gap-4 mb-4">
              <Card 
                as="article" 
                className="flex-grow relative rounded-xl overflow-hidden"
                interactive={false}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-20" />
                <CardHeader className="relative z-10 flex flex-col gap-4 p-6">
                  <div className="flex gap-3">
                    {mcp.logo_url && (
                      <img 
                        src={mcp.logo_url} 
                        alt={`${mcp.name} logo`} 
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                    )}
                    <div>
                      <h1 className="text-2xl font-semibold text-foreground tracking-tight">{mcp.name}</h1>
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
                  
                </CardHeader>

                <CardContent className="relative z-10 flex flex-col gap-4 px-6">

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
                  <div className="space-y-2">
                    <p className="text-md font-medium text-foreground">
                      {mcp.summary}
                    </p>
                    <p className="text-md text-muted-foreground font-inter">
                      {mcp.description}
                    </p>
                  </div>

                </CardContent>

                <CardFooter className="relative z-10 flex flex-row items-center justify-between px-6 pb-6">
                  <div className="flex flex-row items-center gap-5">
                    <span className="text-sm font-medium text-foreground/80">{formattedDate}</span>
                  </div>
                  <button 
                    onClick={() => window.open(mcp.github_url, '_blank', 'noopener,noreferrer')}
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    Github
                  </button>
                </CardFooter>
              </Card>
              <div className="flex items-center justify-center">
                <VoteButtons stats={stats} onVote={vote} />
              </div>
            </div>

            {/* Features */}
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Features</h2>
              {mcp.features && mcp.features.length > 0 ? (
                <ul className="space-y-4">
                  {mcp.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-success mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-card-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No features listed yet.</p>
              )}
            </div>

            {/* About MCP */}
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">About Model Context Protocol</h2>
              <p className="text-muted-foreground mb-4">
                The Model Context Protocol (MCP) is a standardized way for applications to communicate with AI models,
                enabling real-time context sharing and intelligent interactions.
              </p>
              <Link 
                to="/documentation" 
                className="inline-flex items-center text-primary hover:text-primary/90"
              >
                <span>Read full documentation</span>
                <svg 
                  className="w-4 h-4 ml-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

              {/* Setup Guide */}
              {mcp.setupGuide && (
                <div className="bg-card rounded-lg shadow-sm p-6 mb-6 border border-border">
                  <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Setup Guide</h2>
                  <div className="space-y-6">
                    {/* Manual Installation Steps */}
                    {mcp.setupGuide.steps && mcp.setupGuide.steps.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg text-card-foreground">Manual Installation Steps:</h3>
                        <ol className="list-decimal pl-6 space-y-4">
                          {mcp.setupGuide.steps.map((step: string, index: number) => (
                            <li key={index} className="text-muted-foreground">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Platform-specific Configuration */}
                    <PlatformConfigSection 
                      platform={currentPlatform}
                      setupGuide={mcp.setupGuide}
                      isDark={isDark}
                    />

                    {/* Setup Command */}
                    {mcp.setupGuide.command && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg text-card-foreground">NPM Command:</h3>
                        <CodeBlock 
                          code={mcp.setupGuide.command}
                          language="bash"
                        />
                      </div>
                    )}

                    {/* Documentation Link */}
                    {mcp.setupGuide.url && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg text-card-foreground">Documentation:</h3>
                        <a 
                          href={mcp.setupGuide.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80 underline underline-offset-4"
                        >
                          View Documentation
                          <svg 
                            className="w-4 h-4 ml-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              
              {/* Quickstart */}
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                <div className="text-xl font-semibold mb-4 flex items-center text-card-foreground overflow-visible">
                  <img 
                    src={`/assets/logos/cursor.jpeg`}
                    alt="Cursor Icon"
                    className="w-6 h-6 mr-2 rounded-md opacity-80"
                  />
                  <h2 className="text-xl font-semibold text-card-foreground">Quickstart</h2>
                </div>
                
                {mcp.setupGuide ? (
                  <div className="space-y-4">
                    {mcp.setupGuide.command && (
                      <div>
                        <h3 className="text-md font-medium text-card-foreground mb-2">Installation</h3>
                        <div>
                          <PlainCodeBlock code={mcp.setupGuide.command} />
                        </div>
                      </div>
                    )}

                    {mcp.setupGuide.url && (
                      <div>
                        <h3 className="text-md font-medium text-card-foreground mb-2">Documentation</h3>
                        <a 
                          href={mcp.setupGuide.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80 underline underline-offset-4"
                        >
                          View Documentation
                          <svg 
                            className="w-4 h-4 ml-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No quickstart guide available yet. Check the documentation for setup instructions.
                  </p>
                )}
              </div>

              {/* Repository Info */}
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                  <div className="flex items-center mb-4 text-card-foreground">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <h2 className="text-xl font-semibold text-card-foreground">Repository</h2>
                  </div>
                <a 
                  href={mcp.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-primary hover:text-primary/80 underline underline-offset-4"
                >
                  View on GitHub
                  <svg 
                    className="w-4 h-4 ml-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Categories */}
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 text-card-foreground">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {mcp.categories.map((category: string) => (
                    <span 
                      key={category} 
                      className="px-2.5 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
          </div>

        </div>

      </div>
    </div>
  );
};