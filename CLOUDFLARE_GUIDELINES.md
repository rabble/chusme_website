# Cloudflare Development Guidelines

This document outlines best practices and guidelines for working with Cloudflare services in the chus.me project, based on official Cloudflare recommendations.

## Workers Code Style

- Write code in **TypeScript** by default (JavaScript only when specifically requested)
- Use **ES modules format exclusively** (never use Service Worker format)
- Add appropriate TypeScript types and interfaces
- Import all methods, classes, and types used in the code
- Keep all code in a single file unless otherwise specified
- Use official SDKs/libraries when available
- Minimize external dependencies
- Follow consistent formatting with standard TypeScript/JavaScript conventions

## Security Best Practices

- Never embed secrets directly in code
- Implement proper request validation
- Use appropriate security headers
- Handle CORS correctly when needed
- Implement rate limiting where appropriate
- Follow least privilege principle for bindings
- Sanitize user inputs

## Error Handling

- Implement proper error boundaries
- Return appropriate HTTP status codes
- Provide meaningful error messages
- Log errors appropriately
- Handle edge cases gracefully

## Performance Optimization

- Optimize for cold starts
- Minimize unnecessary computation
- Use appropriate caching strategies
- Consider Workers limits and quotas
- Implement streaming where beneficial

## Data Storage Integration

When data storage is needed, integrate with appropriate Cloudflare services:

- **Workers KV**: For key-value storage, configuration data, user profiles
  - Currently used for our invite code storage (`INVITES` namespace)
- **Durable Objects**: For strongly consistent state management and storage
- **D1**: For relational data and SQL queries
- **R2**: For object storage (images, structured data, user uploads)
- **Hyperdrive**: To connect to existing PostgreSQL databases
- **Queues**: For asynchronous processing and background tasks
- **Vectorize**: For storing embeddings and vector search
- **Workers Analytics Engine**: For tracking events, metrics, analytics
- **Workers AI**: For AI inference requests

## Wrangler Configuration

Always use `wrangler.jsonc` (not `wrangler.toml`) with the following:

```jsonc
{
  "name": "app-name-goes-here", 
  "main": "src/index.ts",
  "compatibility_date": "2025-03-07",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  }
}
```

For bindings, ensure they're correctly specified and only include those actually used in the code.

## WebSocket Handling (if needed)

When using WebSockets with Durable Objects:
- Use the Durable Objects WebSocket Hibernation API
- Use `this.ctx.acceptWebSocket(server)` instead of legacy `server.accept()`
- Define `async webSocketMessage()` and `async webSocketClose()` handlers
- Handle WebSocket upgrade requests explicitly, including validating the Upgrade header

## KV Namespace Best Practices

- **Binding Naming**: Use descriptive binding names (e.g., `INVITES` for invite codes)
- **Error Handling**: Always check if KV namespace exists before trying to access it
- **Fallbacks**: Implement graceful fallbacks when KV is unavailable
- **Testing Tools**: Create testing tools that don't rely on KV for development

## Pages Deployments

When deploying to Cloudflare Pages:
- Ensure KV namespace bindings are properly configured in Pages dashboard
- Verify that environment variables are correctly set
- Check for binding issues after deployment

## Commands Reference

### Development

```bash
# Local development with KV enabled
wrangler dev chus.me/src/index.ts --kv INVITES --port 8788
```

### Build and Deploy

```bash
# Build the project
npm run build

# Deploy chus.me to Cloudflare Pages
wrangler pages deploy dist_final/chus.me --project-name=chus-me
```

### KV Management

```bash
# List KV namespaces
wrangler kv namespace list

# Add a KV binding to a Pages project (from dashboard)
# Binding name: INVITES
# KV namespace: invite-gateway-INVITES (ID: 57a39408dd6e4fbc91ae423b82293f43)
```

## Testing

Always provide and document testing methods:
- Include curl commands for API endpoints
- Add example environment variable values 
- Include sample requests and responses
- Implement fallbacks for testing without dependencies (like our `/create-test-invite/` endpoint) 