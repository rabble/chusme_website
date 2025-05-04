# Uploading Images to Cloudflare Images

This guide walks you through the process of uploading your PNG screenshots to Cloudflare Images and updating the worker with the correct image IDs.

## Prerequisites

1. A Cloudflare account with Images enabled
2. Cloudflare API token with Images permissions
3. The real PNG files you want to use for screenshots

## Step 1: Upload Images to Cloudflare

There are two ways to upload images to Cloudflare Images:

### Option 1: Using the Dashboard

1. Go to the Cloudflare dashboard
2. Navigate to Images
3. Click "Upload" and select the PNG files from your static/assets directory
4. For each uploaded image, note the Image ID which will look something like:
   `6c63d61e-36d9-41b4-9cce-ce05dd77d324`

### Option 2: Using the Script

We've provided a script (`upload_to_cloudflare_images.sh`) that automates the upload process:

1. Set your Cloudflare API token as an environment variable:
   ```bash
   export CLOUDFLARE_API_TOKEN=your_token_here
   ```

2. Run the script:
   ```bash
   ./upload_to_cloudflare_images.sh
   ```

3. The script will upload all valid PNG files and save the image IDs to `cloudflare_image_ids.json`

## Step 2: Update the Worker Code

Once you have uploaded the images and have their IDs, update the `cloudflareImagesMap` in `src/index.ts`:

```typescript
const cloudflareImagesMap: Record<string, string> = {
  'asks_offers.png': 'YOUR_ACTUAL_IMAGE_ID_HERE',
  'chat.png': 'YOUR_ACTUAL_IMAGE_ID_HERE',
  'events.png': 'YOUR_ACTUAL_IMAGE_ID_HERE',
  'posting_event.png': 'YOUR_ACTUAL_IMAGE_ID_HERE',
  'posts.png': 'YOUR_ACTUAL_IMAGE_ID_HERE'
};
```

Replace `YOUR_ACTUAL_IMAGE_ID_HERE` with the actual image IDs you received from Cloudflare.

## Step 3: Verify Your Account Hash

The account hash is used to construct the Cloudflare Images URL. Verify that the account hash in the code is correct:

```typescript
const accountHash = 'tFYLNJOaWGfOYZGTHjnFow'; // Your Cloudflare account hash
```

You can find your account hash in the Cloudflare Images dashboard or by looking at the URL of any image you upload.

## Step 4: Deploy the Updated Worker

Deploy the updated worker with the correct image IDs:

```bash
npx wrangler deploy
```

## Step 5: Test the Images

Visit your site and verify that the real images are being displayed correctly.

## Notes

- The worker is already set up to handle both real images (redirecting to Cloudflare Images) and placeholder SVGs for files that don't have corresponding Cloudflare Images.
- If you add more images in the future, just upload them to Cloudflare Images and update the `cloudflareImagesMap` in the code.
- Cloudflare Images provides automatic optimization, responsiveness, and global CDN distribution for your images.