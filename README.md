# Rabble Community Gateway

A Cloudflare Worker service that functions as both an invite gateway and website for Rabble Community.

## Features

### Invite Gateway
- Create multi-use, never-expiring invite codes
- Preview page with group metadata from Nostr relay
- Mobile deep-linking support (iOS Universal Links and Android App Links)
- Web fallback for users without the app

### Website
- Content-rich landing page
- About page with team information
- Design principles & non-negotiables
- FAQ, roadmap, and developer documentation
- Blog with dedicated posts
- Legal pages (privacy policy, terms of service)

### App Integration
- Proxies plur-app at `/app` path
- Transparent URL rewriting
- Deep linking support

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure Cloudflare
   - Create a KV namespace named `INVITES`
   - Update `wrangler.toml` with your account ID, zone ID, and KV namespace ID
   - Set the `INVITE_TOKEN` secret: `npx wrangler secret put INVITE_TOKEN`

3. Configure DNS
   - Point `hol.is` to Cloudflare

4. Configure App-Linking
   - In iOS app: Enable Associated Domains with `applinks:hol.is`
   - In Android app: Add intent filters for `https://hol.is/i/*`
   - Update values in the code:
     - Replace `YOUR_APP_FINGERPRINT_HERE` in assetlinks.json
     - Replace `YOUR_TEAM_ID` in apple-app-site-association
     - Replace `YOUR_APP_ID` in the install-app link

## Development

```bash
# Run local development server
npm run dev

# This starts a local server at http://localhost:8787
# Changes to the code will be automatically detected and refreshed

# Type check
npm run typecheck

# Deploy to Cloudflare
npm run deploy
```

### Local Development Tips

1. The local development server runs at `http://localhost:8787` by default
2. Any changes to the code are automatically detected and the server reloads
3. The local server simulates the KV namespace with an in-memory store
4. For faster iteration on styles and UI, you can:
   - Edit the CSS in `src/index.ts` within the `<style>` tags
   - Update the markdown content in the `PAGES` object
   - Make changes in small batches to see results quickly

5. To test specific pages, visit:
   - Landing page: `http://localhost:8787/`
   - Design principles: `http://localhost:8787/design-principles`
   - About page: `http://localhost:8787/about`
   - And other paths defined in the `PAGES` object

## Content Management

The website content is stored in the `PAGES` object in `src/index.ts` as markdown. To add or modify content:

1. Edit the markdown in the appropriate section of the `PAGES` object
2. Use YAML frontmatter for title, description, and image
3. Use markdown formatting (headings, lists, tables, quotes)
4. To add a new page:
   - Add a new entry to the `PAGES` object with the path as the key
   - Update the navigation menu in the `createPage` function

### Markdown Features

- Headers: `# Heading 1`, `## Heading 2`, `### Heading 3`
- Emphasis: `*italic*`, `**bold**`
- Lists: `- Item 1`, `- Item 2`
- Links: `[Link text](URL)` or `[Link text](URL){.button-class}`
- Tables: `| Header | Header |` format
- Quotes: `> Quote text` or `:::quote\nQuote text\n:::`
- Code: `` `inline code` `` or ` ```language\ncode block\n``` `
- Horizontal rule: `---`
- Details/summary: `<details><summary>Title</summary>Content</details>`

## API Reference

### Create Standard Invite
- **POST** `/api/invite`
- **Header:** `X-Invite-Token: [secret-token]`
- **Body:** `{ "groupId": "string", "relay": "string" }`
- **Response:** `{ "code": "string", "url": "string" }`

### Create Web Invite
- **POST** `/api/invite/web`
- **Header:** `X-Invite-Token: [secret-token]`
- **Body:** `{ "groupId": "string", "relay": "string", "name": "string", "description": "string", "avatar": "string", "creatorPubkey": "string" }`
- **Response:** `{ "code": "string", "url": "string" }`

### Create Short URL
- **POST** `/api/invite/short`
- **Header:** `X-Invite-Token: [secret-token]`
- **Body:** `{ "code": "string" }`
- **Response:** `{ "shortCode": "string", "url": "string" }`

### Get Standard Invite
- **GET** `/api/invite/:code`
- **Response:** `{ "code": "string", "groupId": "string", "relay": "string" }`

### Get Web Invite
- **GET** `/api/invite/web/:code`
- **Response:** `{ "code": "string", "groupId": "string", "relay": "string", "name": "string", "description": "string", "avatar": "string", "createdAt": number, "creatorPubkey": "string" }`

### Get Short URL
- **GET** `/api/invite/short/:shortCode`
- **Response:** `{ "code": "string" }`

### Preview Pages
- **URL:** `/i/:code` - Standard invite preview
- **URL:** `/join/:code` - Web invite preview with rich metadata
- **URL:** `/j/:shortCode` - Short URL that redirects to full invite

All pages show relevant group info and provide options: Open in App, Install App, Continue in Browser