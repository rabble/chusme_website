# Rabble Invite Gateway Project Summary

## Architecture & Features

### Core Functionality
1. **Invite Gateway** - A Cloudflare Worker that provides a self-hosted invite system at `rabble.community/i/<code>` with the following features:
   - Multi-use, never-expiring invites
   - Nostr-relay integration
   - Mobile deep-link fallbacks
   - App installation detection and guidance

2. **App Deep Linking** - Universal links (iOS) and App Links (Android) configuration:
   - iOS: Apple App Site Association file
   - Android: Asset Links JSON
   - Landing page with platform detection

3. **Website & Content** - Complete website with multiple pages:
   - Landing page with value proposition
   - About page with team information
   - Design principles & non-negotiables
   - FAQ page answering common questions
   - Roadmap showing future development 
   - Developer documentation
   - Blog with initial post
   - Legal pages (privacy policy, terms of service)

4. **App Proxying** - Transparent proxying of the Plur app:
   - Serves the web app under `/app` path
   - URLRewriting via HTMLRewriter
   - Preserves all functionality of the original app

### Technical Stack
- **Cloudflare Workers** - Edge-based serverless computing
- **TypeScript** - Strongly-typed JavaScript
- **KV Storage** - For storing invite codes and metadata
- **HTMLRewriter** - For modifying HTML responses in the proxy
- **Markdown** - Content authored in Markdown for easy editing

## Development Guide

### Getting Started
1. Clone this repository
2. Run `npm install` to install dependencies
3. Duplicate `wrangler.toml.example` to `wrangler.toml` and update with your credentials
4. Run `npm run dev` to start the local development server

### Architecture
- `src/index.ts` - Main Worker code with all routes and functionality
  - Contains the markdown parser, invite logic, and proxying code
  - Handles API endpoints for invite creation and retrieval
  - Serves static website pages rendered from markdown

- `static/` - Static assets and app-linking configuration files:
  - `.well-known/assetlinks.json` - Android App Links
  - `apple-app-site-association` - iOS Universal Links
  - Various image assets and resources

### Content Management
- Pages are defined in the `PAGES` object in `src/index.ts`
- Each page is authored in Markdown with YAML front matter
- New pages can be added by extending the `PAGES` object
- The navigation menu is updated in the `createPage` function

### Deployment
Follow the steps in DEPLOYMENT.md for:
1. Setting up Cloudflare Workers
2. Creating the required KV namespace
3. Configuring app linking for iOS and Android
4. Setting up DNS records
5. Deploying via Wrangler or GitHub Actions

## Future Enhancements
1. Implement expiring invites option
2. Add analytics for invite usage
3. Create an admin dashboard for invite management
4. Add rate limiting for API endpoints
5. Enhance content management with a headless CMS
6. Implement optimized image serving with Cloudflare Images
7. Add internationalization support