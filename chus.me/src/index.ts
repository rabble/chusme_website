/// <reference types="@cloudflare/workers-types" />
import {
  createInvite,
  createWebInvite,
  createShortUrlInvite,
  getInvite,
  getWebInvite,
  resolveShortCode,
  createWebInvitePage, // Needed for /join route
  WebInviteData // Needed for /join route
} from './invite-handler'; // Updated import path

export interface Env {
  INVITES: KVNamespace;
  INVITE_TOKEN: string; // Keep INVITE_TOKEN if API endpoints remain here
}

// Design tokens and CSS variables - needed for createPage/createErrorPage
const DESIGN_TOKENS = {
  colors: {
    primary: "#000000",      // Black (main color for woodcut style)
    secondary: "#F5F1E9",    // Off-white paper texture background
    accent: "#5E452A",       // Wood brown accent
    highlight: "#FFFDF7",    // Cream highlight
    surface: "#F9F6F0",      // Natural paper surface
    surfaceAlt: "#EDEAE0",   // Slightly darker paper background
    textPrimary: "#000000",  // Black text
    textSecondary: "#3D3D3D" // Dark gray text
  },
  typography: {
    fontFamily: "'Alegreya', 'Crimson Pro', 'Georgia', serif", 
    h1: { size: 48, weight: 800, lineHeight: 58 },
    body: { size: 18, weight: 400, lineHeight: 28 }
  },
  spacing: 8,
  radius: 0,                // Sharp edges for woodcut style
  shadow: "none"            // No shadows for a flatter woodcut look
};

