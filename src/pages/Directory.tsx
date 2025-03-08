import { useState, useEffect } from 'react';
import { useMCPsQuery } from '../hooks/queries/useMCPsQuery';
import { MCPCard } from '../components/directory/MCPCard';
import { SearchInput } from '../components/ui/search-input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from "../components/ui/skeleton";

type SortOption = {
  label: string;
  value: string;
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

export const Directory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const { ref: loadMoreRef, inView } = useInView();

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

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8 mt-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Discover MCP Servers</h1>
        <p className="text-muted-foreground">Browse and discover Model Context Protocol (MCP) tools and services</p>
      </div>
      
      {/* Search and Sort */}
      <div className="md:mb-12 mb-6 flex flex-col md:flex-row max-w-3xl mx-auto sm:px-6 space-y-4 md:space-y-0 md:space-x-4 justify-center items-center">
        {/* Search Bar */}
        <SearchInput
          placeholder="Search by name or description..."
          onSearch={setSearchQuery}
          debounceMs={500}
        />

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 px-3 w-full md:w-auto">
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

      {/* Loading State - Initial */}
      {loading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {allMCPs.map((mcp) => (
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

          {/* Load More - Infinite Scroll Trigger */}
          {(hasNextPage || isFetchingNextPage) && (
            <div
              ref={loadMoreRef}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6"
            >
              {isFetchingNextPage && Array.from({ length: 3 }).map((_, i) => (
                <MCPCardSkeleton key={`loading-${i}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && allMCPs.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No MCPs Found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}; 