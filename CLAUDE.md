# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project
Invite Gateway - A Cloudflare Worker service for creating and managing invite links.

## Project Structure
- **hol.is**: Invite link service deployed as a Cloudflare Worker
- **holis.social**: Marketing site deployed as a Cloudflare Pages site

## Build/Run Commands
- `npm install` - Install dependencies
- `npm run dev:holis` - Run hol.is invite service locally
- `npm run dev:social` - Run holis.social site locally
- `npm run build` - Build both services
- `npm run deploy:holis` - Deploy hol.is service
- `npm run deploy:social` - Deploy holis.social site
- `npx tsc --noEmit` - Type checking

## Wrangler 4.x Commands (ALWAYS USE THESE - OLDER COMMANDS ARE DEPRECATED)

### General Commands
- `npx wrangler deploy <script>` - Deploy a script to Cloudflare Workers
- `npx wrangler dev <script>` - Start local development server
- `npx wrangler deployments` - List deployments
- `npx wrangler delete <script>` - Delete a worker
- `npx wrangler tail <worker>` - View real-time logs

### Domain/Custom Domain Management
- `npx wrangler deployments` - View deployment and domain details

### KV Management
- `npx wrangler kv:namespace create <NAME>` - Create new KV namespace
- `npx wrangler kv:namespace list` - List KV namespaces
- `npx wrangler kv:key get <KEY> --namespace-id=<NAMESPACE_ID>` - Get KV value
- `npx wrangler kv:key put <KEY> <VALUE> --namespace-id=<NAMESPACE_ID>` - Set KV value
- `npx wrangler kv:key delete <KEY> --namespace-id=<NAMESPACE_ID>` - Delete KV value
- `npx wrangler kv:key list --namespace-id=<NAMESPACE_ID>` - List KV keys

### Pages Commands
- `npx wrangler pages deploy <DIRECTORY>` - Deploy to Cloudflare Pages
- `npx wrangler pages project list` - List Pages projects

### Environment Variable Management
- `npx wrangler secret put <NAME>` - Store a secret variable
- `npx wrangler secret list` - List secret variables
- `npx wrangler secret delete <NAME>` - Delete a secret variable

### Configuration Notes
- Always use `.env` files for development, not production secrets
- Use the `--env` flag to specify environment (e.g., `--env production`)
- The wrangler.toml file contains separate configurations for hol.is and holis.social

## Code Style Guidelines
- **TypeScript**: Use strict typing with explicit interfaces
- **Formatting**: 2 space indentation, single quotes
- **Imports**: Group imports by type (built-in, external, internal)
- **Error Handling**: Use try/catch blocks with typed error responses
- **Naming**: camelCase for variables/functions, PascalCase for interfaces/types
- **API Responses**: Consistent JSON format with proper status codes
- **Security**: Always validate request inputs and use proper authentication
- **KV Operations**: Handle async KV operations with proper error handling