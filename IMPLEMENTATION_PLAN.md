# Web and Short URL Invites Implementation Plan

This document outlines the steps needed to fully implement web invites with rich metadata and short URL invites for deep linking in the Plur app.

## Changes Already Implemented

1. **Apple App Site Association File**
   - Updated to support new URL patterns:
     - `/join/*` - Path for web invites with rich metadata
     - `/j/*` - Path for short URL invites (4 characters)

2. **Android Asset Links JSON**
   - Created with proper configuration for App Links

3. **Invite Handler Module**
   - Created `invite-handler.ts` with specialized functions:
     - `createWebInvite()` - For rich metadata invites
     - `createShortUrlInvite()` - For compact invites
     - `getWebInvite()` - For retrieving web invite data
     - `resolveShortCode()` - For resolving short codes to full codes
     - `createWebInvitePage()` - For generating rich HTML pages

4. **Documentation**
   - Updated `README.md` with new API reference
   - Updated `DEEP_LINKING.md` with new URL formats
   - Created `WEB_AND_SHORT_INVITES.md` with implementation details

5. **Flutter Integration**
   - Updated `group_invite_link_util.dart` with:
     - API client methods for all new endpoints
     - URL generation functions for new formats
     - Helper functions for working with different invite types

## Remaining Implementation Tasks

### 1. Server-side Changes

1. **Cloudflare Worker Updates**
   - Implement the API endpoints in `index.ts`:
     ```typescript
     // Create a web invite
     router.post('/api/invite/web', handleCreateWebInvite);
     
     // Get a web invite
     router.get('/api/invite/web/:code', handleGetWebInvite);
     
     // Create a short URL
     router.post('/api/invite/short', handleCreateShortUrl);
     
     // Resolve a short URL
     router.get('/api/invite/short/:shortCode', handleResolveShortUrl);
     
     // Handle the web invite preview page
     router.get('/join/:code', handleWebInvitePreview);
     
     // Handle short URL redirects
     router.get('/j/:shortCode', handleShortUrlRedirect);
     ```

2. **Handler Functions**
   - Import the functions from `invite-handler.ts`
   - Implement the request handlers:
     - Authentication and validation
     - Error handling and rate limiting
     - Proper response formatting

3. **Preview Pages**
   - Implement HTML generation in the worker script
   - Create styling for the preview pages
   - Add appropriate Open Graph tags

### 2. Flutter App Changes

1. **Deep Link Handling**
   - Update the app's deep link handler to support:
     - `/join/{code}` format for web invites
     - `/j/{shortCode}` format for short URL invites
     - Redirects from the short URL resolver

2. **UI Enhancements**
   - Add UI for creating web invites with metadata
   - Add UI for generating short URLs
   - Update sharing UI to offer different invite types

3. **Settings and Configuration**
   - Add configuration options for:
     - Default invite type preference 
     - API token storage and management

### 3. Testing Plan

1. **API Testing**
   - Create test scripts for all new endpoints
   - Verify authentication requirements
   - Test success and error response formats

2. **Universal Link Testing**
   - Test new URL formats on iOS devices
   - Verify AASA file is being properly read

3. **App Link Testing**
   - Test new URL formats on Android devices
   - Verify assetlinks.json is being properly read

4. **Cross-platform Testing**
   - Test link sharing between different platforms
   - Verify link behavior on platforms without the app installed

### 4. Deployment Plan

1. **Staging Deployment**
   - Deploy to a staging environment first
   - Conduct full testing with real devices
   - Get feedback on UX and performance

2. **Production Deployment**
   - Update KV namespace configuration
   - Deploy worker code to production
   - Verify live functionality
   - Monitor for errors or performance issues

3. **App Store Updates**
   - Update the app with new deep linking capabilities
   - Submit for review and deployment

## API Implementation Details

### 1. Web Invite Endpoint

```typescript
async function handleCreateWebInvite(request: Request, env: Env): Promise<Response> {
  // Check authentication
  const token = request.headers.get('X-Invite-Token');
  if (token !== env.INVITE_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const data = await request.json();
    const { groupId, relay, name, description, avatar, creatorPubkey } = data;
    
    // Validate required fields
    if (!groupId || !relay) {
      return new Response('Missing required fields', { status: 400 });
    }
    
    // Create web invite
    const code = generateCode();
    const webInviteData = {
      groupId,
      relay,
      name: name || null,
      description: description || null,
      avatar: avatar || null,
      creatorPubkey: creatorPubkey || null,
      createdAt: Date.now()
    };
    
    // Store in KV
    await env.INVITES.put(`web:${code}`, JSON.stringify(webInviteData));
    
    // Return response
    return new Response(JSON.stringify({
      code,
      url: `https://rabble.community/join/${code}`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response('Invalid request', { status: 400 });
  }
}
```

### 2. Short URL Endpoint

```typescript
async function handleCreateShortUrl(request: Request, env: Env): Promise<Response> {
  // Check authentication
  const token = request.headers.get('X-Invite-Token');
  if (token !== env.INVITE_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const data = await request.json();
    const { code } = data;
    
    // Validate required fields
    if (!code) {
      return new Response('Missing code field', { status: 400 });
    }
    
    // Create short code
    const shortCode = generateShortCode();
    const shortCodeData = { code };
    
    // Store in KV
    await env.INVITES.put(`short:${shortCode}`, JSON.stringify(shortCodeData));
    
    // Return response
    return new Response(JSON.stringify({
      shortCode,
      url: `https://rabble.community/j/${shortCode}`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response('Invalid request', { status: 400 });
  }
}
```

## Timeline

1. **Phase 1: Core Implementation (1-2 weeks)**
   - Implement server-side endpoints
   - Update app deep linking handlers
   - Basic testing with iOS and Android

2. **Phase 2: UI and UX (1 week)**
   - Create invite creation UI
   - Update invite sharing flows
   - Add user documentation

3. **Phase 3: Testing and Refinement (1 week)**
   - Comprehensive testing across devices
   - Edge case handling and error recovery
   - Performance optimization

4. **Phase 4: Deployment (1 week)**
   - Staged rollout to production
   - Monitoring and analytics
   - User feedback collection

Total estimated time: 4-5 weeks