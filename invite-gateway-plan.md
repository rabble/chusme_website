# Invite Gateway Implementation Plan

This document outlines the end-to-end plan for a self-hosted Cloudflare Worker invite gateway at `rabble.community/i/<code>`, supporting multi-use, never-expiring invites, Nostr-relay previews, and mobile deep-link fallbacks.

## 1. Infrastructure & DNS

### 1.1 Domain
- Serve under `rabble.community`.
- Route `rabble.community/i/*` and `/api/invite/*` to a Cloudflare Worker.
- Point CNAME in DNS to Cloudflare via Wrangler setup.

### 1.2 SSL & App-Link Files
- Cloudflare provides HTTPS termination.
- Serve static assets:
  - `/.well-known/assetlinks.json` for Android App Links.
  - `/apple-app-site-association` for iOS Universal Links.

## 2. Data Storage

- Use Cloudflare Worker KV namespace `INVITES`.
- Key: `<8-char-code>`.
- Value: JSON `{ groupId: string, relay: string }`.
- No TTL (invites never expire), multi-use.

## 3. API Endpoints

**Base URL**: `https://rabble.community/api/invite`

### 3.1 POST `/api/invite`
- Auth: `X-Invite-Token` header (Cloudflare secret).
- Body: `{ groupId, relay }`.
- Generate 8-char alphanumeric code.
- Store in KV.
- Return `{ code, url: 'https://rabble.community/i/' + code }`.

### 3.2 GET `/api/invite/:code`
- Retrieve from KV.
- If found, return `{ code, groupId, relay }`.
- Else, 404.

## 4. Preview Page

- Route: GET `/i/:code`.
- Worker retrieves record from KV.
- If not found, return 404 HTML.
- Else, return minimal HTML with inlined `code`, `groupId`, and `relay`.
- Client-side JS:
  - Connect to Nostr relay via WebSocket.
  - Fetch group metadata via NIP-29.
  - Render group name, description, and avatar.
  - Buttons: Open in App, Install App, Continue in Browser.

## 5. Mobile Deep-Linking

### 5.1 iOS Universal Links
- Host `/apple-app-site-association`.
- Enable Associated Domains: `applinks:rabble.community`.

### 5.2 Android App Links
- Host `/.well-known/assetlinks.json`.
- Declare intent filters for `https://rabble.community/i/*`.

## 6. CI/CD & Secrets

- `wrangler.toml` binds:
  - KV namespace `INVITES`.
  - Secret `INVITE_TOKEN`.
  - Route pattern `rabble.community/*`.
- GitHub Actions:
  - On push to `main`, run `wrangler publish --env production`.
  - Store CF API token & account ID as secrets.

## 7. Next Steps

1. Implement the Worker script with API routes and preview handler.
2. Create & bind the KV namespace.
3. Add App-Link JSON files.
4. Test on iOS/Android to verify deep links and preview page. 