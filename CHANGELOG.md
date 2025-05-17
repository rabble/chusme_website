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
- Configured the `hol.is` service (`hol.is/src/index.ts`) to serve `apple-app-site-association` for iOS Universal Links and `assetlinks.json` for Android App Links. Both are served from their respective `/.well-known/` paths with `application/json` content type.
- Added a test invite creation tool at `/create-test-invite/{groupId}/{relay}` that allows generating deep links for testing without requiring KV storage access.
- Created `CLOUDFLARE_GUIDELINES.md` with comprehensive best practices for Cloudflare Workers development based on official recommendations.
- Added a "Common Deployment Issues" section to `CLOUDFLARE_GUIDELINES.md` focusing on KV binding issues with Pages deployments.
- Created `FIX_KV_BINDING.md` detailing how to resolve the INVITES KV namespace binding issue in Cloudflare Pages.
- Created `VERIFY_KV_FIX.md` with step-by-step instructions to verify that the KV binding fix is working properly.
- Added iOS TestFlight link to the use-Holis page for beta app access.
- Improved static asset handling with proper CDN integration.
- Added logo to the site header for improved branding.
- Added privacy policy page with comprehensive data practices information.

### Fixed
- Ensured `apple-app-site-association` is now correctly served from the `hol.is` domain, enabling Universal Links for `https://hol.is`.
- Fixed the invite link handler to properly check for KV namespace existence before trying to access it, resolving "Cannot read properties of undefined" errors.
- Added detection and improved error messages for malformed invite URLs where clients try to use the full deep link as the invite code.
- Created `PLUR_APP_INVITE_LINK_FIX.md` to document the correct invite URL format and help resolve issues in the Flutter app.
- Documented a solution for the "KV namespace INVITES is not configured" error affecting invite links like `https://hol.is/i/ZHA65MN2`.
- Fixed image loading by implementing proper CDN URL redirection for all static assets.
- Removed non-functional Windows download link from the use-Holis page.
- Updated build process to correctly include static assets in deployment.

### Changed
- Refactor invite gateway into separate `hol.is` (shortlinks/invites) and `Holis.social` (landing page) services.
- Update build process (`package.json`, `tsconfig.json`) to handle separate service outputs.
- Configure `wrangler.toml` for Cloudflare Pages deployment.
- Update URLs and branding from `rabble.community` to `hol.is`, `Holis.social`, and `Holis.app`.
- Improved image handling to use CDN URLs (https://files.Holis.social/assets/) for better performance.
- Updated all references from "holis.app" to "Holis.app" for consistent branding.
- Rebranded from "Holis" to "Holis" across the entire codebase.
- Updated all app URLs from "Holis.app" to "app.holis.social" for consistent branding.