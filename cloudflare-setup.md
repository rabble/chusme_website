# Cloudflare Setup Instructions

## 1. Create Cloudflare Account (if you don't have one)
- Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
- Complete the registration process

## 2. Add Your Domain to Cloudflare
- In the Cloudflare dashboard, click "Add a Site"
- Enter your domain name: `rabble.community`
- Select a plan (Free plan works for this project)
- Follow the instructions to update your domain's nameservers at your registrar

## 3. Create KV Namespace
- Go to "Workers & Pages" in the Cloudflare dashboard
- Click "KV" in the navigation
- Click "Create namespace"
- Name it "INVITES"
- Copy the namespace ID for use in wrangler.toml

## 4. Update wrangler.toml
- Replace `YOUR_ACCOUNT_ID` with your Cloudflare account ID (found in the dashboard URL)
- Replace `YOUR_ZONE_ID` with your zone ID (found in the domain overview)
- Replace `YOUR_KV_NAMESPACE_ID` with the ID of the INVITES namespace

## 5. Set Up Secret
- Run: `npx wrangler secret put INVITE_TOKEN`
- Enter a secure random string to use as your authentication token
- Make note of this token as you'll need it to create invites

## 6. Deploy the Worker
- Run: `npm run deploy`
- This will deploy your worker to Cloudflare

## 7. Configure DNS Records
- In the Cloudflare dashboard, go to the DNS section for your domain
- Add a CNAME record:
  - Name: `rabble.community`
  - Target: `<your-worker>.workers.dev`
  - Proxy status: Proxied

## 8. Test the Deployment
- Visit `https://rabble.community/.well-known/assetlinks.json` to verify deployment
- The response should be the Android App Links JSON configuration