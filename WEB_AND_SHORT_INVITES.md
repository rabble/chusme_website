# Web and Short URL Invites for Plur

This document describes the implementation of web-based invites with rich metadata and short URL invites for the Plur app.

## Overview

We've enhanced the invite system with two new formats:

1. **Web Invites** - Rich invites that display group metadata on a web page
2. **Short URL Invites** - Compact codes for easy sharing (4 characters vs 8)

These new formats complement the existing standard invites, giving users more flexibility for sharing community links.

## Web Invites

### Purpose

Web invites provide a richer experience for users who receive invites through web browsers. They display:

- Group name and description
- Group avatar image
- Creation date and other metadata
- Proper Open Graph tags for nice previews in messaging apps
- Customized call-to-action buttons

### Implementation

1. **Data Storage**:
   - Stored in KV namespace with `web:` prefix
   - Contains additional metadata fields:
     - name
     - description
     - avatar
     - createdAt
     - creatorPubkey

2. **URL Format**:
   - `https://rabble.community/join/{CODE}`
   - Uses `/join/` path instead of `/i/` to distinguish from standard invites

3. **API Endpoints**:
   - Create: `POST /api/invite/web` 
   - Read: `GET /api/invite/web/:code`

4. **HTML Template**:
   - Custom landing page with group branding
   - Open Graph meta tags for social sharing
   - Responsive design for mobile and desktop
   - Appropriate call-to-action buttons based on platform

## Short URL Invites

### Purpose

Short URL invites create more memorable, easier-to-share links. They:

- Use 4-character codes instead of 8
- Redirect to standard or web invites
- Work well for verbal sharing ("rabble.community/j/X1Y2")
- Can be easily typed on mobile devices

### Implementation

1. **Data Storage**:
   - Stored in KV namespace with `short:` prefix
   - Contains mapping to full invitation code
   - No expiration (same as standard invites)

2. **URL Format**:
   - `https://rabble.community/j/{SHORT_CODE}`
   - Uses `/j/` path to indicate short format

3. **API Endpoints**:
   - Create: `POST /api/invite/short`
   - Read: `GET /api/invite/short/:shortCode`

4. **Redirection Flow**:
   1. User visits `/j/{SHORT_CODE}`
   2. System resolves the shortcode to a standard code
   3. User is redirected to the appropriate invite page
   4. Universal linking attempts to open the app
   5. If app isn't installed, user sees install options

## App Integration

### iOS/Android Integration

1. **Universal Links**:
   - `apple-app-site-association` updated to include:
     - `/join/*` pattern for web invites
     - `/j/*` pattern for short URL invites
   - Android App Links updated similarly

2. **UX Flows**:
   - If app is installed: Opens directly in app
   - If not installed: Shows install buttons
   - Also provides web fallback option

### Deep Linking Parameters

All invite formats ultimately resolve to the same parameters:
- `groupId`: The identifier for the community
- `code`: The invitation code
- `relay`: The relay URL

## Usage Examples

### Creating Invites

**Standard Invite**:
```bash
curl -X POST https://rabble.community/api/invite \
  -H "X-Invite-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{"groupId": "123ABC", "relay": "wss://relay.example.com"}'
```

**Web Invite**:
```bash
curl -X POST https://rabble.community/api/invite/web \
  -H "X-Invite-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "123ABC",
    "relay": "wss://relay.example.com",
    "name": "My Cool Group",
    "description": "A group for discussing cool things",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

**Short URL**:
```bash
curl -X POST https://rabble.community/api/invite/short \
  -H "X-Invite-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{"code": "ABCD1234"}'
```

### Sharing Examples

- Standard: "Join my group at rabble.community/i/ABCD1234"
- Web: "Join my group at rabble.community/join/ABCD1234"
- Short: "Join my group at rabble.community/j/1A2B"

## Future Enhancements

1. **Invite Analytics**:
   - Track which invite formats are most successful
   - Measure conversion rates (clicks → installs → joins)

2. **Expiring Invites**:
   - Add TTL options for time-limited invites
   - Create one-time use invites for sensitive groups

3. **Advanced Invite Management**:
   - Admin dashboard for tracking invites
   - Ability to revoke specific invites
   - Custom branding options for web invites

4. **QR Code Generation**:
   - Automatic QR codes for in-person sharing
   - Printed materials with scannable invites