/// <reference types="@cloudflare/workers-types" />
import indexPage from './pages/index';
import aboutPage from './pages/about';
import contributePage from './pages/contribute';
import howItWorksPage from './pages/how-it-works';
import useHolisApp from './pages/use-holis';
import useCasesPage from './pages/use-cases';
import tenantsPage from './pages/use-cases/tenants';
import mutualAidPage from './pages/use-cases/mutual-aid';
import artistsPage from './pages/use-cases/artists';
import indigenousPage from './pages/use-cases/indigenous';
import designPrinciplesPage from './pages/design-principles';
import getStartedPage from './pages/get-started';
import pricingPage from './pages/pricing';
import privacyPage from './pages/privacy';
// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    const metadata = {
        title: "Holis Social", // Default title
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
            if (titleMatch)
                metadata.title = titleMatch[1];
            const descMatch = frontMatter.match(/description:\s*"([^"]*)"/);
            if (descMatch)
                metadata.description = descMatch[1];
            const imageMatch = frontMatter.match(/image:\s*"([^"]*)"/);
            if (imageMatch)
                metadata.image = imageMatch[1];
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
    content = content.replace(/(<li>.*<\/li>\n)+/g, function (match) {
        return '<ul>' + match + '</ul>';
    });
    content = content.replace(/^\|(.*)\|$/gm, '<tr>$1</tr>');
    content = content.replace(/<tr>(.*)<\/tr>/g, (match, content) => {
        const cells = content.split('|').map((cell) => cell.trim());
        let row = '<tr>';
        for (const cell of cells) {
            if (cell) {
                row += `<td>${cell}</td>`;
            }
        }
        row += '</tr>';
        return row;
    });
    content = content.replace(/(<tr>.*<\/tr>\n)+/g, function (match) {
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
const STATIC_FILES = {
    '/.well-known/assetlinks.json': {
        content: JSON.stringify([{
                relation: ['delegate_permission/common.handle_all_urls'],
                target: {
                    namespace: 'android_app',
                    package_name: 'app.holis.social', // Updated package name
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
                        appID: 'GZCZBKH7MY.app.holis.social', // Updated bundle ID with correct Team ID
                        paths: [
                            '/i/*',
                            '/join/*',
                            '/join-community*',
                            '/g/*'
                            // Potentially add paths relevant to app.holis.social if needed for universal links
                        ],
                        // Older format, sometimes needed for compatibility
                        appIDs: ['GZCZBKH7MY.app.holis.social'],
                        components: [
                            {
                                "/": "/i/*",
                                comment: "Matches invite links handled by holis or app.holis.social"
                            },
                            {
                                "/": "/join/*",
                                comment: "Matches web invite links handled by holis or app.holis.social"
                            },
                            // Add other paths as needed
                        ]
                    }]
            },
            webcredentials: {
                // List the app bundle ID that can use web credentials associated with this domain
                apps: ["GZCZBKH7MY.app.holis.social"]
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
// Design tokens and CSS variables (can be shared or customized for holis.social)
const DESIGN_TOKENS = {
    colors: {
        primary: "#000000", // Black (main color for woodcut style)
        secondary: "#F5F1E9", // Off-white paper texture background
        accent: "#5E452A", // Wood brown accent
        highlight: "#FFFDF7", // Cream highlight
        surface: "#F9F6F0", // Natural paper surface
        surfaceAlt: "#EDEAE0", // Slightly darker paper background
        textPrimary: "#000000", // Black text
        textSecondary: "#3D3D3D" // Dark gray text
    },
    typography: {
        fontFamily: "'Alegreya', 'Crimson Pro', 'Georgia', serif",
        h1: { size: 48, weight: 800, lineHeight: 58 },
        body: { size: 18, weight: 400, lineHeight: 28 }
    },
    spacing: 8,
    radius: 0, // Sharp edges for woodcut style
    shadow: "none" // No shadows for a flatter woodcut look
};
// Create a page layout with the provided content
function createPage(title, description, content, image) {
    // Using holis.social branding
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Holis Social</title>
  <meta name="description" content="${description}">
  ${image ? `<meta property="og:image" content="${image}">` : ''}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Holis Social">
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
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .header {
      background-color: var(--surface);
      padding: 1.25rem 0;
      border-bottom: 2px solid var(--primary);
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
      text-transform: uppercase;
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
    }

    .content {
      padding: 4rem 0;
    }

    h1, h2, h3 {
      margin-bottom: 1.5rem;
      color: var(--primary);
      font-weight: 700;
    }

    h1 {
      font-size: 2.5rem;
    }

    h2 {
      font-size: 2rem;
    }

    h3 {
      font-size: 1.5rem;
    }

    p, ul, ol {
      margin-bottom: 1.5rem;
    }

    a {
      color: var(--accent);
      text-decoration: underline;
    }

    .footer {
      background-color: var(--primary);
      padding: 3rem 0;
      color: white;
      text-align: center;
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
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
        <a href="/" class="logo">Holis</a> 
        <ul class="nav-links">
          <li><a href="/about">About</a></li> 
          <li><a href="/community">Community</a></li>
          <li><a href="/design-principles">Design Principles</a></li>
          <li><a href="https://app.holis.social" target="_blank">Open App</a></li>
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
      <p>&copy; 2025 Holis.social · All rights reserved</p> 
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
// Main worker for holis.social (landing page, static files, markdown pages)
export default {
    async fetch(request, env, ctx) {
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
            return Response.redirect('https://app.holis.social', 301);
        }
        if (path === '/join') {
            // Redirect to the shortlink service invite path
            return Response.redirect('https://holis/invite', 301); // Assuming holis handles /invite
        }
        if (path === '/github') {
            // Redirect to your GitHub org or repo
            return Response.redirect('https://github.com/verse-pbc/plur', 301); // Updated URL
        }
        // Handle static asset paths (e.g., images)
        if (path.startsWith('/static/assets/')) {
            const fileName = path.split('/').pop() || '';
            // Redirect to CDN for iOS screenshots
            if (path.startsWith('/static/assets/ios/') && fileName.endsWith('.jpg')) {
                return Response.redirect(`https://files.holis.social/assets/ios/${fileName}`, 302);
            }
            // Map for Cloudflare Images if using them for non-screenshot assets
            const cloudflareImagesMap = {
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
            // For local development, generate SVG placeholders
            if (request.url.includes('localhost') && path.startsWith('/static/assets/ios/')) {
                const screenshotName = fileName.replace(/[-_]/g, ' ').replace('.jpg', '');
                // Generate a unique color based on the filename for visual distinction
                const getHashColor = (text) => {
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
            <text x="55" y="103" font-family="Arial" font-size="18" fill="#333333">Holis</text>
            
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
            // Redirect to CDN for PNG images
            if (fileName.endsWith('.png')) {
                return Response.redirect(`https://files.holis.social/assets/${fileName}`, 302);
            }
            // Fallback for other images - generate SVG placeholders
            const baseBgColor = '#5d4037';
            let icon = '🖼️'; // Generic image icon
            let mainColor = baseBgColor;
            const svgPlaceholder = `<svg width="300" height="500" xmlns="http://www.w3.org/2000/svg">
         <rect width="100%" height="100%" fill="${mainColor}" opacity="0.1"/>
         <text x="150" y="250" font-family="Arial" font-size="72" text-anchor="middle" dominant-baseline="middle">${icon}</text>
         <text x="150" y="350" font-family="Arial" font-size="18" fill="${mainColor}" text-anchor="middle">
           ${fileName.replace(/[-_]/g, ' ').replace('.png', '')}
         </text>
         <text x="150" y="450" font-family="Arial" font-size="14" fill="${mainColor}" text-anchor="middle">
           holis.social
         </text>
       </svg>`;
            return new Response(svgPlaceholder, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=3600'
                }
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
        // Modular route handling for markdown-driven pages
        if (path === '/' || path === '/index.html')
            return indexPage(request);
        if (path === '/about')
            return aboutPage(request);
        if (path === '/contribute')
            return contributePage(request);
        if (path === '/how-it-works')
            return howItWorksPage(request);
        if (path === '/use-holis' || path === '/use-holis')
            return useHolisApp(request);
        if (path === '/use-cases')
            return useCasesPage(request);
        if (path === '/use-cases/tenants')
            return tenantsPage(request);
        if (path === '/use-cases/mutual-aid')
            return mutualAidPage(request);
        if (path === '/use-cases/artists')
            return artistsPage(request);
        if (path === '/use-cases/indigenous')
            return indigenousPage(request);
        if (path === '/design-principles')
            return designPrinciplesPage(request);
        if (path === '/get-started')
            return getStartedPage(request);
        if (path === '/pricing')
            return pricingPage(request);
        if (path === '/privacy')
            return privacyPage(request);
        // If no handler found, return 404
        return new Response('Not Found', { status: 404 });
    },
};
