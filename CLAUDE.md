# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project
Invite Gateway - A Cloudflare Worker service for creating and managing invite links.

## Build/Run Commands
- `npm install` - Install dependencies
- `npx wrangler dev` - Run local development server
- `npx wrangler publish` - Deploy to Cloudflare
- `npx tsc --noEmit` - Type checking

## Code Style Guidelines
- **TypeScript**: Use strict typing with explicit interfaces
- **Formatting**: 2 space indentation, single quotes
- **Imports**: Group imports by type (built-in, external, internal)
- **Error Handling**: Use try/catch blocks with typed error responses
- **Naming**: camelCase for variables/functions, PascalCase for interfaces/types
- **API Responses**: Consistent JSON format with proper status codes
- **Security**: Always validate request inputs and use proper authentication
- **KV Operations**: Handle async KV operations with proper error handling