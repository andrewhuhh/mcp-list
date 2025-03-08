# MCP Database Population Working List

## Notes
- Empty arrays must be explicitly typed: use `ARRAY[]::varchar[]` instead of just `ARRAY[]`
- All MCPs should have at least one category, SEO alias, and app integration
- Use `gen_random_uuid()` for id generation
- Status should be 'official' for reference implementations, 'community' for community implementations
- All MCPs should have standard app integrations: ["cursor", "windsurf"]

## Progress Tracking

### Completed MCPs (Already in DB)
#### Reference Implementations
- [x] AWS KB Retrieval
- [x] Brave Search
- [x] Browser Tools
- [x] EverArt
- [x] Everything
- [x] Fetch
- [x] Filesystem
- [x] Git
- [x] Redis

### Next Batch (To Be Added)
#### Reference Implementations
- [x] GitHub
  - Categories: ['development', 'version-control', 'collaboration']
  - SEO: ['git', 'version control', 'code hosting']
  - Apps: ['cursor', 'windsurf']
  - Status: official

- [x] Memory
  - Categories: ['storage', 'cache']
  - SEO: ['cache', 'key-value store', 'temporary storage']
  - Apps: ['cursor', 'windsurf']
  - Status: official

- [x] Postgres (Imported)
  - Categories: ['database', 'storage']
  - SEO: ['postgresql', 'sql', 'database']
  - Apps: ['cursor', 'windsurf']
  - Status: official

#### Community Implementations
- [x] Rememberizer AI (Imported)
  - Categories: ['ai', 'knowledge-base']
  - SEO: ['knowledge retrieval', 'ai memory', 'knowledge base']
  - Apps: ['cursor', 'windsurf']
  - Status: community

- [x] Replicate (Imported)
  - Categories: ['ai', 'machine-learning', 'image-generation']
  - SEO: ['ml models', 'ai models', 'predictions']
  - Apps: ['cursor', 'windsurf']
  - Status: community

- [x] Rijksmuseum (Imported)
  - Categories: ['art', 'culture', 'images']
  - SEO: ['art', 'museum', 'collections']
  - Apps: ['cursor', 'windsurf']
  - Status: community

- [~] Salesforce MCP (Ready for Import)
  - Categories: ['crm', 'business', 'sales']
  - SEO: ['crm', 'sales', 'customer management']
  - Apps: ['cursor', 'windsurf']
  - Status: community

- [~] Scholarly (Ready for Import)
  - Categories: ['research', 'academic', 'search']
  - SEO: ['academic', 'research papers', 'scholarly articles']
  - Apps: ['cursor', 'windsurf']
  - Status: community

### Remaining MCPs (To Be Processed)
#### Community Implementations
- [ ] SearXNG
- [ ] Snowflake
- [ ] Spotify
- [ ] Stripe
- [ ] TMDB
- [ ] Tavily Search
- [ ] Ticketmaster
- [ ] Todoist
- [ ] Travel Planner
- [ ] Vega-Lite
- [ ] Video Editor
- [ ] WildFly MCP
- [ ] Windows CLI
- [ ] World Bank Data API
- [ ] X (Twitter) by EnesCinr
- [ ] X (Twitter) by vidhupv
- [ ] XMind
- [ ] YouTube

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