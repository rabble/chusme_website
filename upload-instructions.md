# Image Upload Instructions

To make the site show the screenshots, you'll need to upload the images to a hosting service and update the CDN base URL in the code.

## Option 1: Use BunnyCDN or similar service

1. Sign up for a CDN service like BunnyCDN, Cloudinary, or ImgBB
2. Upload these image files:
   - static/assets/asks_offers.png
   - static/assets/chat.png
   - static/assets/events.png
   - static/assets/posting_event.png
   - static/assets/posts.png
   - static/assets/authentic-connections.png
   - static/assets/community-focused.png
   - static/assets/not-entertainment.png
   - static/assets/not-product.png
   - static/assets/privacy-first.png
   - static/assets/user-control.png

3. Update the CDN base URL in the code:
   In src/index.ts line 786:
   ```javascript
   const cdnBaseUrl = "https://your-cdn-url-here";
   ```

## Option 2: Use Cloudflare R2 (recommended)

1. Enable R2 in your Cloudflare account dashboard
2. Create a bucket using Wrangler:
   ```
   npx wrangler r2 bucket create rabble-assets
   ```
3. Add the R2 binding to wrangler.toml:
   ```
   [[r2_buckets]]
   binding = "ASSETS"
   bucket_name = "rabble-assets"
   ```
4. Update the Worker code in src/index.ts to serve from R2 instead of redirecting to external CDN
5. Upload the images to the R2 bucket:
   ```
   npx wrangler r2 object put rabble-assets/asks_offers.png --file static/assets/asks_offers.png
   npx wrangler r2 object put rabble-assets/chat.png --file static/assets/chat.png
   npx wrangler r2 object put rabble-assets/events.png --file static/assets/events.png
   npx wrangler r2 object put rabble-assets/posting_event.png --file static/assets/posting_event.png
   npx wrangler r2 object put rabble-assets/posts.png --file static/assets/posts.png
   npx wrangler r2 object put rabble-assets/authentic-connections.png --file static/assets/authentic-connections.png
   npx wrangler r2 object put rabble-assets/community-focused.png --file static/assets/community-focused.png
   npx wrangler r2 object put rabble-assets/not-entertainment.png --file static/assets/not-entertainment.png
   npx wrangler r2 object put rabble-assets/not-product.png --file static/assets/not-product.png
   npx wrangler r2 object put rabble-assets/privacy-first.png --file static/assets/privacy-first.png
   npx wrangler r2 object put rabble-assets/user-control.png --file static/assets/user-control.png
   ```