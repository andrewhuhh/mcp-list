import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '../../lib/utils';

interface AuthButtonProps {
  variant?: 'default' | 'mobile';
}

export function AuthButton({ variant = 'default' }: AuthButtonProps) {
  const { user, signIn, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (provider: 'google' | 'discord') => {
    try {
      setIsLoading(true);
      await signIn(provider);
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={variant === 'mobile' ? 'secondary' : 'ghost'} 
            className={cn(
              "relative rounded-full",
              variant === 'mobile' ? 'h-12 w-12' : 'h-8 w-8'
            )}
          >
            <Avatar className={cn(
              variant === 'mobile' ? 'h-12 w-12' : 'h-8 w-8'
            )}>
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          size="lg"
          disabled={isLoading}
          onClick={() => handleSignIn('google')}
          className="w-full flex items-center justify-center gap-2 text-lg py-6 bg-gradient-to-br from-secondary/50 to-secondary/20 hover:from-secondary/90 hover:to-secondary/40 hover:ring-secondary/20 hover:ring-2"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="w-6 h-6" />
          Google
        </Button>
        <Button
          variant="secondary"
          size="lg"
          disabled={isLoading}
          onClick={() => handleSignIn('discord')}
          className="w-full flex items-center justify-center gap-2 text-lg py-6 bg-gradient-to-br from-secondary/50 to-secondary/20 hover:from-secondary/90 hover:to-secondary/40 hover:ring-secondary/20 hover:ring-2"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/4945/4945973.png" alt="Discord" className="w-6 h-6" />
          Discord
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          Sign in
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem
          onClick={() => handleSignIn('google')}
          disabled={isLoading}
          className="gap-2"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="w-4 h-4" />
          Continue with Google
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSignIn('discord')}
          disabled={isLoading}
          className="gap-2"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/4945/4945973.png" alt="Discord" className="w-4 h-4" />
          Continue with Discord
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 