import { Star } from 'lucide-react';

interface ReviewStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

export function ReviewStars({ rating, onRatingChange, readonly = false }: ReviewStarsProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          disabled={readonly}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-primary text-primary'
                : 'fill-none text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
} 