# Hosting Assets on Cloudflare Pages

We're going to use Cloudflare Pages to host the static assets (images) for the rabble.community site. This is a simple and free way to host static content on Cloudflare's global network.

## Setup Steps

1. **Create a Pages directory**:

```bash
mkdir -p pages/static/assets
```

2. **Copy assets to the Pages directory**:

```bash
cp static/assets/*.png pages/static/assets/
```

3. **Create a basic index.html in the Pages root**:

```bash
echo "<html><body><h1>Rabble Community Assets</h1></body></html>" > pages/index.html
```

4. **Deploy to Cloudflare Pages**:

```bash
npx wrangler pages deploy pages --project-name=rabble-assets
```

5. **Update the Worker to use the Pages URL**:

The Pages URL will be something like: `https://rabble-assets.pages.dev`

Update the redirect URL in your Worker code to use this URL for the images.

## Benefits of Cloudflare Pages

- Free hosting for static assets
- Global CDN
- Automatic HTTPS
- Easy deployment
- No need for separate image hosting service

## Detailed Setup Steps

### Create and Deploy the Pages Site

```bash
# Create Pages structure
mkdir -p pages/static/assets

# Copy assets
cp static/assets/*.png pages/static/assets/

# Add a basic index.html
cat > pages/index.html << EOF
<!DOCTYPE html>
<html>
<head>
  <title>Rabble Community Assets</title>
  <style>
    body {
      font-family: sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #5d4037;
    }
    .asset-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .asset-item {
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 4px;
    }
    .asset-item img {
      max-width: 100%;
    }
    .asset-item p {
      margin-top: 10px;
      font-size: 14px;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <h1>Rabble Community Assets</h1>
  <p>This site hosts static assets for the rabble.community website.</p>
  
  <div class="asset-list">
    <div class="asset-item">
      <img src="/static/assets/asks_offers.png" alt="Asks Offers">
      <p>/static/assets/asks_offers.png</p>
    </div>
    <div class="asset-item">
      <img src="/static/assets/chat.png" alt="Chat">
      <p>/static/assets/chat.png</p>
    </div>
    <div class="asset-item">
      <img src="/static/assets/events.png" alt="Events">
      <p>/static/assets/events.png</p>
    </div>
    <div class="asset-item">
      <img src="/static/assets/posting_event.png" alt="Posting Event">
      <p>/static/assets/posting_event.png</p>
    </div>
    <div class="asset-item">
      <img src="/static/assets/posts.png" alt="Posts">
      <p>/static/assets/posts.png</p>
    </div>
  </div>
</body>
</html>
EOF

# Deploy to Cloudflare Pages
npx wrangler pages deploy pages --project-name=rabble-assets
```

### Update the Worker Code

After deploying to Pages, update your Worker code in `src/index.ts` to use the Pages URL.