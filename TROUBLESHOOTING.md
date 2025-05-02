# Troubleshooting Web and Short URL Invites

This guide helps diagnose and fix common issues with the web invites and short URL invites feature.

## API Issues

### Issue: 401 Unauthorized when creating invites

**Symptoms:**
- API returns 401 status code
- Error message about invalid token

**Solutions:**
1. Verify the `X-Invite-Token` header matches the one in Cloudflare Workers environment variable
2. Check that the token is included in the request headers
3. Ensure the token hasn't been rotated or changed

### Issue: 404 Not Found for invite endpoints

**Symptoms:**
- API returns 404 status code 
- "Function not found" error

**Solutions:**
1. Verify worker deployment was successful
2. Check that routes in `wrangler.toml` include the new API paths
3. Verify the `*` wildcard routes are properly configured

### Issue: Invite creation succeeds but data is invalid

**Symptoms:**
- API returns 200 but invite doesn't work
- Missing or incorrect fields in the response

**Solutions:**
1. Check KV namespace bindings in the Worker
2. Verify KV writes are successful (use KV browser in Cloudflare dashboard)
3. Test reading the value back from KV to ensure it was stored properly

## Web Preview Issues

### Issue: Web preview pages show no styling

**Symptoms:**
- Page loads but looks unstyled
- Missing CSS elements

**Solutions:**
1. Check browser console for CSS loading errors
2. Verify the HTML includes inline styles
3. Check for Content-Security-Policy headers that might block styles

### Issue: Group metadata not displaying

**Symptoms:**
- Generic placeholder instead of group name/avatar
- Missing description or other fields

**Solutions:**
1. Verify web invite data was properly saved with metadata
2. Check the invite-handler.ts logic for metadata extraction
3. Test API response for web invite contains all required fields

### Issue: Open Graph tags not working

**Symptoms:**
- Poor previews in messaging apps
- Missing images or descriptions when shared

**Solutions:**
1. Validate HTML includes proper meta tags
2. Check for og:image, og:title, and og:description tags
3. Verify image URLs are absolute and accessible
4. Test with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

## Short URL Issues

### Issue: Short URLs not redirecting

**Symptoms:**
- 404 error when accessing short URLs
- Redirect doesn't happen

**Solutions:**
1. Verify short code mapping exists in KV
2. Check route handler for `/j/:shortCode`
3. Test KV get operation directly on the short code key
4. Make sure redirects are being performed with proper status codes (301 or 302)

### Issue: Short URL resolves to wrong invite

**Symptoms:**
- Redirects to incorrect invite
- Wrong group information after redirect

**Solutions:**
1. Check for collisions in short code generation
2. Verify KV mapping contains correct full code
3. Test with newly generated short URLs to rule out data corruption

## Deep Linking Issues

### Issue: Universal Links not working on iOS

**Symptoms:**
- Links open in browser instead of app
- No prompt to open in app

**Solutions:**
1. Verify apple-app-site-association file is correctly formatted JSON
2. Ensure file is served with Content-Type: application/json
3. Check Apple's validation tool: `https://app-site-association-validator.apple.com`
4. Make sure app has Associated Domains capability enabled
5. Check app's Info.plist for proper URL scheme handling
6. Try rebooting the device (sometimes needed to refresh Universal Links)

### Issue: App Links not working on Android

**Symptoms:**
- Links open in browser instead of app
- No intent handling

**Solutions:**
1. Verify assetlinks.json is properly formatted
2. Ensure it's served from /.well-known/assetlinks.json
3. Check Android manifest for proper intent-filter declarations
4. Verify Digital Asset Links in Google Play Console
5. Test with the [Statement List Generator](https://developers.google.com/digital-asset-links/tools/generator)

### Issue: Link opens app but doesn't navigate to join screen

**Symptoms:**
- App opens but shows main screen
- No join prompt appears

**Solutions:**
1. Debug link handler in the app code
2. Check URL parsing logic for the new formats
3. Verify app can extract invite code from all URL formats
4. Test each URL format independently

## Installation Flow Issues

### Issue: App store links not working

**Symptoms:**
- "Get on iOS/Android" buttons don't open app stores
- Incorrect app store pages

**Solutions:**
1. Verify app store URLs are correct
2. Check platform detection logic
3. Make sure app store IDs match your app

### Issue: After install, invite context is lost

**Symptoms:**
- User installs app but isn't prompted to join the group
- Invite flow breaks after installation

**Solutions:**
1. Implement proper deferred deep linking
2. Store invite information in local storage before redirecting
3. Check for pending invites on app first launch

## Analytics and Monitoring

### Issue: Missing invite analytics

**Symptoms:**
- No data in analytics dashboard
- Invite events not tracked

**Solutions:**
1. Verify analytics code is firing on invite pages
2. Check for blocked trackers or privacy settings
3. Implement manual logging to debug event flow

### Issue: High error rates in logs

**Symptoms:**
- Many errors in CloudFlare logs
- Failed invite attempts

**Solutions:**
1. Add more detailed error logging
2. Check for patterns in the errors (specific browsers or devices)
3. Implement retry mechanisms for flaky operations

## Getting Help

If you're still experiencing issues after trying these solutions:

1. **Check the logs**: Cloudflare Workers logs can provide insights
2. **Test API directly**: Use tools like Postman to test each endpoint
3. **Deployment verification**: Ensure latest code is deployed
4. **Browser testing**: Try multiple browsers to isolate browser-specific issues
5. **Contact the dev team**: Provide specific error messages and reproduction steps