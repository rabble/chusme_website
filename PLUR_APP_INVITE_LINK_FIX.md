# Fixing Invite Links in the Plur App

## Issue Identified

We've identified an issue with how the Plur app is generating invite links:

1. The app is creating invite links that include the entire deep link URL in the invite code part, resulting in invalid URLs like:
   ```
   https://chus.me/i/plur://join-community?group-id=4xwe6r2w0gm7&code=KUGM8S7Q&relay=wss%3A%2F%2Fcommunities.nos.social
   ```

2. When this malformed URL is accessed, the server tries to look up an invite with the code "plur://join-community?group-id=...", which doesn't exist.

3. The server now detects this malformed URL format and shows a more helpful error message, but the core issue needs to be fixed in the app.

## Solution

### 1. Fix URL Generation in the Flutter App

Locate the code in the app that generates invite links. It's likely in a file that handles sharing or invites, possibly near where you create the `plur://join-community?` deep links.

The incorrect code looks something like this:

```dart
String generateInviteLink(String groupId, String code, String relay) {
  // INCORRECT - This embeds the entire deep link as part of the URL path
  String deepLink = "plur://join-community?group-id=$groupId&code=$code&relay=${Uri.encodeComponent(relay)}";
  return "https://chus.me/i/$deepLink";
}
```

Change it to:

```dart
String generateInviteLink(String code) {
  // CORRECT - Only use the invite code
  return "https://chus.me/i/$code";
}
```

### 2. Update the Share Flow

Ensure that when generating invite links for sharing:

1. Your app first creates the invite through the server's API (which returns a code).
2. Only share the URL format `https://chus.me/i/<CODE>` - not the deep link format.

### 3. Fix Display in the UI

The screenshots show the app displaying invite URLs like:
```
https://chus.me/i/plur://join-community?group-id=4xwe6r2w0gm7&code=KUGM8S7Q&relay=wss%3A%2F%2Fcommunities.nos.social
```

Update the UI to show only the correct format: `https://chus.me/i/KUGM8S7Q`

### 4. Test Your Changes

After implementing these changes:

1. Generate a new invite link
2. Ensure it's in the format `https://chus.me/i/<CODE>` (just the code after the /i/)
3. Try clicking the link from a different device/browser
4. It should successfully redirect to the app with the join information

## How the Invite System Works

For reference, here's how the invite system is meant to work:

1. **Creating an invite**:
   - App/server creates an invite in the database and gets a unique invite code (e.g., "KUGM8S7Q")
   - This code maps to the group ID and relay in the database

2. **Generating a shareable URL**:
   - Format should be `https://chus.me/i/<CODE>` (e.g., `https://chus.me/i/KUGM8S7Q`)
   - This URL is what users share with others

3. **When someone clicks the link**:
   - The server looks up the code in its database
   - If found, it redirects to the deep link: `plur://join-community?group-id=XXX&code=YYY&relay=ZZZ`
   - The mobile OS opens the app with this deep link
   - The app extracts the parameters and proceeds with joining

The key issue is that only the simple code should be in the URL path after `/i/`, not the entire deep link itself.

## Common Mistakes to Check

1. Make sure your app isn't trying to encode the entire deep link URL as part of another URL
2. Check that you're not mixing up the invite code (used in URLs) with the full Plur deep link
3. Verify the invite flow in your app follows the sequence: create invite → get code → generate URL with just that code

By fixing this issue, your invite links will work properly and users will be able to join communities seamlessly. 