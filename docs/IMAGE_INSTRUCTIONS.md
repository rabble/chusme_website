# Adding Real Images to Rabble.community

Currently, the site uses SVG-based placeholder images that are generated on-the-fly. This document provides instructions for replacing these placeholders with real screenshots and images.

## Current Setup

The worker is configured to serve stylized SVG placeholders for image requests. These placeholders are designed to match the aesthetic of the rabble.community site, with appropriate icons and colors for each feature.

## Adding Real Images

### Option 1: Direct Worker Updates (Quickest Method)

1. Update the static asset handler in `src/index.ts` to return the real images instead of SVG placeholders:

```typescript
// Handle static asset paths
if (path.startsWith('/static/assets/')) {
  const fileName = path.split('/').pop() || '';
  
  // Map of image file names to their base64 encoded content
  const imageMap: Record<string, string> = {
    'asks_offers.png': 'data:image/png;base64,BASE64_CONTENT_HERE',
    'chat.png': 'data:image/png;base64,BASE64_CONTENT_HERE',
    // Add other images...
  };
  
  if (imageMap[fileName]) {
    // Extract the base64 data part
    const [mimeType, base64Data] = imageMap[fileName].split(',');
    const binaryData = atob(base64Data);
    
    // Convert to binary array
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    
    return new Response(bytes, {
      headers: {
        'Content-Type': mimeType.split(':')[1].split(';')[0],
        'Cache-Control': 'public, max-age=86400' // 24 hour cache
      }
    });
  }
  
  // Fallback to existing SVG placeholders for any missing images
  // ...existing SVG code...
}
```

2. To get the base64 encoded content of an image, run:
```bash
cat image.png | base64
```

3. Deploy the updated worker:
```bash
npx wrangler deploy
```

### Option 2: Cloudflare R2 Storage (Better for Larger Files)

1. Enable R2 in your Cloudflare account
2. Create an R2 bucket:
```bash
npx wrangler r2 bucket create rabble-assets
```

3. Add R2 binding to wrangler.toml:
```toml
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "rabble-assets"
```

4. Upload images to R2:
```bash
npx wrangler r2 object put rabble-assets/asks_offers.png --file static/assets/asks_offers.png
# Repeat for each image
```

5. Update the worker to serve images from R2:
```typescript
// Handle static asset paths
if (path.startsWith('/static/assets/')) {
  const fileName = path.split('/').pop() || '';
  
  try {
    // Try to get the image from R2
    const object = await env.ASSETS.get(fileName);
    
    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Cache-Control', 'public, max-age=86400');
      
      return new Response(object.body, {
        headers
      });
    }
  } catch (error) {
    console.error(`Error fetching ${fileName} from R2:`, error);
  }
  
  // Fallback to SVG placeholders if not found in R2
  // ...existing SVG code...
}
```

### Option 3: Cloudflare Images (Best for Image Optimization)

1. Enable Cloudflare Images in your account
2. Upload images via the dashboard or API
3. Update the worker to use Cloudflare Images:
```typescript
// Handle static asset paths
if (path.startsWith('/static/assets/')) {
  const fileName = path.split('/').pop() || '';
  
  // Map local filenames to Cloudflare Image IDs
  const imageMap: Record<string, string> = {
    'asks_offers.png': 'actual-image-id-here/public',
    // Add other images...
  };
  
  // If the image exists in our map, redirect to Cloudflare Images
  if (imageMap[fileName]) {
    return Response.redirect(
      `https://imagedelivery.net/YOUR_ACCOUNT_HASH/${imageMap[fileName]}`,
      302
    );
  }
  
  // Fallback to SVG placeholders
  // ...existing SVG code...
}
```

## Ready-to-Use App Screenshots

When creating real screenshots for your app, consider:

1. **Consistency**: Take screenshots at the same device size/resolution
2. **Content**: Use realistic but non-sensitive content
3. **Focus**: Highlight the key features discussed on the website
4. **Quality**: Use PNG format for best quality
5. **Size**: Optimize images (target 100-200KB per image)