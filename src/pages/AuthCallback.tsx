import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Get the intended destination from localStorage, or default to home
        const destination = localStorage.getItem('authRedirect') || '/';
        localStorage.removeItem('authRedirect'); // Clean up
        navigate(destination);
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
    </div>
  );
} 