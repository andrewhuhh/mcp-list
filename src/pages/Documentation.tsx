import { CodeBlock } from '../components/blocks/CodeBlock';

export const Documentation = () => {
  return (
    <div className="h-full mt-8 max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 mt-8 text-foreground">A Guide to the Model Context Protocol</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">What is MCP?</h2>
        <p className="mb-4 text-muted-foreground">
          The Model Context Protocol (MCP) is a standardized way for applications to communicate with AI models.
          It enables real-time context sharing between your application and AI models, allowing for more intelligent
          and context-aware AI interactions. MCP provides a structured format for defining model behaviors, limitations,
          and interaction patterns.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Key Components</h2>
        <ul className="space-y-4 text-muted-foreground">
          <li className="flex gap-2">
            <strong className="text-foreground">Context Definition:</strong>
            <span>Structured format for defining model context</span>
          </li>
          <li className="flex gap-2">
            <strong className="text-foreground">Capability Description:</strong>
            <span>Clear specification of model abilities and limitations</span>
          </li>
          <li className="flex gap-2">
            <strong className="text-foreground">Interaction Patterns:</strong>
            <span>Standardized ways for models to communicate their state</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Context Types</h2>
        <ul className="space-y-4 text-muted-foreground">
          <li className="flex gap-2">
            <strong className="text-foreground">Code Context:</strong>
            <span>Share code snippets and files with AI models</span>
          </li>
          <li className="flex gap-2">
            <strong className="text-foreground">Runtime Context:</strong>
            <span>Share runtime information and variables from your application</span>
          </li>
          <li className="flex gap-2">
            <strong className="text-foreground">System Context:</strong>
            <span>Share system and environment information</span>
          </li>
          <li className="flex gap-2">
            <strong className="text-foreground">Custom Context:</strong>
            <span>Define your own context types for specific use cases</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Quick Implementation</h2>
        <p className="text-muted-foreground mb-4">
          Here's a basic example of how to implement MCP in your application:
        </p>
        <CodeBlock
          code={`import { MCPClient } from '@cursor/mcp-client';

const client = new MCPClient({
  endpoint: 'your-mcp-endpoint',
  apiKey: 'your-api-key'
});

// Send context to the model
await client.sendContext({
  type: 'code',
  content: 'your code here',
  language: 'javascript'
});`}
          language="typescript"
          className="mb-4"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Benefits</h2>
        <ul className="space-y-4 text-muted-foreground">
          <li className="flex gap-2">
            <strong className="text-foreground">Enhanced AI Understanding:</strong>
            <span>Provide rich context for better AI responses</span>
          </li>
          <li className="flex gap-2">
            <strong className="text-foreground">Real-time Updates:</strong>
            <span>Keep AI models informed about changes in your application</span>
          </li>
          <li className="flex gap-2">
            <strong className="text-foreground">Standardization:</strong>
            <span>Use a common protocol across different AI models and applications</span>
          </li>
          <li className="flex gap-2">
            <strong className="text-foreground">Flexibility:</strong>
            <span>Extend the protocol to suit your specific needs</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Implementation Guide</h2>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <p className="font-mono text-sm text-muted-foreground">
            For detailed implementation guidelines, visit the official
            <a href="https://github.com/modelcontextprotocol/servers" 
               className="text-primary hover:underline ml-1" 
               target="_blank" 
               rel="noopener noreferrer">
              MCP GitHub repository
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}; 