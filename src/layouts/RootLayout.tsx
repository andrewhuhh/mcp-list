import { Link, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/themes/ThemeToggle';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from '../contexts/AuthContext';
import { AuthButton } from '../components/auth/AuthButton';
import { ScrollToTop } from '../components/ScrollToTop';
import { MobileNav } from '../components/MobileNav';
import { Toaster } from '../components/ui/sonner';

export function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col relative">
        <ScrollToTop />
        <SpeedInsights />
        <Analytics />
        <Toaster />
        
        {/* Gradient background */}
        <div 
          className="fixed top-0 left-0 right-0 -z-20"
          style={{ 
            height: '200vh',
            transform: 'translateY(-60%)'
          }}
          aria-hidden="true"
        >
          <div 
            className="w-full h-full bg-[radial-gradient(circle_at_center,_hsl(221,_83%,_53%)_0%,_transparent_70%)] opacity-[0.3] dark:opacity-[0.5]"
            style={{ 
              transform: 'scale(1.5)',
            }}
          />
        </div>

        {/* Pattern background */}
        <div 
          className="fixed inset-0 -z-10"
          aria-hidden="true"
        >
          <svg
            className="absolute h-full w-full opacity-[0.03] dark:opacity-[0.07]"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="fade-mask" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="50%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
              <mask id="combined-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect width="100%" height="100%" fill="url(#fade-mask)" />
                <image
                  href="/assets/pattern.webp"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                  opacity="0.8"
                />
              </mask>
            </defs>
            <rect 
              width="100%" 
              height="100%" 
              fill="url(#grid-pattern)"
              mask="url(#combined-mask)"
            />
          </svg>
        </div>

        {/* Rest of the layout */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-7xl mx-auto items-center">
            <div className="flex-1 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/assets/Vector.png" alt="MCP-List" className="w-auto h-4" />
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                Directory
              </Link>
              <Link to="/docs" className="text-sm font-medium transition-colors hover:text-primary">
                Guide
              </Link>
              <Link to="/submit" className="text-sm font-medium transition-colors hover:text-primary">
                Add Server
              </Link>
            </nav>

            <div className="flex-1 flex items-center justify-end space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <AuthButton />
                <div className="hidden">
                  <ThemeToggle />
                </div>
              </div>

              <MobileNav />
            </div>
          </div>
        </header>
        <main className="container py-6 mb-6 flex-1 max-w-7xl mx-auto">
          <Outlet />
        </main>
        <footer className="border-t py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex items-center justify-between max-w-7xl mx-auto">
            <p className="text-sm text-muted-foreground">
              Built by <a href="https://x.com/andrwhcom" target="_blank" rel="noopener noreferrer" className="underline">@andrwhcom</a> with ❤️
            </p>
            <nav className="flex items-center space-x-4">
              <a
                href="https://github.com/modelcontextprotocol/servers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                GitHub
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
} 