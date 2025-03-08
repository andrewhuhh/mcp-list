import { Helmet } from 'react-helmet-async';
import type { MCP } from '../../types/mcp';

interface MCPMetaTagsProps {
  mcp: MCP;
  platform?: string;
}

export const MCPMetaTags: React.FC<MCPMetaTagsProps> = ({ mcp, platform = 'cursor' }) => {
  const title = platform === 'cursor' 
    ? `${mcp.name} MCP - Model Context Protocol for Cursor IDE`
    : `${mcp.name} MCP for ${platform} - Model Context Protocol`;

  const description = mcp.summary || mcp.description;
  
  // Generate platform-specific keywords
  const keywords = [
    mcp.name,
    platform,
    `${platform} MCP`,
    `${platform} Model Context Protocol`,
    'MCP',
    'Model Context Protocol',
    ...(mcp.seo_aliases || []),
    ...(mcp.categories || []),
    mcp.company,
    mcp.hosting_type,
    mcp.setup_type,
    ...(mcp.app_integrations || [])
  ].filter(Boolean);

  // Generate canonical URL
  const canonicalUrl = `https://mcp.modelcontextprotocol.ai/mcps/${platform.toLowerCase()}/${mcp.slug}`;

  // Get last updated date as version
  const lastUpdatedDate = new Date(mcp.last_updated);
  const version = `${lastUpdatedDate.getFullYear()}.${lastUpdatedDate.getMonth() + 1}.${lastUpdatedDate.getDate()}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      {mcp.logo_url && <meta property="og:image" content={mcp.logo_url} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {mcp.logo_url && <meta name="twitter:image" content={mcp.logo_url} />}

      {/* Platform-specific meta tags */}
      <meta name="application-name" content={`${mcp.name} MCP`} />
      <meta name="platform" content={platform} />
      <meta name="software-version" content={version} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: mcp.name,
          description: description,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: mcp.pricing === 'free' ? '0' : undefined,
            priceCurrency: 'USD'
          },
          author: {
            '@type': 'Organization',
            name: mcp.company
          },
          softwareVersion: version,
          applicationSuite: platform,
          requirements: `${platform} IDE`,
          dateModified: mcp.last_updated,
          ...(mcp.logo_url && { image: mcp.logo_url })
        })}
      </script>
    </Helmet>
  );
}; 