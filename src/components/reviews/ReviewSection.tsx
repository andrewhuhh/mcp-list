import { useState, useEffect } from 'react';
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

export function ReviewSection({ mcpId, reviews, onReviewAdded }: ReviewSectionProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewText, setReviewText] = useState('');

  // Debug log to see user data structure
  useEffect(() => {
    if (user) {
      console.log('User data:', {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
        identities: user.identities
      });
    }
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [reviewText]); // Re-run effect when reviewText changes

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

      // Reset form
      setReviewText('');
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const truncateName = (name: string) => {
    return name.length > 15 ? name.substring(0, 15) + '...' : name;
  };

  return (
    <div className="space-y-8">
      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card interactive={false}>
            <CardHeader>
              <CardTitle>Leave a review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="min-h-[100px] bg-primary/5"
                />
              </div>

              <Button type="submit" disabled={isSubmitting || !reviewText.trim()}>
                {isSubmitting ? 'Submitting...' : 'Submit Review (Ctrl+Enter)'}
              </Button>
            </CardContent>
          </Card>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
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
          reviews.map((review) => (
            <Card key={review.id} interactive={false}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 