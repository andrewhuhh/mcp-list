import React from 'react';
import { VoteType, VoteStats } from '../../types/vote';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  stats: VoteStats;
  onVote: (type: VoteType) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  stats, 
  onVote, 
  size = 'md',
  className = ''
}) => {
  const iconClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const hasVoted = stats.userVote === 'up';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onVote('up');
      }}
      className={cn(
        'flex items-center gap-1.5 text-sm font-semibold rounded-full',
        'border py-0.5 px-2 transition-colors duration-200',
        'transition-all duration-200 hover:bg-secondary/50 hover:border-secondary/60 hover:scale-105 hover:drop-shadow-md hover:drop-shadow-[0_4px_6px_rgba(234,179,8,0.5)]',
        hasVoted ? [
          'text-yellow-600 dark:text-yellow-400',
          'bg-yellow-100/50 dark:bg-yellow-400/10',
          'border-yellow-300 dark:border-yellow-500'
        ] : [
          'text-gray-700 dark:text-gray-300',
          'bg-gray-100 dark:bg-gray-800',
          'border-gray-300 dark:border-gray-600',
          'hover:text-yellow-600 dark:hover:text-yellow-400',
          'hover:bg-yellow-100/50 dark:hover:bg-yellow-400/10',
          'hover:border-yellow-300 dark:hover:border-yellow-500'
        ],
        className
      )}
      aria-label={hasVoted ? 'Already starred' : 'Star'}
    >
      <svg 
        className={cn(
          iconClass,
          'fill-current'
        )}
        viewBox="0 0 24 24"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      <span>{stats.upvotes}</span>
    </button>
  );
}; 