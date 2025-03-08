# MCP Database Population Working List

## Notes
- Empty arrays must be explicitly typed: use `ARRAY[]::varchar[]` instead of just `ARRAY[]`
- All MCPs should have at least one category, SEO alias, and app integration
- Use `gen_random_uuid()` for id generation
- Status should be 'official' for reference implementations, 'community' for community implementations
- All MCPs should have standard app integrations: ["cursor", "windsurf"]

## Progress Tracking

### Phase 1: Database Population ✅
All MCPs have been prepared for database population. See mcp-list.md for current status.

### Phase 2: Setup Guides (Next)
Preparing to add setup guides for all MCPs.

## SQL Template
```sql
INSERT INTO mcps (
  id,
  name,
  company,
  description,
  summary,
  hosting_type,
  status,
  setup_type,
  pricing,
  categories,
  github_url,
  seo_aliases,
  app_integrations,
  created_at,
  last_updated
)
VALUES (
  gen_random_uuid(),
  '[NAME]',
  '[COMPANY]',
  '[DESCRIPTION]',
  '[SUMMARY]',
  '[HOSTING_TYPE]',
  '[STATUS]',
  '[SETUP_TYPE]',
  '[PRICING]',
  ARRAY['category1', 'category2']::varchar[],
  'https://github.com/modelcontextprotocol/servers',
  ARRAY['alias1', 'alias2']::varchar[],
  ARRAY['cursor', 'windsurf']::varchar[],
  NOW(),
  NOW()
);
``` 