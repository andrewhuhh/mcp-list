import { useState, useEffect, useMemo } from 'react';
import { useMCPsQuery } from '../hooks/queries/useMCPsQuery';
import { MCPCard } from '../components/directory/MCPCard';
import { SearchInput } from '../components/ui/search-input';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from "../components/ui/skeleton";
import { Helmet } from 'react-helmet-async';
import { CollapsibleSection } from '../components/directory/CollapsibleSection';
import type { MCP } from '../types/mcp';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from '../components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const GRID_LAYOUT_CLASS = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 mt-0";

type SortOption = {
  label: string;
  value: 'weighted' | 'rating' | 'last_updated' | 'created_at';
  direction: 'asc' | 'desc';
};

const sortOptions: SortOption[] = [
  { label: 'Best Match', value: 'weighted', direction: 'desc' },
  { label: 'Highest Rated', value: 'rating', direction: 'desc' },
  { label: 'Recently Updated', value: 'last_updated', direction: 'desc' },
  { label: 'Newest', value: 'created_at', direction: 'desc' },
  { label: 'Oldest', value: 'created_at', direction: 'asc' },
];

const MCPCardSkeleton = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-[280px]">
    <Skeleton className="h-6 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-6" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  </div>
);

// Define our main categories and their display names
const CATEGORIES = {
  RECOMMENDED: {
    title: "Recommended MCPs",
    filter: (mcp: MCP) => mcp.is_recommended,
    id: 'recommended'
  },
  FEATURED: {
    title: "Featured MCPs",
    filter: (mcp: MCP) => mcp.is_promoted,
    id: 'featured'
  },
  OFFICIAL: {
    title: "Official MCPs",
    filter: (mcp: MCP) => mcp.status === 'official',
    id: 'official'
  },
  COMMUNITY: {
    title: "Community MCPs",
    filter: (mcp: MCP) => !mcp.is_promoted && !mcp.is_recommended && mcp.status !== 'official',
    id: 'community'
  },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

const searchInMCP = (mcp: MCP, query: string) => {
  const searchQuery = query.toLowerCase();
  
  // Basic fields (direct string matches)
  const basicFields = [
    mcp.name,
    mcp.company,
    mcp.summary,
    mcp.description,
    mcp.hosting_type,
    mcp.status,
    mcp.setup_type,
    mcp.pricing
  ].map(field => (field || '').toLowerCase());

  // Array fields (need to check each item)
  const arrayFields = [
    mcp.categories,
    mcp.seo_aliases,
    mcp.app_integrations
  ].flat().map(field => (field || '').toLowerCase());

  // Feature fields (need to check title and description)
  const featureFields = (mcp.features || []).flatMap(feature => [
    feature.title.toLowerCase(),
    feature.description.toLowerCase()
  ]);

  // Combine all searchable content
  const allSearchableContent = [
    ...basicFields,
    ...arrayFields,
    ...featureFields
  ];

  // Check if any field contains the search query
  return allSearchableContent.some(field => field.includes(searchQuery));
};

export const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const { ref: loadMoreRef, inView } = useInView();

  // Get open sections from URL
  const openSections = useMemo(() => {
    const sections = searchParams.get('sections')?.split(',') || [];
    return new Set(sections.length ? sections : Object.values(CATEGORIES).map(c => c.id));
  }, [searchParams]);

  // Update URL when sections change
  const handleSectionToggle = (sectionId: string, isOpen: boolean) => {
    const newSections = new Set(openSections);
    if (isOpen) {
      newSections.add(sectionId);
    } else {
      newSections.delete(sectionId);
    }
    
    const params = new URLSearchParams(searchParams);
    const sectionsArray = Array.from(newSections);
    if (sectionsArray.length === Object.keys(CATEGORIES).length) {
      params.delete('sections'); // Default state, no need to store
    } else {
      params.set('sections', sectionsArray.join(','));
    }
    setSearchParams(params);
  };

  // Update URL when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  // Update search when URL changes
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl || '');
    }
  }, [searchParams]);

  const {
    data,
    isLoading: loading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useMCPsQuery(searchQuery, {
    sortBy: sortBy.value,
    sortDirection: sortBy.direction,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const errorMessage = error instanceof Error ? error.message : 'An error occurred';
  const allMCPs = data?.pages.flatMap(page => page.mcps) ?? [];
  const uniqueMCPs = allMCPs.filter((mcp, index) => 
    index === allMCPs.findIndex(m => m.id === mcp.id)
  );

  // Organize MCPs into categories
  const categorizedMCPs = useMemo(() => {
    if (!uniqueMCPs) return {} as Record<CategoryKey, MCP[]>;
    
    const filtered = uniqueMCPs.filter(mcp => {
      if (!searchQuery) return true;
      return searchInMCP(mcp, searchQuery);
    });

    return Object.entries(CATEGORIES).reduce((acc, [key, category]) => {
      acc[key as CategoryKey] = filtered.filter(category.filter);
      return acc;
    }, {} as Record<CategoryKey, MCP[]>);
  }, [uniqueMCPs, searchQuery]);

  return (
    <div className="h-full">
      <Helmet>
        <title>MCP List - Browse Model Context Protocols</title>
        <meta name="description" content="Browse and discover Model Context Protocol (MCP) tools and services. Find the perfect MCP implementation for your AI integration needs." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "MCP List Directory",
            "description": "Browse and discover Model Context Protocol (MCP) tools and services",
            "url": "https://mcp.modelcontextprotocol.ai",
            "about": {
              "@type": "Thing",
              "name": "Model Context Protocol",
              "description": "A standardized way for applications to communicate with AI models"
            }
          })}
        </script>
      </Helmet>
      
      {/* Header */}
      <div className="mb-8 mt-12 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tighter bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent">Discover MCP Servers</h1>
        <p className="md:text-xl text-lg font-semibold text-muted-foreground tracking-tight">Browse and discover Model Context Protocol (MCP) tools and services</p>
      </div>
      
      {/* Search and Sort */}
      <div className="md:mb-12 mb-6 flex flex-col md:flex-row max-w-3xl mx-auto sm:px-6 space-y-2 md:space-y-0 md:space-x-4 justify-center items-center">
        {/* Search Bar */}
        <SearchInput
          placeholder="Search by name or description..."
          onSearch={handleSearch}
          value={searchQuery}
          debounceMs={500}
        />

        {/* Sort Dropdown */}
        <div hidden>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 px-3 w-full md:w-auto">
                        Sort by: {sortBy.label}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      {sortOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.label}
                          onClick={() => setSortBy(option)}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
        </div>
      </div>

      {/* Loading State - Initial */}
      {loading && !data && (
        <div className={GRID_LAYOUT_CLASS}>
          {Array.from({ length: 6 }).map((_, i) => (
            <MCPCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold">Error Loading MCPs</h3>
            <p className="text-sm">{errorMessage}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* MCP List */}
      {!loading && !error && (
        <div className="flex flex-col">
          {(Object.entries(CATEGORIES) as [CategoryKey, typeof CATEGORIES[CategoryKey]][]).map(([key, category]) => {
            const mcps = categorizedMCPs[key] || [];
            if (mcps.length === 0) return null;

            return (
              <CollapsibleSection
                key={key}
                title={category.title}
                count={mcps.length}
                isOpen={openSections.has(category.id)}
                onToggle={(isOpen) => handleSectionToggle(category.id, isOpen)}
              >
                <div className={GRID_LAYOUT_CLASS}>
                  <AnimatePresence mode="popLayout">
                    {mcps.map((mcp) => (
                      <motion.div
                        key={mcp.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          opacity: { duration: 0.2 },
                          layout: { duration: 0.3 },
                          scale: { duration: 0.2 }
                        }}
                      >
                        <MCPCard mcp={mcp} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add loading indicator within each non-empty category */}
                {key === 'COMMUNITY' && (hasNextPage || isFetchingNextPage) && (
                  <div
                    ref={loadMoreRef}
                    className="mt-4"
                  >
                    {isFetchingNextPage && (
                      <div className={GRID_LAYOUT_CLASS}>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <MCPCardSkeleton key={`loading-${i}`} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CollapsibleSection>
            );
          })}

          {/* Empty State */}
          {Object.values(categorizedMCPs).every(mcps => mcps.length === 0) && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No MCPs Found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 