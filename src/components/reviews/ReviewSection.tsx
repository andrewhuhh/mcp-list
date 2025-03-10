import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import type { MCPReview } from '../../types/mcp';
import { toast } from 'sonner';

interface ReviewSectionProps {
  mcpId: string;
  reviews: MCPReview[];
  onReviewAdded: () => void;
}

// Single review component
const Review = ({ 
  review, 
  onSubmitReply,
  level = 0,
  isSubmitting = false 
}: { 
  review: MCPReview; 
  onSubmitReply: (parentId: string, text: string) => Promise<void>;
  level?: number;
  isSubmitting?: boolean;
}) => {
  const { user } = useAuth();
  const maxNestingLevel = 3;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const replies = review.replies || [];
  const hasReplies = replies.length > 0;
  const canNestFurther = level < maxNestingLevel;

  const truncateName = (name: string) => {
    return name.length > 15 ? name.substring(0, 15) + '...' : name;
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !user) return;
    
    try {
      await onSubmitReply(review.id, replyText);
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <div className="relative">
      {/* Thread line */}
      {level > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-px bg-border"
          style={{ left: `${level}rem` }}
        />
      )}
      
      <div className={`relative ${level > 0 ? 'pl-6' : ''}`}>
        {/* Horizontal thread line */}
        {level > 0 && (
          <div 
            className="absolute left-0 top-4 w-4 h-px bg-border"
            style={{ left: `${level}rem` }}
          />
        )}

        <div className="flex items-start gap-4">
          {hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6 rounded-full hover:bg-accent"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <div className="flex-1">
            <div className="flex items-start gap-3">
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
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {truncateName(review.user_metadata.full_name)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 mt-1">{review.review_text}</p>
                
                {/* Reply button and form */}
                <div className="mt-2">
                  {canNestFurther && !isReplying && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        if (!user) {
                          toast.error('Please sign in to reply');
                          return;
                        }
                        setIsReplying(true);
                      }}
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  )}
                  
                  {isReplying && user && (
                    <div className="mt-2 pl-4 border-l-2 border-border">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="min-h-[80px] text-sm resize-none bg-primary/5"
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={handleReplySubmit}
                          disabled={isSubmitting || !replyText.trim()}
                        >
                          {isSubmitting ? 'Posting...' : 'Post Reply'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsReplying(false);
                            setReplyText('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nested replies */}
            {hasReplies && isExpanded && (
              <div className="mt-2 space-y-4">
                {replies.map((reply) => (
                  <Review 
                    key={reply.id} 
                    review={reply} 
                    onSubmitReply={onSubmitReply}
                    level={level + 1}
                    isSubmitting={isSubmitting}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function ReviewSection({ mcpId, reviews, onReviewAdded }: ReviewSectionProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) {
          const submitEvent = new Event('submit', { cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Anonymous',
          avatar_url: user.user_metadata.avatar_url || null
        }
      });

      if (error) throw error;

      setReviewText('');
      onReviewAdded();
      toast.success('Review posted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to post review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string, text: string) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.from('mcp_reviews').insert({
        mcp_id: mcpId,
        user_id: user.id,
        review_text: text,
        parent_id: parentId,
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Anonymous',
          avatar_url: user.user_metadata.avatar_url || null
        }
      });

      if (error) throw error;

      onReviewAdded();
      toast.success('Reply posted successfully!');
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to post reply. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const threaded = organizeThreads(reviews);

  return (
    <div className="space-y-8">
      {/* Review Form */}
      {user && (
        <Card interactive={false}>
          <CardHeader>
            <CardTitle>Leave a review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[100px] bg-primary/5"
              />
              <Button type="submit" disabled={isSubmitting || !reviewText.trim()}>
                {isSubmitting ? 'Submitting...' : 'Submit Review (Ctrl+Enter)'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardContent className="p-6">
          {threaded.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8">
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
            <div className="space-y-6">
              {threaded.map((review) => (
                <Review 
                  key={review.id} 
                  review={review} 
                  onSubmitReply={handleSubmitReply}
                  isSubmitting={isSubmitting}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 