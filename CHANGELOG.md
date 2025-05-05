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

- Refactor invite gateway into separate `chus.me` (shortlinks/invites) and `chusme.social` (landing page) services.
- Update build process (`package.json`, `tsconfig.json`) to handle separate service outputs.
- Configure `wrangler.toml` for Cloudflare Pages deployment.
- Update URLs and branding from `rabble.community` to `chus.me`, `chusme.social`, and `chusme.app`.
