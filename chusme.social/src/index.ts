/// <reference types="@cloudflare/workers-types" />

// Note: This might need access to KV if markdown files are stored there
export interface Env {
  // INVITES: KVNamespace; // Not needed for landing page
  // INVITE_TOKEN: string; // Not needed
}

interface PageMetadata {
  title: string;
  description: string;
  image?: string;
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): { content: string, metadata: PageMetadata } {
  const metadata: PageMetadata = {
    title: "Chusme Social", // Default title
    description: "Authentic communities built on care and connection."
  };

  // Extract front matter (remains the same)
  let content = markdown;
  if (markdown.startsWith('---')) {
    const endOfFrontMatter = markdown.indexOf('---', 3);
    if (endOfFrontMatter !== -1) {
      const frontMatter = markdown.substring(3, endOfFrontMatter).trim();
      content = markdown.substring(endOfFrontMatter + 3).trim();
      
      const titleMatch = frontMatter.match(/title:\s*"([^"]*)"/);
      if (titleMatch) metadata.title = titleMatch[1];
      
      const descMatch = frontMatter.match(/description:\s*"([^"]*)"/);
      if (descMatch) metadata.description = descMatch[1];
      
      const imageMatch = frontMatter.match(/image:\s*"([^"]*)"/);
      if (imageMatch) metadata.image = imageMatch[1];
    }
  }

  // Markdown conversion rules (remain the same)
  content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  content = content.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)(?:{\.([^}]+)})?/g, (match, text, url, className) => {
    if (className) {
      return `<a href="${url}" class="${className}">${text}</a>`;
    }
    return `<a href="${url}">${text}</a>`;
  });
  content = content.replace(/^\s*-\s*(.*$)/gm, '<li>$1</li>');
  content = content.replace(/(<li>.*<\/li>\n)+/g, function(match) {
    return '<ul>' + match + '</ul>';
  });
  content = content.replace(/^\|(.*)\|$/gm, '<tr>$1</tr>');
  content = content.replace(/<tr>(.*)<\/tr>/g, (match, content) => {
    const cells = content.split('|').map((cell: string) => cell.trim());
    let row = '<tr>';
    for (const cell of cells) {
      if (cell) {
        row += `<td>${cell}</td>`;
      }
    }
    row += '</tr>';
    return row;
  });
  content = content.replace(/(<tr>.*<\/tr>\n)+/g, function(match) {
    return '<table>' + match + '</table>';
  });
  content = content.replace(/```([^`]*)\n([^`]*)```/g, '<pre><code class="language-$1">$2</code></pre>');
  content = content.replace(/`([^`]*)`/g, '<code>$1</code>');
  content = content.replace(/<section id="([^"]+)">(.*?)<\/section>/gs, '<section id="$1">$2</section>');
  content = content.replace(/<details>\s*<summary>(.*?)<\/summary>(.*?)<\/details>/gs, '<details><summary>$1</summary>$2</details>');
  content = content.replace(/:::(quote|info|warning)\n([\s\S]*?):::/g, '<blockquote class="$1">$2</blockquote>');
  content = content.replace(/^>\s*(.*$)/gm, '<blockquote>$1</blockquote>');
  content = content.replace(/^---$/gm, '<hr>');
  content = content.replace(/^([^<].*[^>])$/gm, '<p>$1</p>');
  content = content.replace(/<p><\/p>/g, '');
  
  return { content, metadata };
}

// Static files for app-linking (relevant to the public-facing domain)
const STATIC_FILES: Record<string, { content: string; contentType: string }> = {
  '/.well-known/assetlinks.json': {
    content: JSON.stringify([{
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'app.chusme.app', // Updated package name
        sha256_cert_fingerprints: ['YOUR_APP_FINGERPRINT_HERE'] // Needs actual fingerprint
      }
    }]),
    contentType: 'application/json'
  },
  '/apple-app-site-association': {
    content: JSON.stringify({
      applinks: {
        apps: [], // This should usually be empty
        details: [{
          // Assuming GZCZBKH7MY was a placeholder Team ID. Replace with actual.
          appID: 'GZCZBKH7MY.app.chusme.app', // Updated bundle ID with correct Team ID
          paths: [
            '/i/*', 
            '/join/*', 
            '/join-community*',
            '/g/*'
            // Potentially add paths relevant to chusme.app if needed for universal links
          ],
          // Older format, sometimes needed for compatibility
          appIDs: ['GZCZBKH7MY.app.chusme.app'], 
          components: [
            {
              "/": "/i/*",
              comment: "Matches invite links handled by chus.me or chusme.app"
            },
            {
              "/": "/join/*",
              comment: "Matches web invite links handled by chus.me or chusme.app"
            },
            // Add other paths as needed
          ]
        }]
      },
      webcredentials: {
        // List the app bundle ID that can use web credentials associated with this domain
        apps: ["GZCZBKH7MY.app.chusme.app"]
      }
    }),
    contentType: 'application/json'
  },
   // Placeholder for nostr.json - NIP-05
  '/.well-known/nostr.json': {
     content: JSON.stringify({
       names: {
         // Add verified usernames here, e.g.:
         // "your_username": "your_nostr_public_key_hex"
       }
       // You might also include relays here if desired
       // "relays": {
       //   "your_nostr_public_key_hex": ["wss://relay.example.com"]
       // }
     }),
     contentType: 'application/json'
  },
  // Placeholder for did.json - ATProto handle resolution
  '/.well-known/did.json': {
    content: JSON.stringify({
      // The DID that this handle resolves to
      // Example:
      // "did": "did:plc:your_did_here"
    }),
    contentType: 'application/json'
  }
};

// Design tokens and CSS variables (can be shared or customized for chusme.social)
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

// Create a page layout with the provided content
function createPage(title: string, description: string, content: string, image?: string): string {
  // Using chusme.social branding
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Chusme Social</title> 
  <meta name="description" content="${description}">
  ${image ? `<meta property="og:image" content="${image}">` : ''}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Chusme Social"> 
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
      content: "🗣️"; // Speech bubble for chusme.social
      display: inline-block;
      font-size: 1.75rem;
      margin-right: 0.75rem;
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
      font-weight: 600;
      font-size: 1.125rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-bottom: 3px;
      border-bottom: 2px solid transparent;
      transition: border-color 0.2s;
    }
    
    .nav-links a:hover {
      border-bottom: 2px solid var(--primary);
    }
    
    .content {
      padding: 4rem 0;
    }
    
    .content h1, .content h2, .content h3 {
      color: var(--primary);
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 1.5rem;
    }

    .content h1 {
      font-size: 2.5rem;
      text-transform: uppercase;
    }
    
    .content h2 {
      font-size: 2.25rem;
      text-transform: uppercase;
      border-bottom: 3px solid var(--primary);
      display: inline-block;
      padding-bottom: 0.5rem;
    }

    .content h3 {
        font-size: 1.75rem;
    }
    
    .content p {
      margin-bottom: 1.75rem;
      font-size: 1.125rem;
      line-height: 1.7;
    }
    
    .content ul {
      margin-bottom: 2rem;
      padding-left: 1.25rem;
      list-style-type: none;
    }
    
    .content li {
      margin-bottom: 0.75rem;
      font-size: 1.125rem;
      position: relative;
      padding-left: 1.5rem;
    }
    
    .content li::before {
      content: "🗣️";
      position: absolute;
      left: 0;
      top: 0;
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
    
    @media (max-width: 768px) {
      .container, .hero-container {
        padding: 0 1rem;
      }
            
      .nav-links {
        display: none; /* Hide nav links on mobile, consider a burger menu */
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <a href="/" class="logo">Chusme</a> 
        <ul class="nav-links">
          <li><a href="/about">About</a></li> 
          <li><a href="/community">Community</a></li>
          <li><a href="/design-principles">Design Principles</a></li>
          <li><a href="https://chusme.app" target="_blank">Open App</a></li>
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
      <p>&copy; 2025 Chusme.social · All rights reserved</p> 
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

// Main worker for chusme.social (landing page, static files, markdown pages)
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle app-linking and protocol-specific static files
    if (STATIC_FILES[path]) {
      return new Response(STATIC_FILES[path].content, {
        headers: {
          'Content-Type': STATIC_FILES[path].contentType,
          'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        }
      });
    }
    
    // Redirects based on the hosting plan
    if (path === '/app') {
        return Response.redirect('https://chusme.app', 301);
    }
    if (path === '/join') {
        // Redirect to the shortlink service invite path
        return Response.redirect('https://chus.me/invite', 301); // Assuming chus.me handles /invite
    }
    if (path === '/github') {
        // Redirect to your GitHub org or repo
        return Response.redirect('https://github.com/verse-pbc/plur', 301); // Updated URL
    }

    // Handle static asset paths (e.g., images)
    if (path.startsWith('/static/assets/')) {
      const fileName = path.split('/').pop() || '';
      
      // Map for Cloudflare Images
      const cloudflareImagesMap: Record<string, string> = {
        'community-focused.png': 'fc67aea6-a6c6-4cb9-8480-5db260218b00', 
        'user-control.png': '0de45bbc-c804-4ef1-9a5b-df668a4a1e00',    
        'privacy-first.png': 'c14148d3-18eb-44a9-133b-48f883ad3500',     
        'not-entertainment.png': '2857264c-f538-492a-c0a3-657012ecb000',
        'not-product.png': '510cc54c-cd4a-40b2-bce3-effb502d2000',      
        'authentic-connections.png': 'fc67aea6-a6c6-4cb9-8480-5db260218b00',
        'asks_offers.png': 'fc67aea6-a6c6-4cb9-8480-5db260218b00',
        'chat.png': '0de45bbc-c804-4ef1-9a5b-df668a4a1e00',
        'events.png': 'c14148d3-18eb-44a9-133b-48f883ad3500',
        'posting_event.png': '2857264c-f538-492a-c0a3-657012ecb000',
        'posts.png': '510cc54c-cd4a-40b2-bce3-effb502d2000'
      };
      
      // Check for iOS screenshots first (jpg files)
      if (path.startsWith('/static/assets/ios/') && fileName.endsWith('.jpg')) {
        const isProduction = !request.url.includes('localhost'); // Simple prod check
        
        if (isProduction) {
          // In production, we would use Cloudflare images or another CDN
          return Response.redirect(`https://your-cdn-url/${fileName}`, 302);
        } else {
          // For local development, we'll serve a more realistic iPhone mockup SVG
          // that shows the filename to simulate the actual screenshot
          const screenshotName = fileName.replace(/[-_]/g, ' ').replace('.jpg', '');
          
          // Generate a unique color based on the filename for visual distinction
          const getHashColor = (text: string) => {
            let hash = 0;
            for (let i = 0; i < text.length; i++) {
              hash = text.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = '#';
            for (let i = 0; i < 3; i++) {
              const value = (hash >> (i * 8)) & 0xFF;
              color += ('00' + value.toString(16)).substr(-2);
            }
            return color;
          };
          
          const bgColor = getHashColor(fileName);
          
          // Create an SVG that looks like an iPhone with the screenshot name
          const iphoneSvg = `<svg width="390" height="800" xmlns="http://www.w3.org/2000/svg">
            <!-- iPhone frame -->
            <rect width="390" height="800" rx="50" ry="50" fill="#111111"/>
            
            <!-- Screen background -->
            <rect x="20" y="20" width="350" height="760" rx="35" ry="35" fill="#FFFFFF"/>
            
            <!-- Content area with unique color based on filename -->
            <rect x="20" y="20" width="350" height="760" rx="35" ry="35" fill="${bgColor}" opacity="0.1"/>
            
            <!-- Notch -->
            <path d="M120,20 L270,20 C270,20 280,20 280,30 L280,50 C280,60 270,60 270,60 L120,60 C120,60 110,60 110,50 L110,30 C110,20 120,20 120,20 Z" fill="#111111"/>
            
            <!-- Home indicator -->
            <rect x="155" y="765" width="80" height="5" rx="2.5" ry="2.5" fill="#111111"/>
            
            <!-- iPhone buttons (side) -->
            <rect x="0" y="150" width="5" height="60" rx="2" ry="2" fill="#333333"/>
            <rect x="0" y="230" width="5" height="40" rx="2" ry="2" fill="#333333"/>
            <rect x="0" y="290" width="5" height="40" rx="2" ry="2" fill="#333333"/>
            <rect x="385" y="180" width="5" height="80" rx="2" ry="2" fill="#333333"/>
            
            <!-- Screenshot name -->
            <text x="195" y="400" font-family="Arial" font-size="28" font-weight="bold" text-anchor="middle" fill="#333333">${screenshotName}</text>
            
            <!-- App UI simulation -->
            <rect x="35" y="70" width="320" height="50" rx="8" ry="8" fill="#F7F7F7" stroke="#E5E5E5" stroke-width="1"/>
            <text x="55" y="103" font-family="Arial" font-size="18" fill="#333333">Chusme</text>
            
            <!-- Simulate content -->
            <rect x="40" y="140" width="310" height="580" rx="8" ry="8" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="1"/>
          </svg>`;
          
          return new Response(iphoneSvg, {
            headers: {
              'Content-Type': 'image/svg+xml',
              'Cache-Control': 'public, max-age=3600'
            }
          });
        }
      }
      
      // If we have a Cloudflare Image, redirect to it
      if (cloudflareImagesMap[fileName]) {
        const isProduction = !request.url.includes('localhost'); // Simple prod check
        if (isProduction) {
          const accountHash = 'U9c1NKydsjSHWVgWsUp4Yg'; // Your Cloudflare account hash
          const imageId = cloudflareImagesMap[fileName];
          const imageVariant = 'public';
          return Response.redirect(`https://imagedelivery.net/${accountHash}/${imageId}/${imageVariant}`, 302);
        } else {
          // In local dev, attempt to serve from a local path (requires separate handling)
          // return Response.redirect(`/local-assets/${fileName}`, 302); // Placeholder
        }
      }
      
      // Fallback SVG placeholders for missing images
      const baseBgColor = '#5d4037'; 
      let icon = '🖼️'; // Generic image icon
      let mainColor = baseBgColor;
      // ... (icon/color logic based on fileName - can keep or simplify)
      
      const svgPlaceholder = `<svg width="300" height="500" xmlns="http://www.w3.org/2000/svg">
         <rect width="100%" height="100%" fill="${mainColor}" opacity="0.1"/>
         <text x="150" y="250" font-family="Arial" font-size="72" text-anchor="middle" dominant-baseline="middle">${icon}</text>
         <text x="150" y="350" font-family="Arial" font-size="18" fill="${mainColor}" text-anchor="middle">
           ${fileName.replace(/[-_]/g, ' ').replace('.png', '')}
         </text>
         <text x="150" y="450" font-family="Arial" font-size="14" fill="${mainColor}" text-anchor="middle">
           chusme.social
         </text>
       </svg>`;
      
      return new Response(svgPlaceholder, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    // Handle home page (using the previously hardcoded HTML, now updated)
    if (path === '/' || path === '/index.html') {
      const landingPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chusme - Authentic Communities</title> 
    <style>
        :root {
            --primary-color: #5d4037;
            --secondary-color: #3e2723;
            --accent-color: #8d6e63;
            --text-color: #3e2723;
            --light-bg: #efebe9;
            --dark-bg: #3e2723;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', Courier, monospace;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--light-bg);
            position: relative;
        }
        
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: var(--secondary-color);
            color: white;
            padding: 2rem 0;
            text-align: center;
            border-bottom: 5px solid var(--accent-color);
            position: relative;
        }
        
        header::after {
            content: "";
            position: absolute;
            bottom: -15px;
            left: 0;
            width: 100%;
            height: 10px;
            background: repeating-linear-gradient(
                90deg,
                var(--accent-color),
                var(--accent-color) 15px,
                transparent 15px,
                transparent 30px
            );
        }
        
        .hero {
            padding: 4rem 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        .hero p {
            font-size: 1.2rem;
            max-width: 800px;
            margin: 0 auto 2rem;
        }
        
        section {
            padding: 3rem 0;
        }
        
        h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: var(--secondary-color);
            text-align: center;
        }
        
        h3 {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            color: var(--primary-color);
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .feature-card {
            background-color: rgba(255, 255, 255, 0.85);
            border: 2px solid var(--secondary-color);
            border-radius: 0;
            padding: 2rem;
            box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
        }
                
        .feature-image {
            max-width: 100%;
            height: auto;
            margin-bottom: 1.5rem;
            border: 1px solid var(--secondary-color);
        }
        
        .feature-card h3 {
            margin-bottom: 1rem;
        }
        
        .bill-of-rights {
            background-color: var(--dark-bg);
            color: white;
            padding: 3rem 0;
            position: relative;
            border-top: 3px solid var(--accent-color);
            border-bottom: 3px solid var(--accent-color);
        }
        
        .bill-of-rights::before, .bill-of-rights::after {
            content: "";
            position: absolute;
            left: 0;
            width: 100%;
            height: 15px;
            background-image: 
                linear-gradient(45deg, var(--accent-color) 25%, transparent 25%),
                linear-gradient(-45deg, var(--accent-color) 25%, transparent 25%);
            background-size: 20px 20px;
        }
        
        .bill-of-rights::before {
            top: -15px;
        }
        
        .bill-of-rights::after {
            bottom: -15px;
        }
        
        .rights-list {
            list-style: none;
            margin-top: 2rem;
        }
        
        .rights-list li {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .rights-list li:before {
            content: "★";
            position: absolute;
            left: 0;
            color: var(--accent-color);
            font-size: 1.2em;
        }
        
        .mission-section {
            background-color: var(--light-bg);
            text-align: center;
            padding: 4rem 0;
        }
        
        .mission-statement {
            font-size: 1.5rem;
            max-width: 800px;
            margin: 0 auto;
            font-style: italic;
        }
        
        .cta {
            background: var(--secondary-color);
            color: white;
            text-align: center;
            padding: 4rem 0;
            border-top: 5px solid var(--accent-color);
            position: relative;
        }
        
        .cta::before {
            content: "";
            position: absolute;
            top: -15px;
            left: 0;
            width: 100%;
            height: 10px;
            background: repeating-linear-gradient(
                90deg,
                var(--accent-color),
                var(--accent-color) 15px,
                transparent 15px,
                transparent 30px
            );
        }
        
        .cta h2 {
            color: white;
        }
        
        .btn {
            display: inline-block;
            background-color: var(--accent-color);
            color: white;
            padding: 0.8rem 2rem;
            border: 2px solid white;
            text-decoration: none;
            font-weight: bold;
            margin-top: 1.5rem;
            transition: all 0.3s ease;
            position: relative;
            box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
        }
        
        .btn:hover {
            background-color: white;
            color: var(--secondary-color);
            transform: translateY(-3px);
            box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.2);
        }
        
        footer {
            background-color: var(--dark-bg);
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            h2 {
                font-size: 2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
            
            .feature-card {
                margin-bottom: 2rem;
            }
            
            header::after, .cta::before, .bill-of-rights::before, .bill-of-rights::after {
                background-size: 15px 15px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Chusme</h1> 
            <p>Authentic Communities Built on Care and Connection</p>
            <a href="https://chusme.app" style="display: inline-block; margin-top: 15px; background-color: white; color: var(--secondary-color); padding: 8px 20px; text-decoration: none; font-weight: bold; border: none;">Launch Chusme App</a> 
        </div>
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>Signal for Facebook Groups</h1> 
            <p>Chusme is a communities app being built on open protocols like Nostr, putting users in control of their online social experience.</p>
            <div style="margin-top: 30px;">
                <a href="https://chusme.app" style="display: inline-block; background-color: var(--accent-color); color: white; padding: 12px 25px; font-size: 1.2rem; text-decoration: none; font-weight: bold; border: 2px solid var(--accent-color);">Try Chusme Now</a> 
                <p style="margin-top: 10px; font-size: 0.9rem;">Web app available now. iOS and Android apps coming soon.</p>
            </div>
        </div>
    </section>
    
    <section class="mission-section">
        <div class="container">
            <h2>Our Mission</h2>
            <p class="mission-statement">Our mission is to enable authentic, online communities built on care, connection, and sustainable relationships.</p>
        </div>
    </section>
    
    <section>
        <div class="container">
            <h2>Why Chusme?</h2> 
            <p>We believe in a future where communities everywhere are empowered to organize and create positive social change. Built on open protocols, Chusme offers alternatives to traditional platforms like Facebook Groups, WhatsApp, and Slack.</p>
            
            <div class="features">
                <div class="feature-card">
                    <img src="/static/assets/community-focused.png" alt="Community-Focused" class="feature-image">
                    <h3>Community-Focused</h3>
                    <p>Chusme is a social app, not a social media app. We focus on active engagement with other people versus passive consumption of content.</p>
                </div>
                
                <div class="feature-card">
                    <img src="/static/assets/user-control.png" alt="User Control" class="feature-image">
                    <h3>User Control</h3>
                    <p>You own your data and connections. Interact freely across compatible apps on open protocols. You decide what you see.</p>
                </div>
                
                <div class="feature-card">
                    <img src="/static/assets/privacy-first.png" alt="Privacy First" class="feature-image">
                    <h3>Privacy First</h3>
                    <p>Prioritizing your privacy for secure group communication. Your online experiences should be fulfilling and positive.</p>
                </div>
                <div class="feature-card">
                    <img src="/static/assets/authentic-connections.png" alt="Authentic Connections" class="feature-image">
                    <h3>Authentic Connections</h3>
                    <p>Chusme helps foster genuine relationships by focusing on shared interests and meaningful interactions within groups.</p>
                </div>
                <div class="feature-card">
                    <img src="/static/assets/not-entertainment.png" alt="Purposeful Interaction" class="feature-image">
                    <h3>Purposeful Interaction</h3>
                    <p>Designed for coordination and collaboration, not endless scrolling. Tools for events, asks/offers, and focused discussions.</p>
                </div>
                <div class="feature-card">
                    <img src="/static/assets/not-product.png" alt="You Are Not The Product" class="feature-image">
                    <h3>You Are Not The Product</h3>
                    <p>No ads, no algorithms manipulating your feed. Built on sustainable models that respect user agency.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="bill-of-rights">
        <div class="container">
            <h2>User Bill of Rights</h2>
            <ul class="rights-list">
                <li>Right to Own Your Data & Identity</li>
                <li>Right to Free Association & Speech</li>
                <li>Right to Privacy & Security</li>
                <li>Right to Algorithmic Transparency</li>
                <li>Right to Interoperability & Portability</li>
            </ul>
        </div>
    </section>
    
    <section class="cta">
        <div class="container">
            <h2>Ready to Build Real Community?</h2>
            <p>Join thousands of communities already connecting on Chusme</p> 
            <a href="https://chusme.app" class="btn">Use Chusme Now</a> 
            <p style="margin-top: 20px; font-size: 1.1rem;">Access the web app at <a href="https://chusme.app" style="color: white; text-decoration: underline;">chusme.app</a> — iOS and Android apps coming soon!</p>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>&copy; 2025 Chusme.social. All rights reserved.</p> 
        </div>
    </footer>
</body>
</html>`;
      return new Response(landingPageHtml, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Handle favicon.ico request
    if (path === '/favicon.ico') {
      // Return a simple SVG favicon
      const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#5d4037" rx="20" ry="20" />
        <text x="50" y="70" font-family="Arial" font-size="60" text-anchor="middle" fill="white">🗣️</text>
      </svg>`;
      
      return new Response(svgFavicon, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }
    
    // Handle other paths (e.g., /about, /blog, /privacy) by trying to render markdown
    // This assumes markdown files exist at the root or a known location
    // You might need to adjust the path logic based on your project structure
    try {
      // Example: Fetch markdown from a hypothetical source (e.g., GitHub Gist, KV, R2)
      // Replace this with your actual markdown fetching logic
      let markdownContent = "";
      const pageName = path.slice(1); // Remove leading slash
      
      // Basic security check: allow only alphanumeric paths for markdown rendering
      if (pageName !== '' && !/^[a-zA-Z0-9_-]+$/.test(pageName)) {
          throw new Error('Invalid path');
      } 
      
      // Placeholder: Fetch markdown based on path
      if (pageName === 'about') {
          markdownContent = `
---
title: "About Chusme"
description: "Learn more about the mission and vision behind Chusme."
---
# About Chusme

Chusme is more than just an app; it's a movement towards healthier online communities...
`;
      } else if (pageName === 'community') {
          markdownContent = `
---
title: "Chusme Community"
description: "Connect with the Chusme community, contribute, and get support."
---
# Join the Chusme Community

Find us on [GitHub](https://github.com/your-org/chusme-project) (replace with actual link)...
`;
      } else if (pageName === 'design-principles') {
          // Read the design principles content from our new file
          try {
              // In a production environment, you'd fetch this from your storage
              // For now, we'll use the file we created
              markdownContent = `---
title: "Design Principles"
description: "Abstract guiding concepts that can shape Plur's development while still being grounded in real community steward experiences"
---

# Design Principles

"Abstract guiding concepts that can shape Plur's development while still being grounded in real community steward experiences".

## 1. Community Before Scale

Communities thrive when they prioritize depth of connection over rapid growth. The goal of Plur should not be just maximizing user numbers but fostering meaningful engagement. As seen in Cressida's equestrian group, maintaining high standards of behavior led to a more supportive space—even at the cost of removing members​.

→ Design for strong community cultures, not just audience growth.

## 2. Stewardship, Not Just Moderation

Healthy communities require active care, not just content policing. AI-driven moderation, like Facebook's AI Assist, has shown that automating enforcement without human context can backfire​. Community leaders act as stewards, guiding norms and fostering participation.

→ Empower community leaders with tools that help them shape, not just police, discussions.

## 3. Ownership and Stability Over Virality

Social platforms often prioritize short-term engagement (likes, comments, trends) over long-term community resilience. Many community leaders, like Cressida and Josh, have struggled with platform volatility, unexpected shutdowns, and algorithm shifts​​.

→ Build for longevity, ensuring communities can persist and evolve beyond algorithmic whims.

## 4. Participation is a Spectrum

Not all members engage in the same way—some lurk, some contribute occasionally, and some lead. Many platforms fail by focusing only on active users, leaving passive participants behind. Communities like Women Who Code found that informal interactions (e.g., icebreaker bots) helped passive members stay engaged​.

→ Design for multiple levels of participation, from quiet observers to active organizers.

## 5. Make Contribution Frictionless

Communities often struggle with siloed financial transactions, unclear pathways to contribute, and reliance on external payment platforms​​. Whether it's monetary contributions, event RSVPs, or skill-sharing, reducing friction makes generosity easier.

→ Foster a culture of giving by making contribution effortless, whether financial or social.

## 6. Conversation Should Be Navigable, Not Ephemeral

Many current platforms treat discussion as fleeting streams (WhatsApp, Slack, Telegram), making it hard to find important past conversations. Community leaders like Rachel struggled with vanishing or buried posts on Facebook​.

→ Design for lasting, searchable, and structured conversations, not just fleeting updates.

## 7. Rituals Create Belonging

Successful communities develop repeated, meaningful interactions—from weekly check-ins to annual events. Groups like Juliette's birthday club and the Space Cowboys rave community built strong bonds through rituals that sustain engagement​​.

→ Create spaces where communities can develop traditions that reinforce their identity.

## 8. Digital Spaces Should Support Real-World Connection

Online interactions should not replace, but strengthen real-world relationships. Whether it's local neighborhood groups, activist movements, or industry meetups, many stewards use digital tools as a bridge to offline events​​.

→ Design digital tools that facilitate real-life impact, from small meetups to global activism.

## 9. Accessibility is More Than Usability

Communities exist across different cultures, languages, internet speeds, and tech literacy levels. Tools need to be simple enough for casual users yet powerful for advanced organizers. Community leaders like Kaye-Maree emphasized the need for low-barrier, mobile-first solutions that work even in rural areas​.

→ Prioritize inclusivity in technology, ensuring it works for both digital natives and those with limited tech access.

# Non-Negotiables

Based on extensive community steward research, the non-negotiable elements of Plur should align with the core values, needs, and frustrations expressed by community leaders. These elements ensure that Plur respects user agency, fosters trust, and enables meaningful connections.

## 1. Data Sovereignty & Platform Resilience ("We need to own our community, not be at the mercy of a platform")

**Why?** Many community leaders have faced unexpected bans, content loss, and algorithmic changes (Cressida's group was deleted without warning​, Josh Kramer struggled with FB's shifting content visibility​).

**Non-Negotiable Elements:**
- Portable data: Communities should be able to export their data (member lists, content, event history).
- Platform redundancy: Communities should not cease to exist if a third party (e.g., Facebook, Discord) decides to shut them down.
- Custom domains/branding: Ability for communities to brand their space to reinforce identity and independence.

## 2. End-to-End Encryption & Privacy First Architecture ("We can't afford to have our conversations monitored or exploited")

**Why?** Activist communities, decentralized organizers, and even casual community stewards face deplatforming, harassment, or surveillance concerns (Priscilla was deplatformed from Airbnb and Chase​, Rhodes emphasized encrypted chat needs for KC Tenants​).

**Non-Negotiable Elements:**
- End-to-end encryption (E2EE): All messages, voice/video calls, and private group chats must be encrypted by default.
- Decentralized or federated infrastructure: Reduce reliance on a single point of failure.
- Minimal data retention: No unnecessary metadata tracking; ephemeral storage options for sensitive conversations.

## 3. Community-First Moderation & Governance Tools ("We need to be in control of how our community operates")

**Why?** Existing moderation tools are often either too restrictive (AI moderation misfires, sudden bans) or too lax (toxic behavior goes unchecked) (Rachel found Facebook's moderation tools unreliable​, Josh wanted more contextual moderation tools​).

**Non-Negotiable Elements:**
- Community-defined rules & enforcement: Leaders must set and enforce their own moderation standards, without platform interference.
- Flexible moderation levels: Options for human review, automated flagging, and AI assistance—but no mandatory AI policing.
- Appeal process & transparency: Members should have visibility into why they were warned, muted, or banned.

## 4. Multi-Tiered Participation & Role Management ("Not everyone engages the same way")

**Why?** Communities contain lurkers, contributors, organizers, and leaders—a single engagement model doesn't work (Women Who Code used structured roles​, Maggie Shapiro's paid community had clear tiers​).

**Non-Negotiable Elements:**
- Flexible access control: Ability to define public, private, and semi-private spaces.
- Custom roles & permissions: Leaders should assign moderators, contributors, and passive observers.
- Anonymous & pseudonymous participation: To allow for safer engagement, particularly for marginalized groups.

## 5. Asynchronous & Real-Time Communication Options ("Not every conversation needs to happen in the moment")

**Why?** Many communities struggle with keeping discussions findable and structured—chat-based tools like WhatsApp and Slack create chaotic, hard-to-follow threads (Rachel couldn't find old posts​, Benjamin found real-time discussions overwhelming​).

**Non-Negotiable Elements:**
- Persistent, thread-based discussions: Topics should be searchable and navigable, not just disappearing into a scroll.
- Live chat & voice options: For spontaneous conversations and events, akin to Discord's drop-in voice rooms​.
- Event & meeting scheduling: Integrated calendar, RSVPs, and reminders—no need for external tools.

## 6. Financial Tools That Empower Community Growth ("Monetization should be built-in, not hacked together")

**Why?** Community leaders struggle with donations, memberships, and event fees, often using fragmented payment apps (Borja had issues with Bizum & PayPal​, Rachel relied on Kajabi for payments​).

**Non-Negotiable Elements:**
- Built-in donations & micropayments: A way for members to support the community with one click.
- Event ticketing & memberships: Recurring subscriptions, pay-what-you-can models, and one-time payments.
- Revenue transparency & compliance: Clearly track who paid what, with minimal tax/accounting burdens.

## 7. Discoverability Without Algorithmic Manipulation ("We need visibility without being forced into engagement traps")

**Why?** Algorithm-driven feeds often suppress important posts and amplify controversy (Cressida's group posts vanished​, Josh found Facebook's ranking system misaligned​).

**Non-Negotiable Elements:**
- Chronological + pinned content options: Communities should choose whether posts are ranked by engagement or recency.
- Topic & tag-based organization: Members should be able to find past discussions without endless scrolling.
- No engagement farming mechanics: Avoid like/share baiting, click-through prioritization, or forced notifications.

## 8. Interoperability & Open Ecosystem ("We shouldn't be locked into one ecosystem")

**Why?** Community leaders use multiple tools (Slack, Discord, Meetup, WhatsApp, Notion, Airtable) and need interoperability, not isolation (Dae Melchi needed event-sharing across platforms​, Maggie had a fragmented system across Slack & Notion​).

**Non-Negotiable Elements:**
- API & integrations: Support for Zapier, webhooks, or direct integrations with other community tools.
- Federated identity options: Let users sign in with existing credentials (Mastodon, Matrix, Web3 wallets, email/password).
- Exportability & backups: No vendor lock-in—communities should be able to move to another platform if needed.

## Conclusion: What Plur Must Guarantee

At its core, Plur should be community-owned, privacy-first, and adaptable. The non-negotiables are about giving control back to community leaders while ensuring privacy, sustainability, and resilience.`;
          } catch (error) {
              console.error('Error loading design-principles content:', error);
          }
      } else if (pageName === 'terms') {
         markdownContent = `# Terms of Service

 Placeholder terms...`;
      } else if (pageName === 'privacy') {
         markdownContent = `# Privacy Policy

 Placeholder privacy policy...`;
      } else if (pageName === 'contact') {
          markdownContent = `# Contact Us

 Placeholder contact info...`;
      }
       // Add more pages as needed
      
      if (markdownContent) {
        const { content, metadata } = markdownToHtml(markdownContent);
        const pageHtml = createPage(metadata.title, metadata.description, content, metadata.image);
        return new Response(pageHtml, {
          headers: { 'Content-Type': 'text/html' }
        });
      } else {
        // If no markdown found for the path, return 404
        return new Response('Not Found', { status: 404 });
      }
      
    } catch (error) {
      console.error(`Error rendering page ${path}:`, error);
      return new Response('Error rendering page', { status: 500 });
    }
  },
}; 