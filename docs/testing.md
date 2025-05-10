# Testing Guide for Plur Invite Gateway

This document covers how to test all aspects of the invite gateway functionality, including API endpoints, invite links, deep linking, and more.

## 1. Testing API Endpoints

### Create Invite Endpoint

Test creating a new invite via the API:

```bash
# Create a new invite (replace YOUR_TOKEN with the actual invite token)
curl -X POST \
  https://rabble.community/api/invite \
  -H "Content-Type: application/json" \
  -H "X-Invite-Token: YOUR_TOKEN" \
  -d '{"groupId":"R6PCSLSWB45E","relay":"wss://communities.nos.social"}'
```

Expected Response:
```json
{
  "code": "8Z4K7JMV",
  "url": "https://rabble.community/i/8Z4K7JMV"
}
```

### Get Invite Endpoint

Test retrieving invite details:

```bash
# Get invite details for a code
curl https://rabble.community/api/invite/8Z4K7JMV
```

Expected Response:
```json
{
  "code": "8Z4K7JMV",
  "groupId": "R6PCSLSWB45E",
  "relay": "wss://communities.nos.social"
}
```

### Unauthorized Access

Test security of the create endpoint:

```bash
# Attempt without token
curl -X POST \
  https://rabble.community/api/invite \
  -H "Content-Type: application/json" \
  -d '{"groupId":"TEST","relay":"wss://test.relay"}'

# Attempt with invalid token
curl -X POST \
  https://rabble.community/api/invite \
  -H "Content-Type: application/json" \
  -H "X-Invite-Token: INVALID_TOKEN" \
  -d '{"groupId":"TEST","relay":"wss://test.relay"}'
```

Expected Response:
```json
{
  "error": "Unauthorized"
}
```

## 2. Testing Invite Links

### Simple Code Invites

Generate a test invite and visit these links in different browsers and devices:

```
https://rabble.community/i/8Z4K7JMV
```

Expected behavior:
- The invite page should display loading and then show "You're Invited to Join"
- The "Open in Plur App" button should be visible
- The app store buttons should appear appropriately based on the device

### Direct Protocol URLs

Test direct protocol URLs embedded in universal links:

```
https://rabble.community/i/plur://join-community?group-id=R6PCSLSWB45E&code=8Z4K7JMV&relay=wss%3A%2F%2Fcommunities.nos.social
```

Expected behavior:
- Similar to simple code invites, but should work without API lookup
- Parameters should be extracted directly from the URL

### Additional Path Formats

Test all supported path formats:

```
https://rabble.community/join/R6PCSLSWB45E?code=8Z4K7JMV&relay=wss%3A%2F%2Fcommunities.nos.social
https://rabble.community/join-community?group-id=R6PCSLSWB45E&code=8Z4K7JMV&relay=wss%3A%2F%2Fcommunities.nos.social
https://rabble.community/g/R6PCSLSWB45E?relay=wss%3A%2F%2Fcommunities.nos.social
```

## 3. Testing Deep Linking

### iOS App

1. Install the Plur app on your iOS device (via TestFlight or direct)
2. Set up the app with proper associated domains
3. Open the test links (from section 2) on your iOS device
4. Verify the app opens and processes the parameters correctly
5. Check debug logs for any issues

### Android App

1. Install the Plur app on your Android device 
2. Set up the app with proper intent filters and app links
3. Open the test links on your Android device
4. Verify the app opens and processes the parameters correctly
5. Check logcat for any issues with link handling

### Custom URL Scheme

Test direct custom URL scheme handling:

```
plur://join-community?group-id=R6PCSLSWB45E&code=8Z4K7JMV&relay=wss%3A%2F%2Fcommunities.nos.social
plur://group/R6PCSLSWB45E?relay=wss%3A%2F%2Fcommunities.nos.social
```

## 4. Browser Testing

Verify the invite page renders correctly across different browsers:

- Chrome on Android
- Safari on iOS
- Chrome/Firefox/Safari on desktop

Check that:
- Page layout is responsive
- All buttons appear correctly
- Appropriate buttons are shown/hidden based on the device
- Images and styles load properly

## 5. Web App Integration

Test that the "Continue in Browser" option works correctly:

1. Click "Continue in Browser" on an invite page
2. Verify it redirects to `/app` with the correct parameters
3. Check that the web app receives and processes the invite parameters

## 6. Testing App Link Files

### Android App Links

```bash
curl https://rabble.community/.well-known/assetlinks.json
```

Verify the content matches your configured package name (`app.verse.prototype.plur`) and certificate fingerprint.

### iOS Universal Links

```bash
curl https://rabble.community/apple-app-site-association
```

Verify the content includes:
- App ID: `GZCZBKH7MY.app.verse.prototype.plur`
- All path patterns: `/i/*`, `/join/*`, `/join-community*`, `/g/*`

## 7. Edge Cases

Test these edge cases:

- Invalid invite codes: `/i/INVALID_CODE`
- Malformed protocol URLs: `/i/plur://invalid-format`
- Missing parameters: `/join-community?group-id=TEST` (missing relay)
- Very long relay URLs
- Unicode characters in parameters

## 8. Performance Testing

For high-traffic scenarios:

1. Simulate multiple concurrent invite creations
2. Test KV read/write performance under load
3. Check response times for invite pages with different numbers of active users

## 9. End-to-End Flow Test

Complete cycle test:

1. Create a new invite code using the API
2. Open the URL in a web browser
3. Verify the preview page loads correctly
4. Test all buttons:
   - "Open in Plur App" should launch or prompt to download the app
   - App store buttons should redirect to the correct app store pages
   - "Continue in Browser" should open the web app with parameters
5. Verify the same link works on both iOS and Android devices

## 10. Maintenance

- Monitor KV usage to ensure you don't hit storage limits
- Keep an eye on invite creation patterns for abuse
- Regularly check that the AASA and assetlinks.json files are accessible