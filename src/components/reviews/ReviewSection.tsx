import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { MCPReview } from '../../types/mcp';

interface ReviewSectionProps {
  mcpId: string;
  reviews: MCPReview[];
  onReviewAdded: () => void;
}

// Single review component
const Review = ({ review, onReply, level = 0 }: { 
  review: MCPReview; 
  onReply: (parentId: string) => void;
  level?: number;
}) => {
  const maxNestingLevel = 3; // Maximum nesting level to prevent deep threads
  const [showReplies, setShowReplies] = useState(true);
  const replies = review.replies || [];
  const hasReplies = replies.length > 0;
  const canNestFurther = level < maxNestingLevel;

  const truncateName = (name: string) => {
    return name.length > 15 ? name.substring(0, 15) + '...' : name;
  };

  return (
    <div className={`${level > 0 ? 'ml-8 mt-4' : ''}`}>
      <Card interactive={false}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-8 w-8">
              {review.user_metadata.avatar_url && (
                <AvatarImage 
                  src={review.user_metadata.avatar_url} 
                  alt={review.user_metadata.full_name} 
                />
              )}
              <AvatarFallback>
                {review.user_metadata.full_name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {truncateName(review.user_metadata.full_name)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm">{review.review_text}</p>
              {canNestFurther && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onReply(review.id)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Reply
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Nested replies */}
      {hasReplies && (
        <div className="mt-2">
          {showReplies ? (
            <div className="space-y-2">
              {replies.map((reply) => (
                <Review 
                  key={reply.id} 
                  review={reply} 
                  onReply={onReply}
                  level={level + 1}
                />
              ))}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(true)}
              className="text-xs text-muted-foreground hover:text-foreground ml-8"
            >
              Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export function ReviewSection({ mcpId, reviews, onReviewAdded }: ReviewSectionProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Organize reviews into a threaded structure
  const organizeThreads = (reviews: MCPReview[]): MCPReview[] => {
    const reviewMap = new Map<string, MCPReview>();
    const topLevelReviews: MCPReview[] = [];

    // First pass: create a map of all reviews
    reviews.forEach(review => {
      reviewMap.set(review.id, { ...review, replies: [] });
    });

    // Second pass: organize into threads
    reviews.forEach(review => {
      const reviewWithReplies = reviewMap.get(review.id)!;
      if (review.parent_id && reviewMap.has(review.parent_id)) {
        const parent = reviewMap.get(review.parent_id)!;
        parent.replies = parent.replies || [];
        parent.replies.push(reviewWithReplies);
      } else {
        topLevelReviews.push(reviewWithReplies);
      }
    });

    return topLevelReviews;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!user || !reviewText.trim()) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.from('mcp_reviews').insert({
        mcp_id: mcpId,
        user_id: user.id,
        review_text: reviewText,
        parent_id: replyingTo,
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Anonymous',
          avatar_url: user.user_metadata.avatar_url || null
        }
      });

      if (error) throw error;

      // Reset form
      setReviewText('');
      setReplyingTo(null);
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
  };

  const threaded = organizeThreads(reviews);

  return (
    <div className="space-y-8">
      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card interactive={false}>
            <CardHeader>
              <CardTitle>
                {replyingTo ? 'Write a reply' : 'Leave a review'}
                {replyingTo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                    className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel reply
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={replyingTo ? "Write your reply..." : "Share your thoughts..."}
                  className="min-h-[100px] bg-primary/5"
                />
              </div>

              <Button type="submit" disabled={isSubmitting || !reviewText.trim()}>
                {isSubmitting ? 'Submitting...' : replyingTo ? 'Submit Reply' : 'Submit Review (Ctrl+Enter)'}
              </Button>
            </CardContent>
          </Card>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {threaded.length === 0 ? (
          <div className="flex flex-col items-center gap-4 pt-8 my-8">
            <p className="text-muted-foreground text-center">
              No reviews yet. Be the first to review!
            </p>
            {!user && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                    onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="w-5 h-5" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                    onClick={() => supabase.auth.signInWithOAuth({ provider: 'discord' })}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/4945/4945973.png" alt="Discord" className="w-5 h-5" />
                    Discord
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          threaded.map((review) => (
            <Review 
              key={review.id} 
              review={review} 
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
} 