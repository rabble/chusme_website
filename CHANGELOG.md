# Changelog

## 1.0.0 (2024-04-30)

### Added
- Initial implementation of invite gateway service
- Cloudflare Worker setup with TypeScript support
- KV namespace integration for storing invite data
- Route configuration for rabble.community domain
- Documentation files (README, deployment guide, implementation plan)
- Mobile app deep linking configuration files

## [Unreleased]

### Added
- Created `INVITE_LINK_SERVICE.md` to document the invite link service, deep linking mechanisms, and API details for Flutter app integration.
- Configured the `chus.me` service (`chus.me/src/index.ts`) to serve `apple-app-site-association` for iOS Universal Links and `assetlinks.json` for Android App Links. Both are served from their respective `/.well-known/` paths with `application/json` content type.
- Added a test invite creation tool at `/create-test-invite/{groupId}/{relay}` that allows generating deep links for testing without requiring KV storage access.

### Fixed
- Ensured `apple-app-site-association` is now correctly served from the `chus.me` domain, enabling Universal Links for `https://chus.me`.
- Fixed the invite link handler to properly check for KV namespace existence before trying to access it, resolving "Cannot read properties of undefined" errors.
- Added detection and improved error messages for malformed invite URLs where clients try to use the full deep link as the invite code.
- Created `PLUR_APP_INVITE_LINK_FIX.md` to document the correct invite URL format and help resolve issues in the Flutter app.

- Refactor invite gateway into separate `chus.me` (shortlinks/invites) and `chusme.social` (landing page) services.
- Update build process (`package.json`, `tsconfig.json`) to handle separate service outputs.
- Configure `wrangler.toml` for Cloudflare Pages deployment.
- Update URLs and branding from `rabble.community` to `chus.me`, `chusme.social`, and `chusme.app`.
yes