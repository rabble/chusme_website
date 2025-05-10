# Web and Short URL Invites

## Description

This PR adds support for enhanced invite formats to the Plur app:

1. **Web Invites**: Rich metadata invites with custom landing pages
2. **Short URL Invites**: Compact, 4-character codes for easier sharing

These enhancements make group invites more user-friendly and accessible across platforms, with deep linking support on iOS and Android.

## API Changes

Added new endpoints:

- `POST /api/invite/web` - Create web invites with rich metadata
- `GET /api/invite/web/:code` - Retrieve web invite details
- `POST /api/invite/short` - Create short URL invites
- `GET /api/invite/short/:shortCode` - Resolve short codes

## URL Formats

New URL patterns:

- `https://rabble.community/join/{CODE}` - Web invites with rich metadata
- `https://rabble.community/j/{SHORT_CODE}` - Short URL invites

## Implementation Details

### Server-side changes:
- Updated apple-app-site-association and assetlinks.json
- Created new invite handler module
- Added preview pages for web invites
- Implemented short URL resolver

### Client-side changes:
- Updated Flutter invite utility with API integration
- Enhanced deep linking handler
- Added support for new URL formats

## Testing

- [x] API endpoints tested with Postman
- [x] Universal Links tested on iOS 15+
- [x] App Links tested on Android 10+
- [x] Short URL resolution verified
- [x] Web invite previews tested across browsers

## Documentation

- Added `WEB_AND_SHORT_INVITES.md` with implementation details
- Updated `README.md` with new API reference
- Created `IMPLEMENTATION_PLAN.md` with remaining tasks
- Updated `DEEP_LINKING.md` in the app with new URL formats

## Screenshots

*[Add screenshots of web invite previews]*

## Related Issues

Closes #XX - Add support for web invites
Closes #YY - Create shorter, friendlier invite URLs