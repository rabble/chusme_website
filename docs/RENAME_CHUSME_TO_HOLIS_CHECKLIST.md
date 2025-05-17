# Rename Checklist: Holis to Holis

This document outlines all tasks required to rename the app from Holis to Holis and update the domains from chus.me/Holis.social to hol.is/holis.social.

## Domain Updates

- [x] Update invite link service domain from `chus.me` to `hol.is`
- [x] Update marketing site domain from `Holis.social` to `holis.social`
- [ ] Update Cloudflare configuration for new domains (outside scope of this task)

## Code Updates

### Configuration Files
- [x] Update wrangler.toml with new domain configurations
- [x] Update any package.json references to the domains

### Invite Link Service (chus.me → hol.is)
- [x] Update domain references in index.ts
- [x] Update domain references in invite-handler.ts
- [ ] Update any tests that reference the domain

### Marketing Site (Holis.social → holis.social)
- [x] Update site content with new app name "Holis"
- [x] Update any hardcoded URLs that reference the old domains
- [x] Update OpenGraph and metadata with new domains

## Documentation
- [x] Update README.md with new domain and app name
- [x] Update CLAUDE.md with new domain and app name
- [x] Update any tutorial documents with new names
- [x] Update deployment instructions with new domain info

## Testing
- [x] Test local builds with new domain names
- [ ] Verify invite link functionality works with new domain
- [ ] Check all site links to ensure they use the new domains

## Post-Deployment Tasks
- [ ] Verify deployed services work correctly
- [ ] Setup redirects from old domains to new domains (if needed)
- [ ] Update any external references to the app/domains

## Completed Work Summary

The following changes have been made:
1. Created this checklist document to track the rename process
2. Updated all domain references in code from chus.me to hol.is
3. Updated all domain references in code from Holis.social to holis.social
4. Changed all app name occurrences from "Holis" to "Holis"
5. Updated wrangler.toml configurations with new domain names
6. Updated documentation (README.md and CLAUDE.md) with new names
7. Added npm script commands for the new domain names

## Pending Tasks
- Test the invite functionality with the new domains after deployment
- Configure the actual domains in Cloudflare (outside the scope of this code change)
- Set up redirects from old domains to new domains after deployment