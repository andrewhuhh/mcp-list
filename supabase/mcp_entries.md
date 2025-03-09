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