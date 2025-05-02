# Quick Test Guide: Web and Short URL Invites

This guide provides quick steps to verify that the newly deployed web and short URL invites are working correctly.

## 1. API Testing

### Create a Standard Invite
```bash
curl -X POST https://rabble.community/api/invite \
  -H "X-Invite-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"groupId": "TEST123", "relay": "wss://relay.example.com"}'
```
✅ Should return: `{"code": "ABCD1234", "url": "https://rabble.community/i/ABCD1234"}`

### Create a Web Invite
```bash
curl -X POST https://rabble.community/api/invite/web \
  -H "X-Invite-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"groupId": "TEST123", "relay": "wss://relay.example.com", "name": "Test Group", "description": "Testing web invites"}'
```
✅ Should return: `{"code": "WXYZ9876", "url": "https://rabble.community/join/WXYZ9876"}`

### Create a Short URL
```bash
curl -X POST https://rabble.community/api/invite/short \
  -H "X-Invite-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "ABCD1234"}'
```
✅ Should return: `{"shortCode": "A1B2", "url": "https://rabble.community/j/A1B2"}`

## 2. Browser Testing

1. **Test Standard Invite Preview**
   - Open `https://rabble.community/i/ABCD1234` in a browser
   - Verify group info displays correctly
   - Check that all buttons (Open in App, Get on iOS/Android) are visible

2. **Test Web Invite Preview**
   - Open `https://rabble.community/join/WXYZ9876` in a browser
   - Verify the rich metadata (name, description) displays correctly
   - Confirm the UI is properly styled

3. **Test Short URL Redirect**
   - Open `https://rabble.community/j/A1B2` in a browser
   - Should redirect to the full invite page
   - After redirect, all invite information should be visible

## 3. Mobile App Testing

### iOS Testing

1. **Test Standard Invite**
   - Send `https://rabble.community/i/ABCD1234` via iMessage to a device with the app
   - Tap the link - app should open directly to join screen
   - Verify group information appears correctly

2. **Test Web Invite**
   - Send `https://rabble.community/join/WXYZ9876` via iMessage
   - Tap the link - app should open to join screen
   - Verify the group info matches the rich metadata

3. **Test Short URL**
   - Send `https://rabble.community/j/A1B2` via iMessage
   - Tap the link - app should open to join screen
   - After resolution, proper group info should display

### Android Testing

1. **Test Standard Invite**
   - Send `https://rabble.community/i/ABCD1234` via WhatsApp/SMS
   - Tap the link - app should open to join screen
   - Verify group information appears correctly

2. **Test Web Invite**
   - Send `https://rabble.community/join/WXYZ9876` via WhatsApp/SMS
   - Tap the link - app should open to join screen
   - Verify the group info matches the metadata

3. **Test Short URL**
   - Send `https://rabble.community/j/A1B2` via WhatsApp/SMS
   - Tap the link - app should open to join screen
   - After resolution, proper group info should display

## 4. App Install Testing

1. **Test on a device without the app installed**
   - Send any invite link to a device without the app
   - Open the link - should see the web preview
   - Tap "Get on iOS/Android" - should go to app store
   - Install the app and return to the link
   - App should open with the invite ready to accept

## 5. Social Media Preview Testing

1. **Test link previews in common platforms**
   - Paste the web invite link in Slack/Discord/Twitter
   - Verify Open Graph tags generate a nice preview
   - Check that title, description, and image appear

## 6. Common Issues and Solutions

### Universal Links Not Working on iOS
- Make sure apple-app-site-association file is properly hosted
- Verify app has Associated Domains capability enabled
- Try rebooting the device (sometimes needed to refresh Universal Links)

### App Links Not Working on Android
- Verify assetlinks.json is properly hosted
- Check Digital Asset Links in Google Play Console
- Make sure manifest has proper intent filters

### Short URLs Not Resolving
- Check KV storage for correct mappings
- Verify Worker routes are handling /j/* paths correctly
- Test with newly created short URLs to rule out data issues

## 7. Quick Success Verification

A successful implementation should result in:

1. Web invites showing rich, branded preview pages
2. Short URLs resolving quickly to proper invites
3. All links opening the app directly when tapped on mobile
4. Installation flows working for users without the app
5. All invite types ultimately allowing users to join groups

If all these steps pass, your deployment has been successful!