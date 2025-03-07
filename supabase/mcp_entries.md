# MCP Database Entries

## Database Constraints
```
MCPs Table:
- setup_type: 'Easy-Setup' | 'Flexible-Config' | 'For-Developers'
- status: 'Official' | 'Community'
- hosting_type: 'Self-Hosted' | 'Cloud-Hosted'
- pricing: string (commonly: 'Free', 'Paid, Enterprise')
- required fields: name, description, hosting_type, status, setup_type, pricing, categories, github_url
- logo_url: if not provided, defaults to 'https://jnwmsqfwximvrcjmylsy.supabase.co/storage/v1/object/public/logos//mcp-logo.png'

Features Table:
- Required: mcp_id (references mcps.id), title, description
```

## Template
```sql
-- Template for new MCP entry
WITH mcp_entry AS (
  INSERT INTO mcps (
    name,
    company,
    description,
    hosting_type,
    status,
    setup_type,
    pricing,
    categories,
    github_url,
    logo_url
  ) VALUES (
    '[Name]',
    '[Company]',
    '[Description]',
    '[self-hosted/cloud-hosted]',
    '[official/community]',
    '[easy-setup/flexible-config/for-developers]',
    '[Free/Paid/Enterprise]',
    ARRAY['category1', 'category2'],
    'github_url',
    'https://jnwmsqfwximvrcjmylsy.supabase.co/storage/v1/object/public/logos//mcp-logo.png'  -- Default MCP logo
  ) RETURNING id
)
INSERT INTO features (mcp_id, title, description)
SELECT 
  mcp_entry.id,
  f.title,
  f.description
FROM mcp_entry,
(VALUES 
  ('Feature 1', 'Description 1'),
  ('Feature 2', 'Description 2')
) AS f(title, description);
```

## Batch 1 - Core Developer Tools

### Git MCP
```sql
WITH mcp_entry AS (
  INSERT INTO mcps (
    name,
    company,
    description,
    hosting_type,
    status,
    setup_type,
    pricing,
    categories,
    github_url,
    logo_url
  ) VALUES (
    'Git MCP',
    'Model Context Protocol',
    'A comprehensive MCP server that provides tools to read, search, and manipulate Git repositories. Enables AI to interact with version control systems directly, supporting common Git operations and repository analysis.',
    'self-hosted',
    'official',
    'for-developers',
    'Free',
    ARRAY['development', 'version-control', 'git'],
    'https://github.com/modelcontextprotocol/servers/tree/main/src/git',
    'https://jnwmsqfwximvrcjmylsy.supabase.co/storage/v1/object/public/logos/git.jpeg'
  ) RETURNING id
)
INSERT INTO features (mcp_id, title, description)
SELECT 
  mcp_entry.id,
  f.title,
  f.description
FROM mcp_entry,
(VALUES 
  ('Repository Operations', 'Perform common Git operations like clone, pull, push, and branch management'),
  ('Code Search', 'Search through repository content with advanced filtering and pattern matching'),
  ('Commit History', 'Access and analyze commit history, diffs, and changes over time'),
  ('Branch Management', 'Create, delete, and switch between branches with proper access controls'),
  ('Repository Analysis', 'Generate insights about repository structure, contributors, and code patterns')
) AS f(title, description);
```

### Filesystem MCP
```sql
WITH mcp_entry AS (
  INSERT INTO mcps (
    name,
    company,
    description,
    hosting_type,
    status,
    setup_type,
    pricing,
    categories,
    github_url,
    logo_url
  ) VALUES (
    'Filesystem MCP',
    'Model Context Protocol',
    'Secure file operations server with configurable access controls. Enables AI to safely interact with local files and directories while maintaining strict security boundaries and permissions.',
    'self-hosted',
    'official',
    'flexible-config',
    'Free',
    ARRAY['development', 'filesystem', 'security'],
    'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    'https://jnwmsqfwximvrcjmylsy.supabase.co/storage/v1/object/public/logos/filesystem.jpeg'
  ) RETURNING id
)
INSERT INTO features (mcp_id, title, description)
SELECT 
  mcp_entry.id,
  f.title,
  f.description
FROM mcp_entry,
(VALUES 
  ('Secure File Access', 'Configurable access controls and permissions for file operations'),
  ('File Operations', 'Read, write, and modify files with proper validation and safety checks'),
  ('Directory Management', 'List, create, and navigate directories within allowed paths'),
  ('Path Validation', 'Strict path validation to prevent unauthorized access outside allowed directories'),
  ('File Monitoring', 'Watch for file changes and modifications in specified directories')
) AS f(title, description);
```

### Redis MCP
```sql
WITH mcp_entry AS (
  INSERT INTO mcps (
    name,
    company,
    description,
    hosting_type,
    status,
    setup_type,
    pricing,
    categories,
    github_url,
    logo_url
  ) VALUES (
    'Redis MCP',
    'Model Context Protocol',
    'Redis database operations and caching microservice server with support for key-value operations, expiration management, and pattern-based key listing. Compatible with Redis Server and AWS MemoryDB.',
    'self-hosted',
    'official',
    'for-developers',
    'Free',
    ARRAY['database', 'caching', 'redis'],
    'https://github.com/modelcontextprotocol/servers/tree/main/src/redis',
    'https://jnwmsqfwximvrcjmylsy.supabase.co/storage/v1/object/public/logos/redis.jpeg'
  ) RETURNING id
)
INSERT INTO features (mcp_id, title, description)
SELECT 
  mcp_entry.id,
  f.title,
  f.description
FROM mcp_entry,
(VALUES 
  ('Key-Value Operations', 'Basic Redis operations for storing and retrieving data'),
  ('Expiration Management', 'Set and manage TTL for cached items'),
  ('Pattern Matching', 'Search keys using Redis pattern matching syntax'),
  ('Data Types Support', 'Handle various Redis data types including strings, lists, sets, and hashes'),
  ('Connection Management', 'Secure connection handling with Redis instances and clusters')
) AS f(title, description);
```

## Next Steps
The next batch will focus on AI and Search tools, including:
- Brave Search MCP
- EverArt MCP
- Replicate MCP
- Tavily Search MCP

Would you like me to continue with those entries? 