// Create a page layout with the provided content - needed for createErrorPage
function createPage(title: string, description: string, content: string, image?: string): string {
  // Using chus.me branding for error pages served from here
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Chus.me Links</title> 
  <meta name="description" content="${description}">
  ${image ? `<meta property="og:image" content="${image}">` : ''}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Chus.me Links">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700;800&family=Crimson+Pro:wght@400;600;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
  <style>
    :root {
      --primary: ${DESIGN_TOKENS.colors.primary};
      --secondary: ${DESIGN_TOKENS.colors.secondary};
      --accent: ${DESIGN_TOKENS.colors.accent};
      --highlight: ${DESIGN_TOKENS.colors.highlight};
      --surface: ${DESIGN_TOKENS.colors.surface};
      --surface-alt: ${DESIGN_TOKENS.colors.surfaceAlt};
      --text-primary: ${DESIGN_TOKENS.colors.textPrimary};
      --text-secondary: ${DESIGN_TOKENS.colors.textSecondary};
      --font-family: ${DESIGN_TOKENS.typography.fontFamily};
      --spacing: ${DESIGN_TOKENS.spacing}px;
      --radius: ${DESIGN_TOKENS.radius}px;
      --shadow: ${DESIGN_TOKENS.shadow};
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: var(--font-family);
      color: var(--text-primary);
      line-height: 1.6;
      background-color: var(--surface);
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%235e452a' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    }
    
    .header {
      background-color: var(--surface);
      color: var(--text-primary);
      padding: 1.25rem 0;
      border-bottom: 2px solid var(--primary);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
        
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary);
      text-decoration: none;
      display: flex;
      align-items: center;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .logo::before {
      content: "🔗"; // Link icon for chus.me
      display: inline-block;
      font-size: 1.75rem;
      margin-right: 0.75rem;
    }
    
    .content {
      padding: 4rem 0;
    }
        
    .footer {
      background-color: var(--primary);
      padding: 3rem 0;
      color: white;
      text-align: center;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    .footer p {
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    
    .footer a {
      color: white;
      text-decoration: none;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      transition: border-color 0.2s;
    }
    
    .footer a:hover {
      border-bottom: 1px solid rgba(255,255,255,1);
    }

    .button-primary {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border: 2px solid var(--primary);
      font-weight: 700;
      font-size: 1.125rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: background-color 0.2s;
    }
    
    .button-primary:hover {
      background-color: transparent;
      color: var(--primary);
    }

  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <a href="/" class="logo">Chus.me</a>
        <!-- No nav links needed for simple link service -->
      </nav>
    </div>
  </header>
  
  <main>
    <div class="content">
      <div class="container">
        ${content}
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 Chus.me · All rights reserved</p>
      <!-- Minimal footer for link service -->
    </div>
  </footer>
</body>
</html>`;
}

// Generate an HTML page for the invalid invite error
function createErrorPage(message: string): string {
  return createPage(
    "Invalid Link",
    "This link is invalid or has expired.",
    `<div style="text-align: center; padding: 3rem 0;">
      <div style="background-color: #FFF1F0; color: #CF1124; border-radius: 8px; padding: 1rem; margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem;">Link Error</h2>
        <p>${message}</p>
      </div>
      <p>Please check the link or contact the sender.</p>
      <a href="/" class="button-primary" style="margin-top: 1rem;">Go Home</a>
    </div>`
  );
}

const APPLE_APP_SITE_ASSOCIATION_CONTENT = `{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "GZCZBKH7MY.app.verse.prototype.plur",
        "paths": [
          "/i/*", 
          "/join/*", 
          "/j/*",
          "/join-community*",
          "/g/*"
        ],
        "components": [
          {
            "/": "/i/*",
            "comment": "Matches any URL with a path that starts with /i/"
          },
          {
            "/": "/join/*",
            "comment": "Matches any URL with a path that starts with /join/"
          },
          {
            "/": "/j/*",
            "comment": "Matches any URL with a path that starts with /j/ (short URL)"
          },
          {
            "/": "/join-community*",
            "comment": "Matches any URL with a path that starts with /join-community"
          },
          {
            "/": "/g/*",
            "comment": "Matches any URL with a path that starts with /g/"
          }
        ]
      }
    ]
  },
  "webcredentials": {
    "apps": ["GZCZBKH7MY.app.verse.prototype.plur"]
  }
}`;

const ASSETLINKS_JSON_CONTENT = `[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "app.verse.prototype.plur",
    "sha256_cert_fingerprints":
    ["6F:36:C3:68:74:18:5E:03:B4:79:3D:82:EF:54:CE:34:26:ED:6E:C8:12:B7:CD:E2:F4:FA:9C:81:2F:C7:14:F4"]
  }
}]`;

// Main worker for chus.me (invite/shortlink handling)
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle .well-known paths for app linking
    if (path === '/.well-known/apple-app-site-association') {
      return new Response(APPLE_APP_SITE_ASSOCIATION_CONTENT, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path === '/.well-known/assetlinks.json') {
      return new Response(ASSETLINKS_JSON_CONTENT, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // API endpoints
    if (path.startsWith('/api/')) {
      const apiPath = path.slice(5);
      
      // Create a standard invite
      if (apiPath === 'invite' && request.method === 'POST') {
        try {
          const authHeader = request.headers.get('Authorization');
          const token = authHeader?.split(' ')[1];
          
          if (token !== env.INVITE_TOKEN) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const body = await request.json() as { 
            groupId: string; 
            relay: string;
            name?: string;
            description?: string;
            avatar?: string;
            creatorPubkey?: string;
          };
          
          if (!body.groupId || !body.relay) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          let result;
          const hasMetadata = !!(body.name || body.description || body.avatar);
          
          if (hasMetadata) {
            // Create web invite with metadata
            result = await createWebInvite(env, body.groupId, body.relay, {
              name: body.name,
              description: body.description,
              avatar: body.avatar,
              creatorPubkey: body.creatorPubkey
            });
            console.log(`Created web invite: ${result.code}`);
          } else {
            // Create standard invite
            result = await createInvite(env, body.groupId, body.relay);
            console.log(`Created invite: ${result.code}`);
          }
          
          return new Response(JSON.stringify({
            code: result.code,
            url: result.url // URL is now correctly generated by invite-handler
          }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error creating invite:', error);
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Create a short URL for an existing invite
      if (apiPath === 'shorturl' && request.method === 'POST') {
        try {
          const authHeader = request.headers.get('Authorization');
          const token = authHeader?.split(' ')[1];
          
          if (token !== env.INVITE_TOKEN) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const body = await request.json() as { code: string };
          
          if (!body.code) {
            return new Response(JSON.stringify({ error: 'Missing invite code' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const inviteData = await getInvite(env, body.code);
          if (!inviteData) {
            // Also check if it's a web invite code
            const webInviteData = await getWebInvite(env, body.code);
            if (!webInviteData) {
              return new Response(JSON.stringify({ error: 'Invite not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          }
          
          console.log(`Generating short URL for code: ${body.code}`);
          const shortResult = await createShortUrlInvite(env, body.code);
          console.log(`createShortInviteUrl result: ${shortResult.url}`);
          
          return new Response(JSON.stringify({
            shortCode: shortResult.shortCode,
            url: shortResult.url // URL is now correctly generated by invite-handler
          }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error creating short URL:', error);
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Default API response
      return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle short invite URLs (/j/)
    if (path.startsWith('/j/')) {
      try {
        const shortCode = path.slice(3); 
        console.log(`Resolving short code: ${shortCode}`);
        
        if (!shortCode) {
          return new Response(createErrorPage('Invalid short invite URL'), {
            headers: { 'Content-Type': 'text/html' }, status: 400
          });
        }
        
        const fullCode = await resolveShortCode(env, shortCode);
        console.log(`Short code ${shortCode} resolved to: ${fullCode}`);
        
        if (!fullCode) {
          return new Response(createErrorPage('This short invite link is invalid or has expired.'), {
            headers: { 'Content-Type': 'text/html' }, status: 404
          });
        }
        
        // Redirect to the full invite URL on chus.me domain
        // Decide if it should be /i/ (deep link) or /join/ (web page)
        const webInviteData = await getWebInvite(env, fullCode);
        if (webInviteData) {
          // It's a web invite, redirect to the join page on chus.me
          const redirectUrl = new URL(`/join/${fullCode}`, url.origin);
          return Response.redirect(redirectUrl.toString(), 302);
        } else {
          // Assume it's a standard invite, redirect to the /i/ path on chus.me
          // This path will handle the plur:// redirect
          const redirectUrl = new URL(`/i/${fullCode}`, url.origin);
          return Response.redirect(redirectUrl.toString(), 302);
        }
        
      } catch (error) {
        console.error('Error handling short URL:', error);
        return new Response(createErrorPage('An error occurred while processing this invite.'), {
          headers: { 'Content-Type': 'text/html' }, status: 500
        });
      }
    }
    
    // Handle standard invite URLs (/i/)
    if (path.startsWith('/i/')) {
      try {
        const code = path.slice(3);
        
        if (!code) {
          return new Response(createErrorPage('Invalid invite URL'), {
            headers: { 'Content-Type': 'text/html' }, status: 400
          });
        }
        
        const inviteData = await getInvite(env, code);
        
        if (!inviteData) {
          return new Response(createErrorPage('This invite link is invalid or has expired.'), {
            headers: { 'Content-Type': 'text/html' }, status: 404
          });
        }
        
        // Construct deep link URI
        const deepLink = `plur://join-community?group-id=${inviteData.groupId}&code=${code}&relay=${encodeURIComponent(inviteData.relay)}`;
        
        // Redirect to Plur app
        return Response.redirect(deepLink, 302);
      } catch (error) {
        console.error('Error handling invite:', error);
        return new Response(createErrorPage('An error occurred while processing this invite.'), {
          headers: { 'Content-Type': 'text/html' }, status: 500
        });
      }
    }
    
    // Handle web invites (/join/)
    if (path.startsWith('/join/')) {
      try {
        const code = path.slice(6);
        
        if (!code) {
          return new Response(createErrorPage('Invalid web invite URL'), {
            headers: { 'Content-Type': 'text/html' }, status: 400
          });
        }
        
        const webInviteData = await getWebInvite(env, code);
        
        if (!webInviteData) {
          return new Response(createErrorPage('This web invite link is invalid or has expired.'), {
            headers: { 'Content-Type': 'text/html' }, status: 404
          });
        }
        
        // Generate web invite page HTML using the function from invite-handler
        // Ensure invite-handler uses updated URLs/branding
        const html = createWebInvitePage(webInviteData, code);
        
        return new Response(html, {
          headers: { 'Content-Type': 'text/html' }
        });
      } catch (error) {
        console.error('Error handling web invite:', error);
        return new Response(createErrorPage('An error occurred while processing this web invite.'), {
          headers: { 'Content-Type': 'text/html' }, status: 500
        });
      }
    }

    // Handle vanity URLs like /@username or /npub... (Placeholder)
    if (path.startsWith('/@') || path.startsWith('/npub1')) {
       // TODO: Implement lookup and redirect based on hosting plan
       // Example: /@alice -> lookup alice -> redirect to chusme.app/u/alice-did
       // Example: /npub... -> redirect to chusme.app/post/note...
       return new Response(`Vanity URL/Nostr redirect placeholder for ${path}`, { status: 501 });
    }

    // Default response for chus.me (maybe a simple info page or redirect)
    if (path === '/') {
       const rootContent = `<p>This is the short link service for <a href="https://chusme.social" target="_blank">chusme.social</a>.</p>`;
       return new Response(createPage('Chus.me Links', 'Chusme Shortlink Service', rootContent), {
         headers: { 'Content-Type': 'text/html' }
       });
    }
    
    // Catch-all 404
    return new Response(createErrorPage('Page not found.'), {
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    });
  },
}; 