# Rabble Community Gateway Project Checklist

## 1. Infrastructure & DNS
- [x] Configure DNS CNAME for `rabble.community` to Cloudflare via Wrangler.
- [x] Set up Cloudflare Worker route for `rabble.community/i/*` and `/api/invite/*`.
- [x] Add SSL and enable HTTPS.

## 2. App-Link Configuration
- [x] Create and deploy `/.well-known/assetlinks.json` for Android App Links.
- [x] Create and deploy `/apple-app-site-association` for iOS Universal Links.
- [x] Create guide for enabling Associated Domains in iOS Xcode.
- [x] Create guide for adding intent filters in AndroidManifest.xml.

## 3. Data Storage (KV)
- [x] Create guide for KV namespace `INVITES` in Cloudflare.
- [x] Bind KV namespace in `wrangler.toml`.

## 4. API Endpoints Implementation
- [x] POST `/api/invite` endpoint.
- [x] GET `/api/invite/:code` endpoint.
- [x] Add authentication using `X-Invite-Token` header.

## 5. Preview Page
- [x] Implement Worker route `/i/:code`.
- [x] Return 404 HTML for missing invites.
- [x] Return minimal HTML with inlined `code`, `groupId`, `relay`.
- [x] Client-side JS to fetch Nostr group metadata.
- [x] Buttons: Open in App, Install App, Continue in Browser.

## 6. Mobile Deep Linking
- [x] Create guide for iOS Universal Links setup.
- [x] Create guide for Android App Links setup.
- [x] Document testing process for deep links.

## 7. CI/CD & Secrets
- [x] Create guide for configuring `INVITE_TOKEN` secret in Wrangler.
- [x] Set up GitHub Actions to run `wrangler publish` on `main`.
- [x] Document process for adding CF API token and account ID as GitHub secrets.

## 8. Testing & QA
- [x] Create testing scripts for `POST /api/invite` with valid and invalid tokens.
- [x] Create testing scripts for `GET /api/invite/:code` for existing and non-existing codes.
- [x] Document testing for preview page rendering & metadata fetch.
- [x] Document testing for deep-link flows on iOS and Android.
- [x] Document testing for "Install App" deferred deep link.
- [x] Document testing for cross-browser fallback.

## 9. Analytics & Monitoring (Future)
- [ ] Integrate click and redeem event tracking.
- [ ] Hook into analytics platform (Segment, Amplitude).

## 10. Website Implementation
- [x] Create marketing landing page
- [x] Add About page with team information
- [x] Add Design Principles & Non-Negotiables page
- [x] Add FAQ page with common questions
- [x] Add Roadmap page showing future plans
- [x] Add Developer documentation page
- [x] Create Blog index and post pages
- [x] Add legal pages (Privacy Policy, Terms of Service)

## 11. App Proxying
- [x] Proxy web app from plur-app to `/app` path
- [x] Use HTMLRewriter to rewrite links
- [x] Ensure proper handling of different content types
- [x] Add invite parameter passing

## 12. Documentation
- [x] Document API endpoints and usage.
- [x] Add README for setup and deployment.
- [x] Create setup guides for all components.
- [x] Create testing documentation.
- [x] Add content management documentation
- [x] Update project summary with all features

---
**Progress Legend:** `- [ ]`: Pending, `- [x]`: Done 