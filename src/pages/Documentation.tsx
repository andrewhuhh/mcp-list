import { CodeBlock } from '../components/blocks/CodeBlock';
import { PlainCodeBlock } from '../components/blocks/PlainCodeBlock';
import { SearchInput } from '../components/ui/search-input';
import { useState, useEffect } from 'react';
import { cn } from "../lib/utils";

type Section = {
  id: string;
  title: string;
  content: JSX.Element;
  searchableText: string;
};

export const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);

  const sections: Section[] = [
    {
      id: 'intro',
      title: 'Introduction',
      searchableText: `Introduction What is MCP? 
        The Model Context Protocol (MCP) is an open standard that enables developers to build secure connections.
        Current State MCP is currently being adopted by major AI tools and IDEs.
        The Future of MCP Enhanced security features Enterprise deployments SDK support
        Resources Tools Prompts File-like data Functions Pre-written templates`,
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">What is MCP?</h3>
            <p className="text-muted-foreground mb-6">
              The Model Context Protocol (MCP) is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. It provides a universal way to connect AI assistants to systems where data lives, including content repositories, business tools, and development environments.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Current State</h3>
            <p className="text-muted-foreground mb-6">
              MCP is currently being adopted by major AI tools and IDEs, including Claude for Desktop, Cursor, and other development environments. The protocol supports multiple transport methods (stdio, SSE) and can be implemented in Python, TypeScript, Java, and Kotlin.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h4 className="font-semibold mb-2 text-foreground">Resources</h4>
                <p className="text-sm text-muted-foreground">File-like data that can be read by clients (API responses, file contents)</p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h4 className="font-semibold mb-2 text-foreground">Tools</h4>
                <p className="text-sm text-muted-foreground">Functions that can be called by the LLM (with user approval)</p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h4 className="font-semibold mb-2 text-foreground">Prompts</h4>
                <p className="text-sm text-muted-foreground">Pre-written templates that help users accomplish specific tasks</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">The Future of MCP</h3>
            <p className="text-muted-foreground mb-6">
              As AI assistants continue to evolve, MCP aims to become the universal standard for AI-tool communication. Future developments include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Enhanced security features for enterprise deployments</li>
              <li>Expanded SDK support for more programming languages</li>
              <li>Improved tooling for debugging and monitoring</li>
              <li>Standardized patterns for common AI interactions</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'ide-integration',
      title: 'IDE Integration',
      searchableText: `IDE Integration Cursor Integration
        Configure MCP Server Cursor Settings Features MCP
        Project-Specific Configuration cursor mcp.json
        Using MCP Tools Composer Agent
        Other IDEs development environments`,
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Cursor Integration</h3>
            <p className="text-muted-foreground mb-6">
              Cursor provides native support for MCP through its Composer feature. Here's how to set it up:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium mb-2 text-foreground">1. Configure MCP Server</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your MCP server configuration in Cursor Settings &gt; Features &gt; MCP
                </p>
                <CodeBlock
                  code={`{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["path/to/server.js"]
    }
  }
}`}
                  language="json"
                  className="mb-4"
                />
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2 text-foreground">2. Project-Specific Configuration</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a .cursor/mcp.json file in your project root:
                </p>
                <CodeBlock
                  code={`{
  "mcpServers": {
    "project-server": {
      "url": "http://localhost:3000/sse"
    }
  }
}`}
                  language="json"
                  className="mb-4"
                />
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2 text-foreground">3. Using MCP Tools</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  The Composer Agent will automatically use available MCP tools when relevant. You can also explicitly request tool usage in your prompts.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Other IDEs</h3>
            <p className="text-muted-foreground mb-6">
              MCP support is expanding to other IDEs and development environments. Check your IDE's documentation for specific integration instructions.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'build-your-own',
      title: 'Build Your Own',
      searchableText: `Build Your Own Quick Start
        Install Dependencies uv init mcp-server
        Create Your First MCP Server FastMCP
        Core Components MCP Server
        Python TypeScript Java Kotlin
        Tools Functions API Endpoints`,
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Quick Start</h3>
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4 text-foreground">1. Install Dependencies</h4>
              <PlainCodeBlock
                code={`curl -LsSf https://astral.sh/uv/install.sh | sh
uv init my-mcp-server
cd my-mcp-server
uv venv
source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate
uv add "mcp[cli]" httpx`}
                className="mb-4"
              />
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4 text-foreground">2. Create Your First MCP Server</h4>
              <CodeBlock
                code={`from typing import Any
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("my-server")

@mcp.tool()
async def hello_world() -> str:
    """A simple greeting tool."""
    return "Hello from MCP!"

if __name__ == "__main__":
    mcp.run(transport='stdio')`}
                language="python"
                className="mb-4"
              />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Core Components</h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium mb-4 text-foreground">MCP Server</h4>
                <p className="text-muted-foreground mb-4">
                  MCP servers expose data and functionality to AI models through a standardized interface. They can be built using official SDKs in Python, TypeScript, Java, and Kotlin.
                </p>
                <CodeBlock
                  code={`@mcp.tool()
async def get_data(query: str) -> dict:
    """Fetch data based on the query."""
    return await database.fetch(query)`}
                  language="python"
                  className="mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSections(sections);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = sections.filter(section => 
        section.title.toLowerCase().includes(query) ||
        section.searchableText.toLowerCase().includes(query)
      );
      setFilteredSections(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen rounded-lg">
      {/* Hero Section */}
      <div className="pt-16 pb-8 rounded-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Model Context Protocol (MCP)</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The universal standard for connecting AI systems with data sources, replacing fragmented integrations with a single protocol.
          </p>
          <SearchInput 
            placeholder="Search documentation..."
            onSearch={setSearchQuery}
            className="max-w-xl"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-6 pb-12 rounded-lg bg-card">
        {/* Navigation */}
        <nav className="mb-12 border-b border-border">
          <div className="flex space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "pb-4 text-sm font-medium transition-colors hover:text-foreground",
                  activeSection === section.id
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="space-y-8">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            searchQuery ? (
              filteredSections.map((section) => (
                <section key={section.id} className="mb-16">
                  <h2 className="text-3xl font-bold mb-6 text-foreground">{section.title}</h2>
                  {section.content}
                </section>
              ))
            ) : (
              sections.find(s => s.id === activeSection)?.content
            )
          )}
        </div>

        {/* Resources Section */}
        <section className="mt-16 pt-16 border-t border-border">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="https://github.com/modelcontextprotocol" 
               className="p-6 rounded-lg border border-border hover:border-primary transition-colors">
              <h3 className="font-semibold mb-2 text-foreground">GitHub</h3>
              <p className="text-sm text-muted-foreground">Access the official MCP repositories and examples</p>
            </a>
            <a href="https://modelcontextprotocol.io" 
               className="p-6 rounded-lg border border-border hover:border-primary transition-colors">
              <h3 className="font-semibold mb-2 text-foreground">Documentation</h3>
              <p className="text-sm text-muted-foreground">Read the complete MCP documentation</p>
            </a>
            <a href="https://discord.gg/anthropic" 
               className="p-6 rounded-lg border border-border hover:border-primary transition-colors">
              <h3 className="font-semibold mb-2 text-foreground">Community</h3>
              <p className="text-sm text-muted-foreground">Join the MCP developer community</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}; 