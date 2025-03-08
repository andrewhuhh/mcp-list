import { Link, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/themes/ThemeToggle';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
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
      <footer className="border-t py-6">
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