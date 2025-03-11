import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function ErrorPage() {
  console.log('🚨 ERROR PAGE COMPONENT MOUNTED 🚨');
  
  const error = useRouteError();
  const navigate = useNavigate();
  
  console.log('🔍 Error details:', {
    error,
    type: typeof error,
    isResponse: isRouteErrorResponse(error),
    path: window.location.pathname
  });
  
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-6 py-8 text-center">
        <div className="mb-8">
          {is404 ? (
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          ) : (
            <h1 className="text-4xl font-bold text-primary mb-2">Oops!</h1>
          )}
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {is404 ? "Page Not Found" : "Something went wrong"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {is404
              ? "The page you're looking for doesn't exist or has been moved."
              : "An unexpected error has occurred. Please try again later."}
          </p>
          {isRouteErrorResponse(error) && (
            <div className="text-sm text-muted-foreground mb-6 p-4 bg-muted rounded-lg">
              <p>Status: {error.status}</p>
              <p>{error.statusText}</p>
              {error.data?.message && <p>Message: {error.data.message}</p>}
              <p className="mt-2 text-xs">Path: {window.location.pathname}</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
} 