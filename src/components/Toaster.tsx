import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '../hooks/useTheme';

export function Toaster() {
  const isDark = useTheme();
  
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: isDark ? 'hsl(var(--foreground))' : 'black',
          color: isDark ? 'hsl(var(--background))' : 'white',
          border: '1px solid hsl(var(--border))',
          maxWidth: '90vw',
          width: 'fit-content',
          margin: '0 auto',
          transform: 'none',
          left: '0',
          right: '0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05)'
        },
        className: 'text-sm font-medium',
      }}
    />
  );
} 