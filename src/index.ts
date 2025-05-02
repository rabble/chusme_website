/// <reference types="@cloudflare/workers-types" />
import {
  createInvite,
  createWebInvite,
  createWebInvitePage,
  createShortUrlInvite,
  getInvite,
  getWebInvite,
  resolveShortCode,
  InviteData,
  WebInviteData
} from './invite-handler';

export interface Env {
  INVITES: KVNamespace;
  INVITE_TOKEN: string;
}

interface PageMetadata {
  title: string;
  description: string;
  image?: string;
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): { content: string, metadata: PageMetadata } {
  const metadata: PageMetadata = {
    title: "Rabble Community",
    description: "Private, ad-free spaces where you set the rules."
  };

  // Extract front matter
  let content = markdown;
  if (markdown.startsWith('---')) {
    const endOfFrontMatter = markdown.indexOf('---', 3);
    if (endOfFrontMatter !== -1) {
      const frontMatter = markdown.substring(3, endOfFrontMatter).trim();
      content = markdown.substring(endOfFrontMatter + 3).trim();
      
      // Parse front matter
      const titleMatch = frontMatter.match(/title:\s*"([^"]*)"/);
      if (titleMatch) metadata.title = titleMatch[1];
      
      const descMatch = frontMatter.match(/description:\s*"([^"]*)"/);
      if (descMatch) metadata.description = descMatch[1];
      
      const imageMatch = frontMatter.match(/image:\s*"([^"]*)"/);
      if (imageMatch) metadata.image = imageMatch[1];
    }
  }

  // Convert markdown to HTML
  // Headers
  content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  content = content.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Emphasis
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Links
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)(?:{\.([^}]+)})?/g, (match, text, url, className) => {
    if (className) {
      return `<a href="${url}" class="${className}">${text}</a>`;
    }
    return `<a href="${url}">${text}</a>`;
  });
  
  // Lists
  content = content.replace(/^\s*-\s*(.*$)/gm, '<li>$1</li>');
  content = content.replace(/(<li>.*<\/li>\n)+/g, function(match) {
    return '<ul>' + match + '</ul>';
  });
  
  // Tables
  content = content.replace(/^\|(.*)\|$/gm, '<tr>$1</tr>');
  content = content.replace(/<tr>(.*)<\/tr>/g, (match, content) => {
    const cells = content.split('|').map((cell: string) => cell.trim());
    let row = '<tr>';
    for (const cell of cells) {
      if (cell) {
        // Allow <br> tags in table cells
        row += `<td>${cell}</td>`;
      }
    }
    row += '</tr>';
    return row;
  });
  content = content.replace(/(<tr>.*<\/tr>\n)+/g, function(match) {
    return '<table>' + match + '</table>';
  });
  
  // Code blocks
  content = content.replace(/```([^`]*)\n([^`]*)```/g, '<pre><code class="language-$1">$2</code></pre>');
  content = content.replace(/`([^`]*)`/g, '<code>$1</code>');
  
  // Sections
  content = content.replace(/<section id="([^"]+)">(.*?)<\/section>/gs, '<section id="$1">$2</section>');
  
  // Details/summary
  content = content.replace(/<details>\s*<summary>(.*?)<\/summary>(.*?)<\/details>/gs, '<details><summary>$1</summary>$2</details>');
  
  // Quotes
  content = content.replace(/:::(quote|info|warning)\n([\s\S]*?):::/g, '<blockquote class="$1">$2</blockquote>');
  content = content.replace(/^>\s*(.*$)/gm, '<blockquote>$1</blockquote>');
  
  // Horizontal rule
  content = content.replace(/^---$/gm, '<hr>');
  
  // Paragraphs - handle after other conversions
  content = content.replace(/^([^<].*[^>])$/gm, '<p>$1</p>');
  
  // Remove empty paragraphs
  content = content.replace(/<p><\/p>/g, '');
  
  return { content, metadata };
}

const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateCode(length = 8): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return result;
}

// Static files for app-linking
const STATIC_FILES: Record<string, { content: string; contentType: string }> = {
  '/.well-known/assetlinks.json': {
    content: JSON.stringify([{
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'app.verse.prototype.plur',
        sha256_cert_fingerprints: ['YOUR_APP_FINGERPRINT_HERE']
      }
    }]),
    contentType: 'application/json'
  },
  '/apple-app-site-association': {
    content: JSON.stringify({
      applinks: {
        apps: [],
        details: [{
          appID: 'GZCZBKH7MY.app.verse.prototype.plur',
          paths: [
            '/i/*', 
            '/join/*', 
            '/join-community*',
            '/g/*'
          ],
          appIDs: ['GZCZBKH7MY.app.verse.prototype.plur'],
          components: [
            {
              "/": "/i/*",
              comment: "Matches any URL with a path that starts with /i/"
            },
            {
              "/": "/join/*",
              comment: "Matches any URL with a path that starts with /join/"
            },
            {
              "/": "/join-community*",
              comment: "Matches any URL with a path that starts with /join-community"
            },
            {
              "/": "/g/*",
              comment: "Matches any URL with a path that starts with /g/"
            }
          ]
        }]
      },
      webcredentials: {
        apps: ["GZCZBKH7MY.app.verse.prototype.plur"]
      }
    }),
    contentType: 'application/json'
  }
};

// Design tokens and CSS variables
const DESIGN_TOKENS = {
  colors: {
    primary: "#55407B",      // Soft purple (main brand color)
    secondary: "#FFF8F7",    // Light pink-ish background
    accent: "#E3D8F5",       // Lavender accent
    highlight: "#FFF8F7",    // Soft highlight
    surface: "#FFFFFF",      // White surface
    surfaceAlt: "#F8F6FD",   // Very light purple background
    textPrimary: "#1A1A1A",  // Dark text
    textSecondary: "#666666" // Medium gray text
  },
  typography: {
    fontFamily: "'Clarity City', 'Inter', sans-serif", 
    h1: { size: 48, weight: 700, lineHeight: 58 },
    body: { size: 16, weight: 400, lineHeight: 26 }
  },
  spacing: 8,
  radius: 16,
  shadow: "0 4px 20px rgba(85, 64, 123, 0.08)"
};

// Create a page layout with the provided content
function createPage(title: string, description: string, content: string, image?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Rabble Community</title>
  <meta name="description" content="${description}">
  ${image ? `<meta property="og:image" content="${image}">` : ''}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Rabble Community">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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
    }
    
    .header {
      background-color: #FFFFFF;
      color: var(--text-primary);
      padding: 1.25rem 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .hero-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 2rem;
      text-align: center;
    }
    
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    
    .logo::before {
      content: "";
      display: inline-block;
      width: 1.75rem;
      height: 1.75rem;
      background: var(--primary);
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
    }
    
    .nav-links li {
      margin-left: 2rem;
    }
    
    .nav-links a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }
    
    .button-primary {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    
    .button-primary:hover {
      opacity: 0.9;
    }
    
    .button-secondary {
      display: inline-block;
      background-color: var(--accent);
      color: var(--primary);
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    
    .button-secondary:hover {
      opacity: 0.9;
    }
    
    .hero {
      background-color: var(--primary);
      color: white;
      padding: 5rem 0;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }
    
    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .content {
      padding: 4rem 0;
    }
    
    .content h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--primary);
    }
    
    .content p {
      margin-bottom: 1.5rem;
    }
    
    .content ul {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    
    .content li {
      margin-bottom: 0.5rem;
    }
    
    .footer {
      background-color: var(--surfaceAlt);
      padding: 3rem 0;
      color: var(--textSecondary);
      text-align: center;
    }
    
    .footer p {
      margin-bottom: 1rem;
    }
    
    .footer a {
      color: var(--primary);
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .container, .hero-container {
        padding: 0 1rem;
      }
      
      .hero h1 {
        font-size: 2.25rem;
      }
      
      .hero p {
        font-size: 1.125rem;
      }
      
      .nav-links {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <a href="/" class="logo">Rabble</a>
        <ul class="nav-links">
          <li><a href="/blog">Blog</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/community">Community</a></li>
        </ul>
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
      <p>&copy; 2025 Verse PBC · All rights reserved</p>
      <p>
        <a href="/terms">Terms</a> · 
        <a href="/privacy">Privacy</a> · 
        <a href="/contact">Contact</a>
      </p>
    </div>
  </footer>
</body>
</html>`;
}

