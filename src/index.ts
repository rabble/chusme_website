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
        package_name: 'app.rabble.community',
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
          appID: 'GZCZBKH7MY.app.rabble.community',
          paths: [
            '/i/*', 
            '/join/*', 
            '/join-community*',
            '/g/*'
          ],
          appIDs: ['GZCZBKH7MY.app.rabble.community'],
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
        apps: ["GZCZBKH7MY.app.rabble.community"]
      }
    }),
    contentType: 'application/json'
  }
};

// Design tokens and CSS variables
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
      content: "✊";
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
    
    .button-secondary {
      display: inline-block;
      background-color: transparent;
      color: var(--primary);
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border: 2px solid var(--primary);
      font-weight: 700;
      font-size: 1.125rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: background-color 0.2s;
    }
    
    .button-secondary:hover {
      background-color: var(--primary);
      color: white;
    }
    
    .hero {
      background-color: var(--primary);
      color: white;
      padding: 5rem 0;
      text-align: center;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      line-height: 1.2;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
    }
    
    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2.5rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.5;
    }
    
    .hero-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    /* Special styling for buttons in hero section */
    .hero .button-primary {
      background-color: white;
      color: var(--primary);
      border-color: white;
    }
    
    .hero .button-primary:hover {
      background-color: transparent;
      color: white;
    }
    
    .hero .button-secondary {
      border-color: white;
      color: white;
    }
    
    .hero .button-secondary:hover {
      background-color: white;
      color: var(--primary);
    }
    
    .content {
      padding: 4rem 0;
    }
    
    .content h2 {
      font-size: 2.25rem;
      margin-bottom: 1.5rem;
      color: var(--primary);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 3px solid var(--primary);
      display: inline-block;
      padding-bottom: 0.5rem;
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
      content: "✊";
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
    
    /* Woodcut style decorative elements */
    .woodcut-divider {
      height: 20px;
      background-image: url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 L40 6 M3 3 L3 9 M8 2 L8 10 M13 1 L13 11 M18 2 L18 10 M23 3 L23 9 M28 2 L28 10 M33 1 L33 11 M38 3 L38 9' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E");
      background-repeat: repeat-x;
      margin: 2rem 0;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      margin: 2rem 0;
    }
    
    .feature-item {
      padding: 1.5rem;
      border: 2px solid var(--primary);
      background-color: var(--surface);
      display: flex;
      flex-direction: column;
    }
    
    .feature-item h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
      border-bottom: 2px solid var(--accent);
      display: inline-block;
      padding-bottom: 0.5rem;
    }
    
    .feature-item p {
      margin-bottom: 1.5rem;
    }
    
    .feature-image {
      margin-top: auto;
      text-align: center;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .screenshot {
      max-width: 100%;
      height: auto;
      border: 2px solid var(--primary);
      box-shadow: 5px 5px 0 rgba(0,0,0,0.2);
      max-height: 400px;
    }
    
    .feature-highlight {
      margin: 3rem 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
      padding: 2rem;
      border: 2px solid var(--primary);
      background-color: var(--surface);
    }
    
    .feature-highlight-text h3 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      font-weight: 700;
      border-bottom: 2px solid var(--accent);
      display: inline-block;
      padding-bottom: 0.5rem;
    }
    
    .feature-highlight-image {
      text-align: center;
    }
    
    .screenshot-large {
      max-width: 100%;
      height: auto;
      border: 2px solid var(--primary);
      box-shadow: 5px 5px 0 rgba(0,0,0,0.2);
    }
    
    /* Open Source banner */
    .open-source-banner {
      margin: 2.5rem 0;
      padding: 2rem;
      border: 3px solid var(--primary);
      background-color: var(--surface);
      position: relative;
      box-shadow: 7px 7px 0 rgba(0,0,0,0.1);
    }
    
    .open-source-banner:before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L10 10L20 0L10 20Z' fill='%235e452a' fill-opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
    }
    
    .open-source-banner h3 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
      border-bottom: 3px solid var(--primary);
      padding-bottom: 0.5rem;
    }
    
    .github-button {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
    }
    
    .github-button i {
      font-size: 1.5rem;
    }
    
    /* Manifesto quote */
    .manifesto {
      font-size: 1.5rem;
      font-style: italic;
      font-weight: 500;
      line-height: 1.5;
      margin: 2rem 0;
      padding: 1.5rem 2rem;
      border-left: 5px solid var(--accent);
      background-color: var(--surface);
      position: relative;
    }
    
    .manifesto:before {
      content: """;
      position: absolute;
      top: -0.5rem;
      left: 1rem;
      font-size: 5rem;
      font-family: Georgia, serif;
      color: var(--accent);
      opacity: 0.3;
      line-height: 1;
    }
    
    @media (max-width: 768px) {
      .feature-grid {
        grid-template-columns: 1fr;
      }
      
      .feature-highlight {
        grid-template-columns: 1fr;
      }
      
      .feature-highlight-text {
        order: 1;
      }
      
      .feature-highlight-image {
        order: 2;
      }
    }
    
    /* Notification form styles */
    .notification-form {
      max-width: 600px;
      margin: 2rem 0;
      padding: 2rem;
      border: 2px solid var(--primary);
      background-color: var(--surface);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      font-family: var(--font-family);
      font-size: 1rem;
      border: 2px solid var(--primary);
      background-color: var(--highlight);
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--accent);
      background-color: white;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .container, .hero-container {
        padding: 0 1rem;
      }
      
      .hero h1 {
        font-size: 2.5rem;
      }
      
      .hero p {
        font-size: 1.25rem;
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
          <li><a href="/about">About</a></li>
          <li><a href="/community">Community</a></li>
          <li><a href="https://app.rabble.community" target="_blank">Open App</a></li>
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
      <p>&copy; 2025 rabble.community · All rights reserved</p>
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
    
    // Handle local assets in development mode
    if (path.startsWith('/local-assets/')) {
      const fileName = path.split('/').pop() || '';
      const localPath = `static/assets/${fileName}`;
      
      // This part will only work if you add binary content handling to your worker
      // It's just a placeholder for now - in reality, you'd need to use Blob, ArrayBuffer,
      // or a streaming approach to serve the binary files
      return new Response(`Local static file would be served from: ${localPath}`, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache'
        }
      });
    }
    
    // Handle static asset paths
    if (path.startsWith('/static/assets/')) {
      const fileName = path.split('/').pop() || '';
      
      // Map for real PNG images in Cloudflare Images
      // Format: fileName -> Cloudflare Image ID
      const cloudflareImagesMap: Record<string, string> = {
        // Use the image IDs for the files actually referenced in the HTML
        // Map our actual uploaded images to the filenames used in HTML
        'community-focused.png': 'fc67aea6-a6c6-4cb9-8480-5db260218b00', // Reusing asks_offers image
        'user-control.png': '0de45bbc-c804-4ef1-9a5b-df668a4a1e00',     // Reusing chat image
        'privacy-first.png': 'c14148d3-18eb-44a9-133b-48f883ad3500',     // Reusing events image
        'not-entertainment.png': '2857264c-f538-492a-c0a3-657012ecb000', // Reusing posting_event image
        'not-product.png': '510cc54c-cd4a-40b2-bce3-effb502d2000',       // Reusing posts image
        'authentic-connections.png': 'fc67aea6-a6c6-4cb9-8480-5db260218b00', // Reusing asks_offers image again
        
        // Keep the original mappings too in case they're needed elsewhere
        'asks_offers.png': 'fc67aea6-a6c6-4cb9-8480-5db260218b00',
        'chat.png': '0de45bbc-c804-4ef1-9a5b-df668a4a1e00',
        'events.png': 'c14148d3-18eb-44a9-133b-48f883ad3500',
        'posting_event.png': '2857264c-f538-492a-c0a3-657012ecb000',
        'posts.png': '510cc54c-cd4a-40b2-bce3-effb502d2000'
      };
      
      // If we have a Cloudflare Image for this file, redirect to it
      if (cloudflareImagesMap[fileName]) {
        // Check if running in production (simple check - not foolproof)
        const isProduction = !request.url.includes('localhost');
        
        if (isProduction) {
          const accountHash = 'U9c1NKydsjSHWVgWsUp4Yg'; // Your Cloudflare account hash
          const imageId = cloudflareImagesMap[fileName];
          const imageVariant = 'public'; // Default variant
          
          return Response.redirect(`https://imagedelivery.net/${accountHash}/${imageId}/${imageVariant}`, 302);
        } else {
          // In local development, try to serve the local file
          try {
            // Redirect to static file handler on the same server
            return Response.redirect(`/local-assets/${fileName}`, 302);
          } catch (error) {
            console.error(`Error serving local file ${fileName}:`, error);
            // Fall through to SVG placeholder
          }
        }
      }
      
      // For files that don't have real images, use SVG placeholders
      // Create stylish SVG placeholders
      const baseBgColor = '#5d4037'; // Brown base color from the rabble.community palette
      
      // Determine appropriate icon and accent color based on image name
      let icon = '◆';
      let mainColor = baseBgColor;
      
      if (fileName.includes('posts')) {
        icon = '📱';
        mainColor = '#7856FF';
      } else if (fileName.includes('chat')) {
        icon = '💬';
        mainColor = '#00A3FF';
      } else if (fileName.includes('asks') || fileName.includes('offers')) {
        icon = '🤝';
        mainColor = '#FF9500';
      } else if (fileName.includes('events')) {
        icon = '📅';
        mainColor = '#00C781';
      } else if (fileName.includes('community')) {
        icon = '👥';
        mainColor = '#8d6e63';
      } else if (fileName.includes('user-control')) {
        icon = '🛡️';
        mainColor = '#3e2723';
      } else if (fileName.includes('privacy')) {
        icon = '🔒';
        mainColor = '#5d4037';
      } else if (fileName.includes('authentic')) {
        icon = '✨';
        mainColor = '#8d6e63';
      } else if (fileName.includes('not-entertainment')) {
        icon = '🎯';
        mainColor = '#3e2723';
      } else if (fileName.includes('not-product')) {
        icon = '👤';
        mainColor = '#5d4037';
      } else if (fileName.includes('posting')) {
        icon = '✏️';
        mainColor = '#8d6e63';
      }
      
      // Create an aesthetically pleasing SVG that fits the rabble.community design theme
      const svgPlaceholder = `<svg width="300" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern-wood" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(0.5)">
            <rect width="100%" height="100%" fill="${mainColor}" opacity="0.05"/>
            <path d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="${mainColor}" opacity="0.2"/>
          </pattern>
        </defs>
        
        <!-- Background with wood-inspired pattern -->
        <rect width="100%" height="100%" fill="url(#pattern-wood)" />
        
        <!-- Header bar -->
        <rect width="100%" height="60" fill="${mainColor}" />
        
        <!-- Main content area with feature title -->
        <rect x="50" y="100" width="200" height="200" fill="${mainColor}" opacity="0.1" rx="8" ry="8" />
        
        <!-- Feature icon -->
        <text x="150" y="180" font-family="Arial" font-size="72" text-anchor="middle" dominant-baseline="middle">
          ${icon}
        </text>
        
        <!-- Feature name -->
        <text x="150" y="300" font-family="Arial" font-size="18" font-weight="bold" fill="${mainColor}" text-anchor="middle">
          ${fileName.replace(/[-_]/g, ' ').replace('.png', '').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </text>
        
        <!-- Woodcut-style decorative elements -->
        <path d="M20 350 L280 350" stroke="${mainColor}" stroke-width="2" />
        <path d="M50 370 L250 370" stroke="${mainColor}" stroke-width="1.5" />
        
        <!-- Footer with app name -->
        <text x="150" y="450" font-family="Arial" font-size="14" fill="${mainColor}" text-anchor="middle">
          rabble.community
        </text>
      </svg>`;
      
      return new Response(svgPlaceholder, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600' // 1 hour cache for placeholders
        }
      });
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
      // Use the content directly from index.html
      return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>rabble.community - A Community App Built on Open Protocol</title>
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
        
        .feature-card::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            /* Remove the diagonal line pattern to make images clearer */
            background: none;
            pointer-events: none;
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
            <h1>rabble.community</h1>
            <p>Signal for Facebook Groups</p>
            <a href="https://app.rabble.community" style="display: inline-block; margin-top: 15px; background-color: white; color: var(--secondary-color); padding: 8px 20px; text-decoration: none; font-weight: bold; border: none;">Launch Rabble App</a>
        </div>
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>Authentic Communities Built on Care and Connection</h1>
            <p>rabble.community is a communities app being built on the open Nostr protocol, putting users in control of their online social experience.</p>
            <div style="margin-top: 30px;">
                <a href="https://app.rabble.community" style="display: inline-block; background-color: var(--accent-color); color: white; padding: 12px 25px; font-size: 1.2rem; text-decoration: none; font-weight: bold; border: 2px solid var(--accent-color);">Try Rabble Now</a>
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
            <h2>Why Rabble?</h2>
            <p>We believe in a future where communities everywhere are empowered to organize and create positive social change. Following the successful launch of Nos and Planetary apps on the Nostr protocol, we're now focusing on the needs of communities and groups looking for alternatives to Facebook Groups, WhatsApp, and Slack.</p>
            
            <div class="features">
                <div class="feature-card">
                    <img src="static/assets/community-focused.png" alt="Community-Focused" class="feature-image">
                    <h3>Community-Focused</h3>
                    <p>rabble.community is a social app, not a social media app. We focus on active engagement with other people versus passive consumption of content.</p>
                </div>
                
                <div class="feature-card">
                    <img src="static/assets/user-control.png" alt="User Control" class="feature-image">
                    <h3>User Control</h3>
                    <p>You own your followers and can interact with them in any app on the protocol. You decide what content you see and from whom.</p>
                </div>
                
                <div class="feature-card">
                    <img src="static/assets/privacy-first.png" alt="Privacy First" class="feature-image">
                    <h3>Privacy First</h3>
                    <p>Think Signal-like privacy for community groups. Your social online experiences should leave you feeling fulfilled and positive.</p>
                </div>
            </div>
        </div>
    </section>
    
    <section style="background-color: #f9f6f0; padding: 4rem 0;">
        <div class="container">
            <h2>Community Features</h2>
            <p style="text-align: center; margin-bottom: 3rem;">Rabble provides comprehensive tools for communities to connect, coordinate, and collaborate:</p>
            
            <div class="feature-highlight" style="margin-bottom: 3rem;">
                <div class="feature-highlight-text">
                    <h3>Social Posts</h3>
                    <p>Share updates, articles, and media with your community through familiar social media style posts and discussions.</p>
                </div>
                <div class="feature-highlight-image">
                    <img src="static/assets/posts.png" alt="Rabble posts interface" class="screenshot-large">
                </div>
            </div>
            
            <div class="feature-highlight" style="margin-bottom: 3rem;">
                <div class="feature-highlight-image">
                    <img src="static/assets/chat.png" alt="Rabble chat interface" class="screenshot-large">
                </div>
                <div class="feature-highlight-text">
                    <h3>Threaded Chat</h3>
                    <p>Engage in real-time conversations with organized threading to keep discussions focused and accessible.</p>
                </div>
            </div>
            
            <div class="feature-highlight" style="margin-bottom: 3rem;">
                <div class="feature-highlight-text">
                    <h3>Asks & Offers</h3>
                    <p>Request help or offer support to meet your community's needs—from rides to protests to sharing resources.</p>
                </div>
                <div class="feature-highlight-image">
                    <img src="static/assets/asks_offers.png" alt="Rabble asks and offers interface" class="screenshot-large">
                </div>
            </div>
            
            <div class="feature-highlight" style="margin-bottom: 3rem;">
                <div class="feature-highlight-image">
                    <img src="static/assets/events.png" alt="Rabble events interface" class="screenshot-large">
                </div>
                <div class="feature-highlight-text">
                    <h3>Community Events</h3>
                    <p>Organize, promote, and coordinate events with integrated RSVP and reminder functionality.</p>
                </div>
            </div>
            
            <div class="feature-highlight">
                <div class="feature-highlight-text">
                    <h3>Easily Create Content</h3>
                    <p>Rabble makes it simple to create events, posts, and other content to share with your community.</p>
                </div>
                <div class="feature-highlight-image">
                    <img src="static/assets/posting_event.png" alt="Creating an event in Rabble" class="screenshot-large">
                </div>
            </div>
        </div>
    </section>
    
    <section class="bill-of-rights">
        <div class="container">
            <h2>A Bill of Rights for Social Media</h2>
            <ul class="rights-list">
                <li><strong>The right to privacy and security</strong> - End-to-end encryption and granular privacy settings</li>
                <li><strong>The right to own and control your identity</strong> - Decentralized identity ownership, handles, and profile portability</li>
                <li><strong>The right to choose and understand algorithms</strong> - Algorithm control panel, multiple feed views</li>
                <li><strong>The right to community self-governance</strong> - Community-led governance, fair and transparent moderation tools</li>
                <li><strong>The right to full portability</strong> - Permissionless and open protocol, export options, interoperability</li>
            </ul>
        </div>
    </section>
    
    <section>
        <div class="container">
            <h2>Our Approach</h2>
            <p>We use an open, decentralized protocol - Nostr - to put users in control of their online social experience, feed, and personal communities. We're eliminating the ad-driven model—which is predicated on likes and engagement—and instead put users in control of what they see, and from whom.</p>
            
            <div class="features">
                <div class="feature-card">
                    <img src="static/assets/not-entertainment.png" alt="Not Entertainment" class="feature-image">
                    <h3>Not a Source of Entertainment</h3>
                    <p>There are many other options for entertainment. We are focused on being 'pro social' and fostering authentic community.</p>
                </div>
                
                <div class="feature-card">
                    <img src="static/assets/not-product.png" alt="Not the Product" class="feature-image">
                    <h3>You Are Not the Product</h3>
                    <p>The flow of communications is decentralized and not controlled by a corporation. Our business model is designed to put your interests first.</p>
                </div>
                
                <div class="feature-card">
                    <img src="static/assets/authentic-connections.png" alt="Authentic Connections" class="feature-image">
                    <h3>Authentic Connections</h3>
                    <p>rabble.community leaves behind the negative impacts of social media (loneliness, toxic content, FOMO) and instead offers the benefits of positive connections.</p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="cta">
        <div class="container">
            <h2>Join Us in Building a Better Social Experience</h2>
            <p>rabble.community is available now! We're working to create a platform where communities, not corporations, hold the power over online communication.</p>
            <a href="https://app.rabble.community" class="btn">Use Rabble Now</a>
            <p style="margin-top: 20px; font-size: 1.1rem;">Access the web app at <a href="https://app.rabble.community" style="color: white; text-decoration: underline;">app.rabble.community</a> — iOS and Android apps coming soon!</p>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>&copy; 2025 rabble.community. All rights reserved.</p>
            <p>Built on the open Nostr protocol.</p>
        </div>
    </footer>
</body>
</html>`, {
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