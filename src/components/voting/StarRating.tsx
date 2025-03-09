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
        'flex items-center gap-1.5 text-sm font-semibold rounded-full bg-gray-200 border border-gray-300 py-0.5 px-2',
        hasVoted ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400' : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400',
        'transition-colors duration-200',
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