// Generate an HTML page for the invalid invite error
function createErrorPage(message: string): string {
  return createPage(
    "Invalid Invite",
    "This invite link is invalid or has expired.",
    `<div style="text-align: center; padding: 3rem 0;">
      <div style="background-color: #FFF1F0; color: #CF1124; border-radius: 8px; padding: 1rem; margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem;">Invite Error</h2>
        <p>${message}</p>
      </div>
      <p>Please contact the person who sent you this invite to get a new one.</p>
      <a href="/" class="button-primary" style="margin-top: 1rem;">Go Home</a>
    </div>`
  );
}

// Main worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle app-linking static files from hardcoded content
    if (STATIC_FILES[path]) {
      return new Response(STATIC_FILES[path].content, {
        headers: {
          'Content-Type': STATIC_FILES[path].contentType,
          'Cache-Control': 'public, max-age=86400',
        }
      });
    }
    
    // Handle static asset paths
    if (path.startsWith('/assets/') || path.startsWith('/static/')) {
      return new Response("Not found", { status: 404 });
    }
    
    // API endpoints
    if (path.startsWith('/api/')) {
      // Extract API path without the /api/ prefix
      const apiPath = path.slice(5);
      
      // Create a standard invite
      if (apiPath === 'invite' && request.method === 'POST') {
        try {
          // Check authorization (simple shared token)
          const authHeader = request.headers.get('Authorization');
          const token = authHeader?.split(' ')[1];
          
          if (token !== env.INVITE_TOKEN) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Parse request body
          const body = await request.json() as { 
            groupId: string; 
            relay: string;
            name?: string;
            description?: string;
            avatar?: string;
            creatorPubkey?: string;
          };
          
          // Validate required fields
          if (!body.groupId || !body.relay) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Create invite
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
            url: result.url
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
          // Check authorization
          const authHeader = request.headers.get('Authorization');
          const token = authHeader?.split(' ')[1];
          
          if (token !== env.INVITE_TOKEN) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Parse request body
          const body = await request.json() as { code: string };
          
          // Validate required fields
          if (!body.code) {
            return new Response(JSON.stringify({ error: 'Missing invite code' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Check if the invite exists
          const inviteData = await getInvite(env, body.code);
          if (!inviteData) {
            return new Response(JSON.stringify({ error: 'Invite not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Create short URL
          console.log(`Generating short URL for code: ${body.code}`);
          const shortResult = await createShortUrlInvite(env, body.code);
          console.log(`createShortInviteUrl result: ${shortResult.url}`);
          
          return new Response(JSON.stringify({
            shortCode: shortResult.shortCode,
            url: shortResult.url
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
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle short invite URLs (/j/)
    if (path.startsWith('/j/')) {
      try {
        const shortCode = path.slice(3); // Remove the /j/ prefix
        console.log(`Resolving short code: ${shortCode}`);
        
        if (!shortCode) {
          return new Response(createErrorPage('Invalid short invite URL'), {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // Resolve the short code to the full invite code
        const fullCode = await resolveShortCode(env, shortCode);
        console.log(`Short code ${shortCode} resolved to: ${fullCode}`);
        
        if (!fullCode) {
          return new Response(createErrorPage('This short invite link is invalid or has expired.'), {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // Redirect to the full invite URL
        return Response.redirect(`https://rabble.community/i/${fullCode}`, 302);
      } catch (error) {
        console.error('Error handling short URL:', error);
        return new Response(createErrorPage('An error occurred while processing this invite.'), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Handle standard invite URLs (/i/)
    if (path.startsWith('/i/')) {
      try {
        const code = path.slice(3); // Remove the /i/ prefix
        
        if (!code) {
          return new Response(createErrorPage('Invalid invite URL'), {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // Get invite data from KV
        const inviteData = await getInvite(env, code);
        
        if (!inviteData) {
          return new Response(createErrorPage('This invite link is invalid or has expired.'), {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // Construct deep link URI
        const deepLink = `plur://join-community?group-id=${inviteData.groupId}&code=${code}&relay=${encodeURIComponent(inviteData.relay)}`;
        
        // Redirect to Plur app/fallback
        return Response.redirect(deepLink, 302);
      } catch (error) {
        console.error('Error handling invite:', error);
        return new Response(createErrorPage('An error occurred while processing this invite.'), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Handle web invites (/join/)
    if (path.startsWith('/join/')) {
      try {
        const code = path.slice(6); // Remove the /join/ prefix
        
        if (!code) {
          return new Response(createErrorPage('Invalid web invite URL'), {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // Get web invite data from KV
        const webInviteData = await getWebInvite(env, code);
        
        if (!webInviteData) {
          return new Response(createErrorPage('This web invite link is invalid or has expired.'), {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // Generate web invite page HTML
        const html = createWebInvitePage(webInviteData, code);
        
        return new Response(html, {
          headers: { 'Content-Type': 'text/html' }
        });
      } catch (error) {
        console.error('Error handling web invite:', error);
        return new Response(createErrorPage('An error occurred while processing this web invite.'), {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Handle home page and other static content
    if (path === '/' || path === '/index.html') {
      const homepageContent = `
        <div class="hero">
          <div class="hero-container">
            <h1>Private spaces for your community</h1>
            <p>Rabble helps you create private, ad-free spaces where you set the rules.</p>
            <a href="#download" class="button-primary">Get Started</a>
          </div>
        </div>
        
        <div class="content">
          <div class="container">
            <h2>About Rabble</h2>
            <p>Rabble is a simple, privacy-focused platform for community conversations.</p>
            <ul>
              <li>Create private groups for your community</li>
              <li>Share invite links with friends and colleagues</li>
              <li>No ads, no tracking, no algorithms</li>
              <li>You own your data</li>
            </ul>
            
            <h2 id="download">Download Rabble</h2>
            <p>Rabble is available on iOS and Android.</p>
            <p>
              <a href="https://apps.apple.com/app/plur/id1234567890" class="button-primary">Download for iOS</a>
              <a href="https://play.google.com/store/apps/details?id=app.verse.prototype.plur" class="button-secondary" style="margin-left: 1rem;">Download for Android</a>
            </p>
          </div>
        </div>
      `;
      
      const html = createPage(
        "Rabble Community",
        "Private, ad-free spaces where you set the rules.",
        homepageContent
      );
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Handle blog and other static content paths
    if (path.startsWith('/blog/') || path === '/blog') {
      // This would typically load from KV or another source
      // For demo purposes, returning a simple message
      return new Response(createPage(
        "Blog",
        "Latest news and updates from the Rabble team",
        `<h1>Rabble Blog</h1>
        <p>This is where blog posts would be displayed...</p>`
      ), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Handle "About" page
    if (path === '/about') {
      return new Response(createPage(
        "About Rabble",
        "Learn about our mission and team",
        `<h1>About Rabble</h1>
        <p>Rabble is a privacy-first communication platform...</p>`
      ), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Fallback - return 404
    return new Response(createPage(
      "Page Not Found",
      "The requested page could not be found",
      `<div style="text-align: center; padding: 3rem 0;">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" class="button-primary" style="margin-top: 1rem;">Go Home</a>
      </div>`
    ), {
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    });
  }
};