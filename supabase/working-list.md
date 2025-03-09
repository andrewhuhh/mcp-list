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

## MCP Setup Guide Batches

### Batch 1 (Reference Implementations)
1. AWS KB Retrieval MCP
2. Brave Search MCP
3. Browser Tools
4. EverArt MCP
5. Everything MCP
6. Fetch MCP
7. Filesystem MCP
8. Git MCP
9. GitHub
10. Memory
11. Postgres
12. Redis MCP
13. Rememberizer AI
14. Replicate
15. Rijksmuseum

### Batch 2
1. Salesforce MCP
2. Scholarly
3. SearXNG
4. Snowflake
5. Spotify
6. Stripe
7. TMDB
8. Tavily Search
9. Ticketmaster
10. Todoist
11. Travel Planner
12. Vega-Lite
13. Video Editor
14. WildFly MCP
15. Windows CLI

### Batch 3
1. World Bank Data API
2. XMind
3. X (Twitter) by EnesCinr
4. X (Twitter) by vidhupv
5. YouTube

## Setup Guide Implementations

### Batch 1 Template - AWS KB Retrieval
```