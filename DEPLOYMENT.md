# Invite Gateway Deployment Guide

This guide provides step-by-step instructions for deploying the Invite Gateway service.

## Prerequisites

- Cloudflare account
- Domain name (`rabble.community`) with DNS managed by Cloudflare
- GitHub repository for CI/CD
- iOS and Android apps for integration

## 1. Initial Setup

### Clone the Repository
```bash
git clone <your-repo-url>
cd invite-gateway
```

### Install Dependencies
```bash
npm install
```

## 2. Cloudflare Configuration

### Create KV Namespace
1. Go to Cloudflare Dashboard > Workers & Pages > KV
2. Create a new namespace named "INVITES"
3. Copy the namespace ID

### Update wrangler.toml
1. Open `wrangler.toml`
2. Replace the placeholder values:
   - `YOUR_ACCOUNT_ID`: Your Cloudflare account ID
   - `YOUR_ZONE_ID`: The zone ID for your domain
   - `YOUR_KV_NAMESPACE_ID`: The ID of the INVITES namespace

### Add Secret
```bash
npx wrangler secret put INVITE_TOKEN
```
Enter a secure random string when prompted. This will be used for authenticating API requests.

## 3. App Links Configuration

### Android App Links
1. Generate your app's SHA256 fingerprint:
   ```bash
   keytool -list -v -keystore your-keystore.jks -alias your-key-alias
   ```
2. Open `src/index.ts`
3. Replace `YOUR_APP_FINGERPRINT_HERE` with your actual fingerprint

### iOS Universal Links
1. Get your Apple Team ID from the Apple Developer Portal
2. Open `src/index.ts`
3. Replace `YOUR_TEAM_ID` with your actual Team ID

### App Store ID
1. Find your app's App Store ID
2. Open `src/index.ts`
3. Replace `idYOUR_APP_ID` with your actual App Store ID

## 4. DNS Configuration

1. In Cloudflare DNS settings for your domain:
2. Add a CNAME record:
   - Name: `rabble.community`
   - Target: `<your-worker>.workers.dev`
   - Proxy status: Proxied

## 5. GitHub Actions Setup

1. In your GitHub repository settings, add these secrets:
   - `CF_API_TOKEN`: Your Cloudflare API token with Workers permissions
   - `CF_ACCOUNT_ID`: Your Cloudflare account ID

2. Push your code to the main branch to trigger deployment:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

## 6. App Integration

### iOS App
Follow the instructions in `ios-app-setup.md` to:
1. Configure Associated Domains
2. Implement URL handling
3. Test Universal Links

### Android App
Follow the instructions in `android-app-setup.md` to:
1. Configure App Links in the manifest
2. Implement intent handling
3. Test App Links

## 7. Testing

Use the scripts in `testing.md` to:
1. Test API endpoints
2. Verify preview page functionality
3. Test deep linking on iOS and Android
4. Verify all components work together

## 8. Monitoring

After deployment:
1. Monitor Cloudflare Worker analytics
2. Check for any errors in the logs
3. Verify that invites are working as expected

## 9. Static Content & Website Pages

The invite gateway now serves multiple website pages:

1. **Landing Page**: `/` - Main site landing page
2. **About Page**: `/about` - Information about Rabble and Verse PBC
3. **Design Principles**: `/design-principles` - Product design principles and non-negotiables
4. **FAQ**: `/faq` - Frequently asked questions
5. **Roadmap**: `/roadmap` - Product roadmap
6. **Developers**: `/developers` - Developer documentation
7. **Blog**: `/blog` - Blog index and posts
8. **Legal Pages**: `/privacy-policy` and `/terms-of-service`

To modify or add pages:

1. Edit the `PAGES` object in `src/index.ts`
2. Add new markdown content for each page
3. Update the navigation menu if needed

### Proxying the Web App

The worker also proxies the Plur web app at the `/app` path:

1. Requests to `/app` are proxied to `https://plur-app.cloudflare.dev`
2. HTMLRewriter modifies links to maintain the `/app` prefix
3. Content-Security-Policy headers may need adjustment if you encounter issues

## 10. Next Steps

Consider implementing:
1. Analytics for invite usage tracking
2. Rate limiting for API endpoints
3. Expiring invites (if needed)
4. Admin dashboard for invite management
5. Image optimization for static assets
6. Cache headers for better performance
7. Content security policies

## Troubleshooting

- **API 401 errors**: Verify your INVITE_TOKEN is set correctly
- **KV errors**: Ensure the KV namespace is bound correctly
- **Deep linking not working**: Verify app configurations and test with the debugging tools