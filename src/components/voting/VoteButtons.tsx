import React from 'react';
import { VoteType, VoteStats } from '../../types/vote';
import { cn } from '../../lib/utils';

interface VoteButtonsProps {
  stats: VoteStats;
  onVote: (type: VoteType) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({ 
  stats, 
  onVote, 
  size = 'md',
  className = ''
}) => {
  const iconClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const hasVoted = stats.userVote === 'up';

  return (
    <button
      onClick={() => onVote('up')}
      className={cn(
        'relative flex-1 flex flex-col items-center justify-center gap-0 sm:gap-1 rounded-lg px-4 sm:px-6 py-2 transition-all duration-200 h-full border border-vote-border',
        hasVoted ? 'bg-success hover:bg-success-hover' : 'bg-vote hover:bg-vote-hover',
        'group cursor-pointer select-none',
        className
      )}
      aria-label={hasVoted ? 'Already voted' : 'Upvote'}
    >
      <svg 
        className={cn(
          iconClass,
          'transition-all duration-200',
          hasVoted ? 'text-success-foreground' : 'text-vote-text',
          'group-hover:animate-vote-bounce'
        )}
        viewBox="0 0 24 24"
        fill="none" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M5 15l7-7 7 7" 
        />
      </svg>
      <span className={cn(
        "text-md font-medium transition-colors duration-200",
        hasVoted ? "text-success-foreground" : "text-vote-text"
      )}>
        {stats.upvotes}
      </span>
    </button>
  );
}; 