import { Link, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/themes/ThemeToggle';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-[0.03] dark:opacity-[0.07]"
          style={{ transform: 'scale(1.5)' }}
        />
        <svg
          className="absolute h-full w-full opacity-[0.03] dark:opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
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
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      <header className="sticky top-0 z-50 py-3 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between max-w-4xl mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-mono font-bold">MCP List</span>
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link to="/docs" className="text-sm font-medium transition-colors hover:text-primary">
                Guide
              </Link>
              <Link to="/submit" className="text-sm font-medium transition-colors hover:text-primary">
                Publish
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-6 mb-6 flex-1 max-w-7xl mx-auto">
        <Outlet />
      </main>
      <footer className="border-t py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            Built by the community, for the community.
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
  );
} 