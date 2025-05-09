# BunnyCDN Quick Setup Guide

BunnyCDN offers a cost-effective way to serve your images with a global CDN. Here's how to set it up:

1. Sign up at [BunnyCDN](https://bunny.net)
2. Create a new storage zone (e.g., "rabble-assets")
3. Once created, you'll get FTP credentials to upload your files:
   - FTP Host: storage.bunnycdn.com
   - Username: rabble-assets
   - Password: (generated by BunnyCDN)
   
4. Upload your images via FTP or use the web interface

5. Create a new Pull Zone:
   - Name: rabble-assets
   - Origin URL: https://storage.bunnycdn.com/rabble-assets/
   - Enable "Cache non-200 responses" 
   - Set appropriate caching options (recommended: 7 days)

6. Once created, you'll get a URL like: https://rabble-assets.b-cdn.net

7. Update the CDN base URL in src/index.ts:
   ```javascript
   const cdnBaseUrl = "https://rabble-assets.b-cdn.net"; 
   ```

8. Deploy your updated worker:
   ```
   npx wrangler deploy
   ```

## Cost Estimate
BunnyCDN is very affordable:
- Storage: $0.01/GB/month
- CDN Traffic: $0.01/GB (varies by region)

For a small site with screenshots, costs should be minimal (under $1/month).