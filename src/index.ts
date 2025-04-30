/// <reference types="@cloudflare/workers-types" />

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
      opacity: 0.9;
      transition: all 0.2s;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
    }
    
    .nav-links a:hover {
      opacity: 1;
      color: var(--primary);
      background-color: var(--surfaceAlt);
    }
    
    .content {
      padding: 5rem 0;
    }
    
    .hero-section {
      padding: 8rem 0 6rem;
      background: linear-gradient(180deg, #FFF8F7 0%, #E3D8F5 100%);
      margin-bottom: 4rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .hero-section::before {
      content: "";
      position: absolute;
      top: -10%;
      right: -10%;
      width: 60%;
      height: 70%;
      background: radial-gradient(circle, rgba(85, 64, 123, 0.05) 0%, rgba(85, 64, 123, 0) 70%);
      z-index: 0;
    }
    
    .hero-section::after {
      content: "";
      position: absolute;
      bottom: -10%;
      left: -10%;
      width: 60%;
      height: 70%;
      background: radial-gradient(circle, rgba(227, 216, 245, 0.2) 0%, rgba(227, 216, 245, 0) 70%);
      z-index: 0;
    }
    
    .hero-container {
      position: relative;
      z-index: 1;
    }
    
    .beta-badge {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
      padding: 0.3rem 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      letter-spacing: 0.01em;
    }
    
    .coming-soon {
      margin-top: 1.5rem;
      color: var(--text-secondary);
      font-size: 1rem;
    }
    
    .pill {
      display: inline-block;
      background-color: rgba(85, 64, 123, 0.1);
      color: var(--primary);
      font-weight: 600;
      padding: 0.2rem 0.8rem;
      border-radius: 6px;
      font-size: 0.875rem;
      margin-right: 0.5rem;
    }
    
    .app-status {
      margin-top: 1.5rem;
      color: var(--text-secondary);
      text-align: center;
    }
    
    .app-status p {
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
    
    .app-status a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .app-status a:hover {
      color: var(--accent);
      text-decoration: underline;
    }
    
    .footer {
      background-color: #55407B;
      color: white;
      padding: 3rem 0;
      font-size: 0.875rem;
      margin-top: 4rem;
    }
    
    .footer a {
      color: white;
      opacity: 0.8;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .footer a:hover {
      opacity: 1;
      text-decoration: underline;
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    
    .footer-column h4 {
      color: white;
      margin-bottom: 1rem;
    }
    
    .footer-column ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-column li {
      margin-bottom: 0.5rem;
    }
    
    .copyright {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      text-align: center;
    }
    
    /* Components */
    h1 {
      font-size: ${DESIGN_TOKENS.typography.h1.size}px;
      font-weight: ${DESIGN_TOKENS.typography.h1.weight};
      line-height: ${DESIGN_TOKENS.typography.h1.lineHeight}px;
      margin-bottom: 1.5rem;
      color: var(--primary);
      letter-spacing: -0.02em;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hero-section h1 {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      position: relative;
      color: var(--primary);
    }
    
    .hero-section h1::after {
      content: "";
      position: absolute;
      bottom: -1rem;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background-color: var(--primary);
      border-radius: 1.5px;
      opacity: 0.4;
    }
    
    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      margin-top: 3rem;
      color: var(--primary);
      letter-spacing: -0.01em;
    }
    
    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      margin-top: 2rem;
      color: var(--primary);
      letter-spacing: 0;
    }
    
    p {
      margin-bottom: 1.5rem;
      line-height: 1.7;
      color: var(--text-secondary);
      font-size: 1rem;
    }
    
    .paragraph-large {
      font-size: 1.25rem;
      line-height: 1.5;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      max-width: 750px;
      margin-left: auto;
      margin-right: auto;
    }
    
    ul, ol {
      margin-bottom: 1.5rem;
      padding-left: 2rem;
      color: var(--text-secondary);
      font-size: 1.125rem;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
      background-color: var(--surface-alt);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    th {
      font-weight: 600;
      color: var(--primary);
      background-color: rgba(0,0,0,0.02);
    }
    
    code, pre {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      background-color: var(--surface-alt);
      border-radius: 4px;
    }
    
    code {
      padding: 0.2em 0.4em;
      font-size: 0.9em;
    }
    
    pre {
      padding: 1rem;
      overflow-x: auto;
      margin-bottom: 1.5rem;
    }
    
    blockquote {
      border-left: 4px solid var(--primary);
      padding-left: 1rem;
      margin-left: 0;
      margin-bottom: 1.5rem;
      font-style: italic;
      color: var(--text-secondary);
    }
    
    blockquote.quote {
      background-color: var(--surface-alt);
      padding: 1.5rem;
      border-radius: var(--radius);
      font-style: italic;
    }
    
    hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 2rem 0;
    }
    
    form {
      margin: 2rem 0;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .form-group {
      position: relative;
      margin-bottom: 1.5rem;
    }
    
    input, button {
      font-family: var(--font-family);
      font-size: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 50px;
      border: 2px solid transparent;
      outline: none;
      transition: all 0.3s;
      width: 100%;
    }
    
    input {
      background-color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    input:focus {
      border-color: var(--primary);
      box-shadow: 0 4px 20px rgba(110, 65, 226, 0.15);
    }
    
    button {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: white;
      border: none;
      cursor: pointer;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(110, 65, 226, 0.3);
      transition: all 0.3s;
      margin-top: 1rem;
    }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(110, 65, 226, 0.4);
    }
    
    .button-primary {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      text-decoration: none;
      padding: 0.9rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      margin-right: 1rem;
      margin-bottom: 1rem;
      transition: all 0.3s;
      box-shadow: 0 2px 6px rgba(85, 64, 123, 0.25);
    }
    
    .button-primary:hover {
      background-color: #463267;
      box-shadow: 0 4px 12px rgba(85, 64, 123, 0.35);
    }
    
    .button-secondary {
      display: inline-block;
      background-color: white;
      color: var(--primary);
      text-decoration: none;
      padding: 0.9rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      border: 1px solid var(--primary);
      margin-bottom: 1rem;
      transition: all 0.3s;
    }
    
    .button-secondary:hover {
      background-color: var(--surfaceAlt);
    }
    
    .cta-container {
      margin: 2.5rem 0;
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    details {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: var(--surface-alt);
      border-radius: var(--radius);
    }
    
    summary {
      font-weight: 600;
      cursor: pointer;
    }
    
    section {
      margin-bottom: 4rem;
      padding: 2rem;
      background-color: var(--surface-alt);
      border-radius: var(--radius);
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }
    
    .feature-card {
      padding: 2.5rem;
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 24px rgba(85, 64, 123, 0.08);
    }
    
    .feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      background-color: var(--surfaceAlt);
      border-radius: 12px;
      margin-bottom: 1.5rem;
      position: relative;
      transition: all 0.3s;
    }
    
    .feature-card:hover .feature-icon {
      background-color: rgba(85, 64, 123, 0.08);
    }
    
    .feature-icon::before {
      content: "✓";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.25rem;
      color: var(--primary);
      transition: all 0.3s;
    }
    
    .feature-card h3 {
      margin-top: 0;
      font-size: 1.25rem;
      color: var(--text-primary);
      letter-spacing: -0.01em;
      transition: color 0.3s;
    }
    
    .feature-card:hover h3 {
      color: var(--primary);
    }
    
    small {
      font-size: 0.875rem;
      color: var(--text-secondary);
      display: block;
      margin-top: 0.5rem;
    }
    
    .testimonial {
      padding: 2.5rem;
      background-color: var(--surfaceAlt);
      border-radius: 16px;
      margin: 4rem auto;
      position: relative;
      max-width: 800px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      font-size: 1.125rem;
      line-height: 1.6;
      font-style: italic;
      color: var(--text-secondary);
      text-align: center;
    }
    
    .testimonial::before {
      content: """;
      position: absolute;
      top: 1rem;
      left: 1.5rem;
      font-size: 4rem;
      font-family: Georgia, serif;
      line-height: 1;
      color: var(--primary);
      opacity: 0.15;
    }
    
    .testimonial small {
      display: block;
      margin-top: 1.5rem;
      font-style: normal;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--primary);
    }
    
    @media (max-width: 992px) {
      .hero-section {
        padding: 5rem 0 4rem;
      }
      
      .hero-section h1 {
        font-size: 3rem;
      }
      
      .feature-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .testimonial {
        padding: 2.5rem;
        font-size: 1.125rem;
      }
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .hero-section {
        padding: 4rem 0 3rem;
      }
      
      .hero-section h1 {
        font-size: 2.5rem;
        line-height: 1.2;
      }
      
      h1 {
        font-size: 2.5rem;
        line-height: 1.2;
      }
      
      .container, .hero-container {
        padding: 0 1.25rem;
      }
      
      .feature-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .button-primary, .button-secondary {
        display: block;
        width: 100%;
        margin-right: 0;
      }
      
      .testimonial {
        padding: 2rem;
        margin: 3rem auto;
        font-size: 1rem;
      }
      
      .testimonial::before {
        font-size: 5rem;
        top: -1.5rem;
      }
      
      .testimonial::after {
        font-size: 5rem;
        bottom: -3rem;
      }
      
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 480px) {
      .hero-section h1 {
        font-size: 2rem;
      }
      
      h2 {
        font-size: 1.75rem;
      }
      
      .feature-card {
        padding: 1.5rem;
      }
      
      .footer-grid {
        grid-template-columns: 1fr;
      }
      
      .coming-soon {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .pill {
        margin-bottom: 0.5rem;
      }
    }
    
    /* nos.social-inspired layout styles */
    .full-hero-image {
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      margin-top: -40px;
      margin-bottom: 80px;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    
    .image-hero {
      max-width: 100%;
      height: auto;
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    }
    
    .gradient {
      position: absolute;
      bottom: -50px;
      left: 0;
      width: 100%;
      height: 100px;
      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
      z-index: 2;
    }
    
    .section-features {
      padding: 80px 0;
    }
    
    .container-default-5 {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    .inner-container {
      max-width: 1080px;
      margin: 0 auto;
    }
    
    .inner-container.center {
      text-align: center;
    }
    
    .inner-container._580px {
      max-width: 580px;
    }
    
    .inner-container._500px---tablet {
      max-width: 500px;
    }
    
    .inner-container._400px---mbl {
      max-width: 400px;
    }
    
    .display-flex {
      display: flex;
      flex-direction: column;
    }
    
    .vertical-gap-35px {
      gap: 35px;
    }
    
    .mg-bottom-80px {
      margin-bottom: 80px;
    }
    
    .mg-bottom-40px {
      margin-bottom: 40px;
    }
    
    .mg-bottom-32px {
      margin-bottom: 32px;
    }
    
    .mg-top-16px-2 {
      margin-top: 16px;
    }
    
    .mg-top-80px {
      margin-top: 80px;
    }
    
    .card-4 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      border-radius: 24px;
      overflow: hidden;
      background-color: #fcfcfc;
      box-shadow: 0 2px 16px rgba(0,0,0,0.04);
    }
    
    .card-4.features {
      background-color: var(--surface-alt);
      max-width: 1080px;
      margin: 0 auto;
    }
    
    .pd---content-inside-card-4 {
      padding: 64px;
    }
    
    .features-content-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .image-wrapper-features {
      position: relative;
      height: 100%;
      overflow: hidden;
    }
    
    .image-cards-right {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      padding: 24px;
    }
    
    .image-your-feed {
      max-width: 100%;
      height: auto;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    
    .image-iphone-left {
      transform: rotate(-5deg);
    }
    
    .display-6 {
      font-size: 32px;
      line-height: 1.2;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: -0.01em;
    }
    
    .max-w-400px {
      max-width: 400px;
    }
    
    .paragraph-large-4 {
      font-size: 18px;
      line-height: 1.6;
      color: var(--text-secondary);
    }
    
    .image-and-text-right-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }
    
    .image-and-text-left-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }
    
    .image-and-text-left---image {
      order: 2;
    }
    
    .image-and-text-right---image {
      order: 1;
    }
    
    .flex-vertical {
      display: flex;
      flex-direction: column;
    }
    
    .height-100 {
      height: 100%;
    }
    
    .image {
      max-width: 100%;
    }
    
    .border-radius-64px {
      border-radius: 24px;
    }
    
    .fit-cover {
      object-fit: cover;
    }
    
    .inner-container._600px---mbl {
      max-width: 600px;
    }
    
    .paragraph {
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .grid-1-column {
      display: grid;
      grid-template-columns: 1fr;
    }
    
    .gap-row-48px {
      row-gap: 48px;
    }
    
    .icon-list-item-wrapper {
      display: flex;
      gap: 16px;
    }
    
    .align-start {
      align-items: flex-start;
    }
    
    .icon-list-2 {
      width: 28px;
      height: 28px;
      margin-top: 4px;
    }
    
    .max-w-416px {
      max-width: 416px;
    }
    
    .heading-h3-size-2 {
      font-size: 20px;
      line-height: 1.4;
      font-weight: 600;
      color: var(--primary);
    }
    
    .mg-bottom-4px {
      margin-bottom: 4px;
    }
    
    .testimonial-section {
      padding: 80px 0;
      background-color: var(--surface-alt);
    }
    
    .container-default-4 {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    .text-center {
      text-align: center;
    }
    
    .paragraph-large-3 {
      font-size: 18px;
      line-height: 1.6;
      color: var(--text-secondary);
    }
    
    .max-w-812px {
      max-width: 812px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .container-default-7 {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    .mobile-hidden {
      display: block;
    }
    
    @media (max-width: 991px) {
      .card-4 {
        grid-template-columns: 1fr;
      }
      
      .image-and-text-right-wrapper {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      
      .image-and-text-left-wrapper {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      
      .image-and-text-left---image {
        order: 1;
      }
      
      .pd---content-inside-card-4 {
        padding: 40px;
      }
      
      .inner-container._100---tablet {
        max-width: 100%;
      }
    }
    
    @media (max-width: 767px) {
      .full-hero-image {
        margin-top: -20px;
        margin-bottom: 60px;
      }
      
      .mobile-hidden {
        display: none;
      }
      
      .mg-bottom-80px {
        margin-bottom: 60px;
      }
      
      .mg-bottom-40px {
        margin-bottom: 30px;
      }
      
      .about-grid {
        grid-template-columns: 1fr;
      }
      
      .principles-grid {
        grid-template-columns: 1fr;
      }
      
      .team-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .team-others-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    /* About page styles */
    .about-hero {
      background: linear-gradient(180deg, #FFF8F7 0%, #E3D8F5 100%);
      padding: 5rem 0 4rem;
      text-align: center;
      margin-bottom: 3rem;
      border-radius: 24px;
    }
    
    .about-hero-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .about-badge {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      padding: 0.5rem 1.25rem;
      border-radius: 50px;
      font-weight: 600;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }
    
    .about-section {
      padding: 4rem 0;
      margin-bottom: 2rem;
    }
    
    .about-section.light-bg {
      background-color: var(--surface-alt);
      border-radius: 24px;
    }
    
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      max-width: 1080px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .about-text {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .about-image img {
      max-width: 100%;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    }
    
    .text-center {
      text-align: center;
    }
    
    .mb-4 {
      margin-bottom: 2rem;
    }
    
    .principles-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1080px;
      margin: 3rem auto 0;
      padding: 0 1rem;
    }
    
    .principle-card {
      background-color: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .principle-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    }
    
    .principle-icon {
      width: 3rem;
      height: 3rem;
      background-color: var(--accent);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .team-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      max-width: 1080px;
      margin: 3rem auto 2rem;
      padding: 0 1rem;
    }
    
    .team-member {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .team-photo {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border: 4px solid white;
    }
    
    .team-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .team-role {
      color: var(--primary);
      font-weight: 600;
      margin: 0.25rem 0 0.75rem;
    }
    
    .team-bio {
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }
    
    .team-others {
      max-width: 1080px;
      margin: 0 auto 3rem;
      padding: 2rem;
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    
    .team-others h3 {
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .team-others-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    
    .team-other {
      background-color: var(--surface-alt);
      padding: 1.25rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    
    .team-other-name {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .team-other-role {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    
    .join-us {
      text-align: center;
      max-width: 600px;
      margin: 3rem auto 0;
      padding: 2rem;
      background: linear-gradient(180deg, #FFF8F7 0%, #E3D8F5 100%);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    
    .join-us h3 {
      margin-bottom: 1rem;
    }
    
    .join-us p {
      margin-bottom: 1.5rem;
    }
    
    @media (max-width: 991px) {
      .principles-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .team-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .team-others-grid {
        grid-template-columns: repeat(2, 1fr);
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
          <li><a href="/design-principles">Principles</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <main class="content">
    <div class="container">
      ${content}
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h4>About</h4>
          <ul>
            <li><a href="/about">Our Mission</a></li>
            <li><a href="/design-principles">Design Principles</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@rabble.community">Email Us</a></li>
            <li><a href="https://github.com/rabble-community">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div class="copyright">
        <p>&copy; 2025 Verse PBC · All rights reserved</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

// Page content in markdown format
const PAGES = {
  // Design Principles
  '/design-principles': `---
title: "Design Principles & Non‑Negotiables"
description: "The compass guiding Rabble's product decisions."
image: "/assets/og-principles.png"
---

### Design Principles
1. **Community Before Scale** – cultivate depth before headcount.
2. **Stewardship, Not Just Moderation** – empower human context.
3. **Ownership & Stability Over Virality** – build for resilience.
4. **Participation is a Spectrum** – honour lurkers, contributors, leaders.
5. **Make Contribution Frictionless** – generosity should be one‑click.
6. **Navigable Conversation** – lasting, searchable, structured.
7. **Rituals Create Belonging** – enable recurring shared moments.
8. **Bridge to Real World** – facilitate offline impact.
9. **Accessibility Beyond Usability** – mobile‑first, low‑bandwidth friendly.

### Non‑Negotiables
| Pillar | Required Capabilities |
|--------|----------------------|
| **Data Sovereignty & Resilience** | • One‑click data export <br>• Multi‑server redundancy <br>• Custom domains/branding |
| **Privacy‑First Architecture** | • Default E2EE <br>• Minimal metadata <br>• Federated infra |
| **Community‑First Governance** | • Custom rules <br>• Tiered moderation tools <br>• Transparent appeals |
| **Role & Participation Spectrum** | • Flexible roles <br>• Lurk/read‑only modes <br>• Pseudonymous accounts |
| **Async + Real‑Time Comms** | • Threaded boards <br>• Live chat & voice <br>• Integrated calendar/RSVP |
| **Built‑in Financial Tools** | • Donations & micropayments <br>• Membership tiers <br>• Revenue reports |
| **Discoverability sans Algorithms** | • Chronological & pinned posts <br>• Tag search <br>• No engagement farming |
| **Interoperability & Open Ecosystem** | • APIs & webhooks <br>• Federated identity <br>• Portable backups |

> These principles are baked into our roadmap.  Any feature request that conflicts is a non‑starter.`,

  // Landing page
  '/': `---
title: "Rabble — Reclaim Your Groups"
description: "Group spaces that truly belong to you, not a corporation."
image: "/assets/og-hero.png"
---

<div class="hero-section">
  <div class="hero-container">
    # Now your groups and communities belong to you, not a corporation.
    
    <p class="paragraph-large">Rabble is built on <a href="https://github.com/verse-pbc/plur" target="_blank">Nostr</a>, a decentralized, user-led protocol. Traditional social platforms treat your communities as products—focusing on ad revenues, profits, and engagement metrics. Finally, a group space that puts your community in control.</p>
    
    <div class="beta-badge">Beta</div>
    
    <div class="cta-container">
      [Open Web App](/app){.button-primary}
    </div>
    
    <div class="coming-soon">
      <span class="pill">Coming Soon:</span> iOS · Android · Desktop Apps
    </div>
  </div>
</div>

<div class="image-wrapper mg-top-80px position-relative full-hero-image">
  <!-- Image placeholder that you'll replace -->
  <img width="Auto" alt="Screenshots of Rabble group interface showing members, threads, and chat" src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/6761c593069d0edf1f726be7_Hero-3-phones.webp" class="image-hero"/>
</div>

<div class="gradient full-hero-image"></div>

<div class="section-features new-features">
  <div class="container-default-5">
    <div class="inner-container center">
      <div class="display-flex vertical-gap-35px mg-bottom-80px">
        <div class="card-4 features">
          <div class="pd---content-inside-card-4 features-content-left">
            <img alt="" src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a56da69918beb0d0fda82_feed-icon.svg" class="icon-card-features mg-bottom-32px"/>
            <h2 class="display-6 max-w-400px mg-bottom-40px">Your community,<br/>your choice</h2>
            <div class="mg-top-16px-2">
              <p class="paragraph-large-4">Create spaces for clubs, activism, families, and fandoms – entirely on your terms.<br/><br/>Free from algorithms, ads, and corporate control.</p>
            </div>
          </div>
          <div class="image-wrapper-features image-cards-right">
            <!-- Left feature image placeholder -->
            <img alt="A screenshot of the Rabble app showing a group discussion" src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/66e054d8cd789f85f86bf048_your-feed.webp" class="image-your-feed image-iphone-left"/>
          </div>
        </div>
      </div>
    </div>
    
    <div class="image-and-text-right-wrapper mg-bottom-80px">
      <div class="inner-container image-and-text-left---image">
        <div class="flex-vertical height-100">
          <!-- Right feature image placeholder -->
          <img class="image border-radius-64px fit-cover height-100" src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a3b02259c979f776dfcd2_ad-free.webp" alt="A grid of group posts in Rabble" style="opacity:1;" sizes="(max-width: 479px) 87vw, (max-width: 767px) 84vw, (max-width: 991px) 90vw, (max-width: 1439px) 42vw, 598.984375px" srcset="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a3b02259c979f776dfcd2_ad-free-p-500.webp 500w, https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a3b02259c979f776dfcd2_ad-free.webp 705w"/>
        </div>
      </div>
      <div class="inner-container _600px---mbl">
        <div class="inner-container _580px _100---tablet">
          <img alt="" src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a5e963db3221528278dcd_no-ads-icon.svg" class="icon-card-features mg-bottom-32px"/>
          <h2 class="display-6">Ad-free group spaces</h2>
          <p class="paragraph-large-4">No interruptions, no spying, no selling your community's data.<br/><br/>On Rabble, we're building for communities, not advertisers.</p>
        </div>
      </div>
    </div>
    
    <div class="image-and-text-left-wrapper mg-bottom-80px">
      <div class="inner-container image-and-text-right---image">
        <div class="flex-vertical height-100">
          <!-- Left feature image placeholder -->
          <img class="image border-radius-64px fit-cover height-100" src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a3b02259c979f776dfce5_many-apps.webp" width="Auto" height="Auto" alt="A grid of Nostr app icons" style="opacity:1;" sizes="(max-width: 479px) 87vw, (max-width: 767px) 84vw, (max-width: 991px) 90vw, (max-width: 1439px) 43vw, 619.984375px" srcset="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a3b02259c979f776dfce5_many-apps-p-500.webp 500w, https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a3b02259c979f776dfce5_many-apps.webp 705w"/>
        </div>
      </div>
      <div class="inner-container _580px _100---tablet">
        <img alt="" src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669a59d11ab176d6e9098080_identity-icon.svg" class="icon-card-features mg-bottom-32px"/>
        <h2 class="display-6">One group,<br/>multiple platforms</h2>
        <p class="paragraph-large-4">Your group lives on the Nostr network, not a single app.<br/><br/>Members can participate from any compatible app, on any device – no more platform lock-in.</p>
      </div>
    </div>
    
    <div class="image-and-text-right-wrapper mg-bottom-80px protocols">
      <div class="inner-container image-and-text-left---image">
        <div class="flex-vertical height-100 protocols-image">
          <!-- Right feature image placeholder -->
          <img style="opacity:1;" alt="Illustration showing community ownership concept" src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/669e60ec659c956f2b5f94d0_other-protocols.webp" class="image border-radius-64px fit-cover height-100"/>
        </div>
      </div>
      <div class="inner-container _600px---mbl">
        <div class="inner-container _580px _100---tablet">
          <h2 class="display-6">Community-governed spaces</h2>
          <p class="paragraph-large-4">Your community, your rules. Create custom governance models with transparent moderation.<br/><br/>No more arbitrary decisions from corporate overlords.</p>
        </div>
      </div>
    </div>
    
    <div class="image-and-text-left-wrapper">
      <div class="inner-container image-and-text-right---image mobile-hidden">
        <div class="flex-vertical height-100">
          <!-- Left feature image placeholder -->
          <img style="opacity:1;" alt="An illustration of a decentralised network of users" src="https://cdn.prod.website-files.com/664e0969475229f991b46566/664e0969475229f991b4673a_cooperative-commons.png" class="image border-radius-64px fit-cover height-100"/>
        </div>
      </div>
      <div class="inner-container _600px---mbl">
        <div class="inner-container _580px _100---tablet">
          <div class="inner-container _500px---tablet">
            <div class="inner-container _400px---mbl">
              <h2 class="display-6">Building better online communities together</h2>
            </div>
          </div>
          <p class="paragraph mg-bottom-32px">Open Source, Open Society. Rabble is built in the open and with community input.</p>
          <div class="grid-1-column gap-row-48px">
            <div class="icon-list-item-wrapper align-start">
              <img alt="" src="https://cdn.prod.website-files.com/664e0969475229f991b46566/664e0969475229f991b4672f_versioning-icon.svg" class="icon-list-2"/>
              <div class="max-w-416px">
                <h1 class="heading-h3-size-2 mg-bottom-4px">Open Source</h1>
                <div class="paragraph">Rabble is <a href="https://github.com/verse-pbc/plur/">open source</a>. Transparency is real when you can read and modify the source code.</div>
              </div>
            </div>
            <div class="icon-list-item-wrapper align-start">
              <img alt="" src="https://cdn.prod.website-files.com/664e0969475229f991b46566/664e0969475229f991b46739_shaka-icon.svg" class="icon-list-2"/>
              <div class="max-w-416px">
                <h1 class="heading-h3-size-2 mg-bottom-4px">Get involved!</h1>
                <div class="paragraph">Follow us on <a href="https://github.com/verse-pbc/plur">GitHub</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<section class="testimonial-section">
  <div class="container-default-4">
    <div class="inner-container">
      <div class="text-center mg-bottom-80px">
        <h2 class="display-6 title">Communities free from corporate control</h2>
        <p class="paragraph-large-3 mg-bottom-40px max-w-812px">Hear what community leaders are saying about why they've moved their groups to Rabble.</p>
      </div>
      <div class="testimonial">
        "Within a week we'd migrated our 120‑member collective off Facebook Groups. Now we actually own our space, set our own moderation policies, and don't have to worry about algorithms hiding our most important announcements."
        <small>— Maya, community organizer</small>
      </div>
    </div>
  </div>
</section>

<section id="download">
  <div class="container-default-7">
    <div class="text-center">
      <h3 class="display-6">Rabble Beta — Web App Available Now</h3>
      <div class="feature-card" style="max-width: 600px; margin: 2rem auto;">
        <div class="cta-container" style="margin-top: 0;">
          <a href="/app" class="button-primary">Open Web App</a>
        </div>
        <div class="app-status">
          <p>The Rabble Beta is currently available as a web app. Native iOS, Android, and desktop apps are in development and coming soon.</p>
          <p>Follow <a href="https://github.com/verse-pbc/plur">@verse-pbc/plur on GitHub</a> for updates.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,

  // About page
  '/about': `---
title: "About Rabble & Verse PBC"
description: "Reimagining social media that serves people, not advertisers."
image: "/assets/og-about.png"
---

<div class="about-hero">
  <div class="about-hero-content">
    <span class="about-badge">Our Mission</span>
    <h1>Creating social spaces that belong to communities, not corporations</h1>
    <p class="paragraph-large">Verse PBC's mission is to provide social technologies and apps that the public can co-build, and to mitigate the harm of private ownership of social identities and data.</p>
  </div>
</div>

<div class="about-section light-bg">
  <div class="about-grid">
    <div class="about-text">
      <h2>A Public Benefit Corporation</h2>
      <p>Unlike traditional companies that maximize shareholder value, Verse PBC is legally bound to prioritize public good over profit. We answer to a charter, not venture-capital metrics.</p>
      <p>We believe that private control of social media has created toxic digital spaces that commodify human connection. Rabble is our answer – a platform where communities truly own themselves.</p>
    </div>
    <div class="about-image">
      <img src="https://cdn.prod.website-files.com/65f32b5e045a6a52deacd47c/664f75b3a55a57b4abb69f8c_about-pbc.png" alt="Public Benefit Corporation" />
    </div>
  </div>
</div>

<div class="about-section">
  <h2 class="text-center">Our Guiding Principles</h2>
  <div class="principles-grid">
    <div class="principle-card">
      <div class="principle-icon">✓</div>
      <h3>User Sovereignty</h3>
      <p>Your data belongs to you. Export your identity, keys, and content anytime. No platform lock-in.</p>
    </div>
    <div class="principle-card">
      <div class="principle-icon">✓</div>
      <h3>Privacy by Default</h3>
      <p>End-to-end encryption, no tracking pixels, and minimal logs. We don't monetize your personal information.</p>
    </div>
    <div class="principle-card">
      <div class="principle-icon">✓</div>
      <h3>Open Foundations</h3>
      <p>Built on Nostr, an open protocol with open-source code. Transparency is real when you can read and modify the source.</p>
    </div>
  </div>
</div>

<div class="about-section light-bg">
  <h2 class="text-center">Meet Our Team</h2>
  <p class="text-center paragraph-large mb-4">We're builders, designers, and community advocates working to reimagine social technology.</p>
  
  <div class="team-grid">
    <div class="team-member">
      <div class="team-photo">
        <img src="https://nos.social/img/team/evan.webp" alt="Evan Henshaw-Plath" />
      </div>
      <h3>Evan Henshaw-Plath</h3>
      <p class="team-role">Founder & CEO</p>
      <p class="team-bio">Twitter's first engineer, decentralized tech advocate, and community builder. Founded Rabble to put people before profit.</p>
    </div>
    
    <div class="team-member">
      <div class="team-photo">
        <img src="https://nos.social/img/team/matt.webp" alt="Matt Lorentz" />
      </div>
      <h3>Matt Lorentz</h3>
      <p class="team-role">CTO</p>
      <p class="team-bio">Technology leader with expertise in scaling and stabilizing complex systems. Building the technical foundation for ethical social platforms.</p>
    </div>
    
    <div class="team-member">
      <div class="team-photo">
        <img src="https://nos.social/img/team/shaina.webp" alt="Shaina Thompson" />
      </div>
      <h3>Shaina Thompson</h3>
      <p class="team-role">Chief of Staff</p>
      <p class="team-bio">Operations expert keeping Verse running smoothly while implementing our vision of ethical communication tools.</p>
    </div>
    
    <div class="team-member">
      <div class="team-photo">
        <img src="https://nos.social/img/team/daniel.webp" alt="Daniel Cadenas" />
      </div>
      <h3>Daniel Cadenas</h3>
      <p class="team-role">Backend Developer</p>
      <p class="team-bio">Systems architect specializing in decentralized infrastructure and resilient server design.</p>
    </div>
  </div>
  
  <div class="team-others">
    <h3>Our Extended Team</h3>
    <div class="team-others-grid">
      <div class="team-other">
        <span class="team-other-name">Josh Brown</span>
        <span class="team-other-role">iOS Developer</span>
      </div>
      <div class="team-other">
        <span class="team-other-name">Itunu Raimi</span>
        <span class="team-other-role">iOS Engineer</span>
      </div>
      <div class="team-other">
        <span class="team-other-name">Martín Dutra</span>
        <span class="team-other-role">iOS Developer</span>
      </div>
      <div class="team-other">
        <span class="team-other-name">Sebastian Heit</span>
        <span class="team-other-role">Design</span>
      </div>
    </div>
  </div>
  
  <div class="join-us">
    <h3>Join Our Mission</h3>
    <p>We're looking for passionate people who believe in building a better digital future.</p>
    <a href="https://verse-pbc.org/jobs" class="button-primary">View Open Roles</a>
  </div>
</div>`,

  // Privacy Policy
  '/privacy-policy': `---
title: "Privacy Policy"
description: "Your data, your rules."
---

# Privacy Policy

Rabble is a social app for building authentic human connections without algorithms, ads, or corporate ownership.

## Our commitments

We are committed to:
- Creating a social app with less abuse and harassment by design
- Minimizing centralized data collection and respecting our users' privacy
- Empowering users to control what they see and how they want to see it
- You owning your identity so you can move to another service if you don't like ours

Unlike other social apps which are designed to turn your private information into revenue, our goal is to collect as little information about you as practically possible, and make money by providing services that you actually want to use.

However, there is some information that we have to collect—and some that we'd like to collect with your permission—in order for our service to work as well as possible.

In this Privacy Policy, we explain what information we collect, store and when we share it. We also explain the controls you have over your data and how you can delete it.

## TLDR

We strongly recommend that you read this policy in full, but just in case you don't have time, here are a few things we want to make sure everyone knows:

- Rabble is not designed for children and if you're under 16 you can't sign up. This is both because of laws in the EU and the US and also because we take our responsibility to protect children seriously.

- All social networks are about sharing your updates and information with other people and Rabble is no exception. If you write a note on Rabble it will be, by default, public and other people will be able to see it, react to it and share it with other people.

- Rabble is built using the Nostr protocol which distributes your notes to a multitude of relays of your choosing. This means—as with email and the web—that no one company can own or control the whole thing. And again, just like with e-mail, it means people may view your content on apps that we didn't design and store it on servers that we don't control. Always remember, as with anything you put on the internet, someone may choose to keep a copy of what you've said.

- While we recommend you use your real name so your friends can find you, we don't require that you do so. If you'd rather use a pseudonym or your non-legal name, that's fine too.

- We collect some information about how people use the app so that we can spot problems, bugs and determine the usage of features. Generally, we do that in an anonymized fashion. If there are exceptions they're listed explicitly in this document. Our feeling is that we don't need to know people's names to track that lots of people like a feature or are having a problem. 

- There is some information that we receive automatically including your IP address. We can't do much about this—it's how the internet works—but we try to keep it to a minimum.

- If you have questions about this policy, what information we collect and how we use it, or anything else related to your data or privacy, you can contact us at privacy@rabble.community at any time. We want to hear from you!

## Your data on Distributed Social Networks

Rabble is built on a technology called Nostr and works a bit differently from existing social media apps. It's important that you understand the differences.

Most social media apps are run by one company and all your information is stored on their servers. 

With Rabble and Nostr, all your publicly shared content is stored on multiple relays of your choosing. Anyone can run a relay. When you open Rabble, it will search the relays in the network to see if there are new notes from the people you follow.

Other users can read or interact with your notes using any compatible piece of software.

In some ways, it's a bit like email. Anyone can run a server or build an app and messages and posts will move between them, no matter which app they were written on or which company made it.

It's these differences that mean that the network can't be owned or controlled exclusively by any one company, it's why it's a true and open public space, it's why it's possible for any organization to build an app to access the network, and it's why it's resistant to centralized data collection and advertising. It also means, just like with email, that people may view your content on apps that we didn't design and store it on servers that we don't control.

It's important to remember that while we can delete things for you from our servers, as with anything you put out on the public Internet, we can't stop people keeping a copy or record of what you've said or shared elsewhere.

## Information you share with Rabble

### Basic account information:

If you want to use Rabble, there's some information we as a company have to collect. This includes your Display Name (how you want people to see you on the network), and your 'public identifier' (a cryptographic key, similar to a bitcoin wallet address, which is the way you are technically identified on the network). There are some other bits of information that are stored on your device which we intentionally don't have access to - for example your 'private key' (which is like your password). If you lose that, we can't recover it, so back it up!

### Things that you post in public:

Once you've created an account on Rabble, you will have a public profile that anyone can see if they know your 'public identifier' (basically your address). During sign-up you can choose to enhance that profile by writing a short bio, choosing a photo to represent yourself, or by adding links to your other social media profiles. You can change any of this information on your Profile page.

When you write a note it will be—by default—public and visible to anyone who knows its address as well as to anyone who is following you.

Each of your public notes contains more than just the content of your message. It also includes your Display name, a link to your profile, your 'public identifier' and the time the note was created. The same applies when you write a reply to someone else's note.

In addition, the people you follow and who follow you, and the notes that you 'like' are all public information.

Again, please be careful about what you post on Rabble - particularly when you're giving out sensitive information. We can update our servers when you edit your profile information, and we can delete things at your request, but we can't stop other people keeping a copy or record of the things you've said or shared.

### Changing your Settings

You can change your bio, your avatar image and any links you may have to other social media products on your profile at any time in the app.

### Deleting your content

You can delete any note you make on Rabble. The way deletion works on a Distributed Social Network is that we remove your content from our relays and tell all the other relays that you use that they should remove your note too. Please remember though—as with all other internet products—once you've put something out there we can't stop people keeping a copy or a record of what you've said.

### Taking your identity to another service

We are committed to make it easy for you to take your content, friends and all your account details to another Nostr-compatible service or app if you don't like Rabble or our policies. To transfer to another service, all you need is your public identifier and your private key. When you put these into another Nostr client, that app will look online for all the content you've created and attempt to rebuild your account automatically.

## Other information we may receive

Beyond the limited amount of information we need for legal reasons and the content you create in public—which will most likely be replicated on our servers—we make considerable efforts to not collect vast stores of information about you or the things you interact with. However there is some information we need to be able to operate Rabble.

### App Analytics and Error Reporting

By default, Rabble keeps log data of people's use of the app and the device that it's running on as well as when there's a crash or error reported. We use this data so that we can see how the app is functioning, spot problems and know which parts of the service people use or don't use. We keep this information anonymized though - our feeling is that we don't need to know your name to track that lots of people like a feature or are having a problem.

### Information from Abuse or Bug Reports

On occasion you may choose to file a report of abusive behavior or a bug on Rabble. In those circumstances we keep the content of your report, a log of the problem or a copy of the content being reported, as well as your name, public identifier and contact details so we can respond to your concern. It's possible that someone else may report your content for abuse or harassment or as a violation of our rules. If that happens, we will keep a record of that complaint along with any associated content for our records.

## When we share your information

Again, our goal is to collect as little information about you as we practically can, and make money by providing services that you actually want to use. But there is some data sharing that is necessary for us to run Rabble.

### As a normal part of running a Distributed Social Network

Again, Rabble works fundamentally differently to mainstream social media. That means that your public content will get automatically 'replicated' to servers that we don't own or control. This is core to making it an open environment—a true public—that no one company can control. In many ways this is more similar to how the web works (you can build a webpage that is public and can be accessed by a variety of different browsers made by different people) or how email works (you send a message that travels across different servers run by different people, and can be read on a variety of applications) than it is to how services like Twitter or Facebook work.

### As necessary with third-party services we use to operate Rabble

We use a variety of third-party services to help us operate our services. We may share your private personal data with service providers like these in the course of our work subject to obligations consistent with this Privacy Policy and any other appropriate confidentiality and security measures, and on the condition that these third parties use your private personal data only on our behalf and pursuant to our instructions.

### When reasonably required by law or government

Whatever else it says in this Privacy Policy, if we believe it is reasonably necessary to save, use or disclose your personal data to comply with laws, regulations, legal processes or governmental requests, then we will do so. The same applies if we think it's reasonably necessary to protect someone's safety or to protect them from fraud, or to keep our services secure, or to stop abusive, malicious or spamming behavior on our platform. However, nothing in this Privacy Policy is intended to limit any legal defenses or objections that you may have to a third party's—including a government's—request to disclose your personal data.

### If there's a Change in Ownership

We have to bear in mind the possibility that the company at some point might go bankrupt, merge with another company, be acquired, or its assets might be sold. Under such circumstances, the limited personal data we store about you may be sold or transferred as part of that transaction. This Privacy Policy will still apply to your personal data.

## How to manage your information

### Changing your personal data

You can change your profile data within the app.

### Deleting your information or your account

You can delete any note you've written at any time. As always, remember that while we can remove this content from your log, from our servers and from our applications, we can't stop someone else keeping a copy of what you've written. Deleting the application from your device will not remove your content from the Internet, and if you lose your private key, you may not be able to ever remove it - so please be careful and keep a back-up of it. 

If you want to delete your account completely, you can do so from your Settings screen. This will remove all the written content from your log, leaving only some basic metadata as a record, will remove your content from the Rabble app, and will instruct other servers and applications that you want your content to be removed too. Just remember, again, that much like anything you publish on the internet, we can't stop someone else from retaining a copy of what you've written. If you find they are doing that, many jurisdictions allow you to contact them directly and require them to remove your content if requested. We retain information collected for analytics or error reporting purposes for a maximum of 18 months.

### Data portability

One of our core commitments is to make it easy for you to move your identity to another service if you decide you don't like ours. To do this, access your private key from your Settings menu. Copy that key and input it into a compatible Nostr-based application and then delete the Rabble application from your device.

## Children

We want Rabble to be a free and open environment for adults, and just like in the real world, that means on occasion that some parts of it might not be suitable for children. The law in many countries recognizes this too as well as indicating that children under sixteen may not be old enough to understand the consequences - and legally consent - to the processing of their personal data. For these reasons, we do not allow children under sixteen to use Rabble.

## Global operations

Rabble is operated by Verse PBC, an American corporation primarily operating in the United States, and our servers are located there. Where the laws of your country allow you to do so, you authorize us to transfer, store and use the data we've described above in the United States and any other country where we operate. Remember as always that Rabble works as part of a Distributed Social Network where anyone can run a server or build an app to access it. Just like with email, your content and log data will leave our servers and be replicated to people who request or access it, wherever they are in the world.

## Changes to this Privacy Policy

On occasion it's necessary for us to revise this Privacy Policy to keep it up to date with what we're doing and the law. The most current version of the policy is always the one that describes how we handle your personal data and will always be available at https://rabble.community/privacy-policy. If we make a change to this policy that in our discretion is material, we will notify you within the Rabble application or via your contact details. By continuing to access your account or use any of Rabble's services after those changes become effective, you agree to be bound by the revised Privacy Policy.

## Contact us

If you have questions about this Privacy Policy, what information we collect and how it is used and distributed - or anything else related to your data or privacy, you can contact us at any time. Our e-mail address is privacy@rabble.community.

---

*Last Updated: April 25, 2025*`,

  // Terms of Service
  '/terms-of-service': `---
title: "Terms of Service"
description: "Rules to keep Rabble safe & sustainable."
---

# Terms of Service

This Terms of Service ("Terms") governs your access to and use of the services provided by Verse PBC ("we," "us," or "our") through the Rabble application.

## Quick Summary
- **Be excellent** — no hate speech, harassment, or illegal content
- **You own your posts**; we need a license to display them
- **No guarantees** — beta software can break; export keys regularly
- **Age restriction** — you must be 16 or older to use Rabble
- **Disputes** — US law; arbitration before courts

## 1. Acceptance of Terms

By creating an account, accessing or using the Rabble application, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access or use our services.

## 2. Eligibility

You must be at least 16 years old to use Rabble. By using Rabble, you represent and warrant that you meet this age requirement.

## 3. Account Creation and Security

When you create an account with Rabble, you are responsible for safeguarding your private key. Your account is created through the Nostr protocol which generates a public/private key pair. We cannot recover your private key if you lose it, so please make sure to back it up securely. You are responsible for all activities that occur under your account.

## 4. User Content

### 4.1 Content Ownership
You retain ownership rights to all content you create, upload, or share on Rabble ("User Content"). By posting User Content on Rabble, you grant us a non-exclusive, royalty-free, worldwide, transferable license to use, reproduce, modify, adapt, publish, translate, distribute, and display such User Content in connection with providing and promoting our services.

### 4.2 Content Responsibility
You are solely responsible for your User Content and the consequences of posting it. You affirm that you either own or have the necessary licenses, rights, and permissions to post your User Content on Rabble.

### 4.3 Prohibited Content
You agree not to post User Content that:
- Is illegal or promotes illegal activities
- Is harassing, abusive, threatening, or harmful toward others
- Infringes upon or violates the intellectual property rights of others
- Contains sexually explicit or graphic material
- Impersonates another person or entity in a misleading way
- Contains malware, viruses, or other harmful code
- Spams or floods the service with excessive content
- Violates any applicable law or regulation

## 5. Content Moderation

We strive to create a positive community environment. We reserve the right, but not the obligation, to monitor and moderate User Content. We may remove or refuse to distribute any User Content that violates these Terms or that we reasonably believe may be harmful to other users or to us.

## 6. Distributed Nature of Service

Rabble is built on the Nostr protocol, which means your content may be distributed across multiple servers not controlled by us. You understand and agree that:
- Your public content will be distributed to multiple relays
- Other users can access your public content through different applications
- We cannot guarantee complete deletion of your content from all relays
- Once published, your content may be saved or copied by others

## 7. Service Availability and Changes

### 7.1 Beta Status
Rabble is currently in beta, which means it may contain bugs or errors and may not function as intended. We make no guarantees about the reliability, availability, or performance of our services.

### 7.2 Service Changes
We reserve the right to modify, suspend, or discontinue any part of our services at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of our services.

## 8. Intellectual Property

Except for User Content, all content, features, and functionality of Rabble, including but not limited to text, graphics, logos, icons, and software, are owned by or licensed to us and are protected by copyright, trademark, and other intellectual property laws.

## 9. Disclaimer of Warranties

RABBLE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

## 10. Limitation of Liability

TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF, OR INABILITY TO ACCESS OR USE, THE SERVICES.

## 11. Indemnification

You agree to defend, indemnify, and hold harmless Verse PBC and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable attorneys' fees and costs, arising out of or in any way connected with your access to or use of the services or your violation of these Terms.

## 12. Governing Law and Dispute Resolution

These Terms shall be governed by and construed in accordance with the laws of the United States. Any dispute arising from or relating to these Terms or your use of Rabble shall be resolved through arbitration in accordance with the American Arbitration Association's rules before resorting to litigation.

## 13. Changes to Terms

We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will notify you through the Rabble application or by other means. Your continued use of Rabble after such notification constitutes your acceptance of the modified Terms.

## 14. Termination

We may terminate or suspend your access to all or part of Rabble, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.

## 15. Miscellaneous

If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will continue in full force and effect.

---

*Last Updated: April 25, 2025*

For questions about these Terms, please contact us at legal@rabble.community.`,

  // FAQ
  '/faq': `---
title: "Frequently Asked Questions"
description: "Everything you wanted to know about leaving Meta behind."
---

### Is Rabble a Facebook/WhatsApp replacement?
Yes — but without ads, data harvesting, or algorithmic feeds.

### Do I need to understand crypto or Nostr?
No. Rabble works like any modern chat app. Keys & relays are optional‑advanced settings.

### How is this free if you don't sell ads?
We'll launch optional paid perks (custom domains, extra storage) — core chat stays free forever.

### Can I export or move my group later?
Absolutely. You can download your archive and import it elsewhere.`,

  // Roadmap
  '/roadmap': `---
title: "Product Roadmap"
description: "From beta to global federation."
---

| Quarter | Milestone | Status |
|---------|-----------|--------|
| Q2 2025 | **Closed Beta** — invite‑only iOS + Android | 🔄 In progress |
| Q3 2025 | **App Store Launch** | ⏳ |
| Q4 2025 | **Groups v2** (threads, file sharing) | ⏳ |
| 2026    | **Relay Grants** — fund 10 independent relays | ⏳ |`,

  // Developers
  '/developers': `---
title: "Developers"
description: "APIs, SDKs, and open‑source repos."
---

### GitHub Repos
- **rabble‑app** — Next.js + React Native mono‑repo
- **rabble‑relay‑tools** — scripts for relay ops

### Quick Start
\`\`\`bash
# Install CLI
yarn global add @rabble/cli
# Post a note
rabble note "Hello world" --relay wss://relay.verse.nz
\`\`\`

### API Reference
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| \`/api/upload\` | POST | JWT | Media upload, returns URL |
| \`/api/relay-stats\` | GET | None | JSON of public relay uptime |`,

  // Blog post
  '/blog/2025-04-24-welcome-to-rabble': `---
title: "Why We're Reclaiming Our Groups"
description: "Centralised social media is broken. Here's our fix."
image: "/assets/blog/welcome.webp"
---

# Why We're Reclaiming Our Groups

Social networks once promised global connection. Today they gatekeep speech, harvest data, and nudge behaviour for ad spend.

When Facebook started in college dorms, it was simple — connect with peers. As it evolved into Meta, a different agenda emerged. Communities became products, not people. Engagement metrics trumped human connection. Groups became vehicles for advertising and behavior tracking.

Rabble takes us back to basics: 

* **User sovereignty** - You hold your keys, own your data
* **No surveillance** - Your digital life isn't for sale
* **Community control** - Decisions made by members, not algorithms
* **Interoperability** - Take your identity and posts to any compatible service

We believe social media can be better — can be both enjoyable and ethical. We challenge the notion that exploitation is necessary for sustainability. Our public-benefit corporation structure ensures we're accountable to these values, not just profit.

Join us in building social media that serves people first.`,

  // Blog index
  '/blog': `---
title: "Rabble Blog"
description: "Updates from the Rabble team."
---

# Latest from Rabble

## [Why We're Reclaiming Our Groups](/blog/2025-04-24-welcome-to-rabble)
*April 24, 2025*

Social networks once promised global connection. Today they gatekeep speech, harvest data, and nudge behaviour for ad spend...

[Read more →](/blog/2025-04-24-welcome-to-rabble)`,
};

// Create invite landing page for /i/:code
function createInvitePage(code: string, groupId: string, relay: string, isDirectProtocolInvite = false): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join Rabble Group - Rabble Community</title>
  <meta name="description" content="You've been invited to join a Rabble group. Rabble is private, ad-free social messaging where you set the rules.">
  <meta property="og:title" content="Join Rabble Group">
  <meta property="og:description" content="You've been invited to join a Rabble group. Rabble is private, ad-free social messaging where you set the rules.">
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
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .header {
      background-color: var(--primary);
      color: white;
      padding: 1rem 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
    }
    
    .content {
      padding: 3rem 0;
      flex: 1;
      display: flex;
      align-items: center;
    }
    
    .invite-card {
      background-color: white;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 2rem;
      text-align: center;
      width: 100%;
    }
    
    .group-info {
      margin: 2rem 0;
    }
    
    .group-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: var(--primary);
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      font-weight: 700;
    }
    
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    p {
      margin-bottom: 1.5rem;
      color: var(--text-secondary);
    }
    
    .button-primary {
      display: inline-block;
      background-color: var(--secondary);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      margin-bottom: 1rem;
      width: 100%;
      transition: background-color 0.2s;
    }
    
    .button-primary:hover {
      background-color: #ff6633;
    }
    
    .button-secondary {
      display: inline-block;
      background-color: white;
      color: var(--primary);
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      border: 1px solid var(--primary);
      margin-bottom: 1rem;
      width: 100%;
      transition: background-color 0.2s;
    }
    
    .button-secondary:hover {
      background-color: var(--surface-alt);
    }
    
    .footer {
      background-color: #2C2141;
      color: white;
      padding: 2rem 0;
      font-size: 0.875rem;
      text-align: center;
    }
    
    .footer a {
      color: white;
      opacity: 0.8;
      text-decoration: none;
    }
    
    .footer a:hover {
      opacity: 1;
    }
    
    #group-name {
      font-weight: 600;
    }
    
    .hidden {
      display: none;
    }
    
    small {
      display: block;
      margin-top: 1rem;
      color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <a href="/" class="logo">Rabble</a>
    </div>
  </header>
  
  <main class="content">
    <div class="container">
      <div class="invite-card">
        <div class="group-info">
          <div class="group-avatar" id="group-avatar">R</div>
          <h1>You're Invited to Join</h1>
          <p id="group-name">Loading group info...</p>
        </div>
        
        <a href="${isDirectProtocolInvite ? `plur://join-community?group-id=${groupId}&code=${code}&relay=${encodeURIComponent(relay)}` : `plur://join-community?group-id=${groupId}&code=${code}&relay=${encodeURIComponent(relay)}`}" class="button-primary" id="open-app">Open in Plur App</a>
        <a href="https://play.google.com/store/apps/details?id=app.verse.prototype.plur" class="button-secondary" id="get-android">Get on Android</a>
        <a href="https://apps.apple.com/app/plur/id1234567890" class="button-secondary" id="get-ios">Get on iOS</a>
        <a href="/app?group-id=${groupId}&code=${code}&relay=${encodeURIComponent(relay)}" class="button-secondary" id="open-web">Continue in Browser</a>
        
        <small>Group ID: ${groupId}<br>Relay: ${relay}</small>
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h4>About</h4>
          <ul>
            <li><a href="/about">Our Mission</a></li>
            <li><a href="/design-principles">Design Principles</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@rabble.community">Email Us</a></li>
            <li><a href="https://github.com/rabble-community">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div class="copyright">
        <p>&copy; 2025 Verse PBC · All rights reserved</p>
      </div>
    </div>
  </footer>
  
  <script>
    // Platform detection for showing appropriate buttons
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    // Show/hide appropriate download buttons
    document.getElementById('get-android').style.display = isAndroid ? 'inline-block' : 'none';
    document.getElementById('get-ios').style.display = isIOS ? 'inline-block' : 'none';
    
    // For demo purposes, we're simulating a group name
    // In production, this would fetch actual group metadata from the relay
    document.getElementById('group-name').textContent = 'Community Group';
    
    // Set the first letter of the group name as the avatar (as a fallback)
    document.getElementById('group-avatar').textContent = 'C';
  </script>
</body>
</html>`;
}

// Helper function to detect file extension and return mime type
function getMimeType(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'txt': 'text/plain',
    'pdf': 'application/pdf',
  };
  
  return mimeTypes[extension || ''] || 'application/octet-stream';
}

// Function to proxy content from another URL
async function proxyContent(url: string, request: Request): Promise<Response> {
  // Clone headers from the original request
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key !== 'host') {
      headers.set(key, value);
    }
  });
  
  // Fetch the content from the target URL
  const response = await fetch(url, {
    method: request.method,
    headers,
    body: request.body,
    redirect: 'follow',
  });
  
  // For HTML responses, we'll use HTMLRewriter to modify links
  if (response.headers.get('content-type')?.includes('text/html')) {
    return new HTMLRewriter()
      .on('a', {
        element(element) {
          const href = element.getAttribute('href');
          if (href && href.startsWith('/')) {
            element.setAttribute('href', `/app${href}`);
          }
        }
      })
      .on('link', {
        element(element) {
          const href = element.getAttribute('href');
          if (href && href.startsWith('/')) {
            element.setAttribute('href', `/app${href}`);
          }
        }
      })
      .on('script', {
        element(element) {
          const src = element.getAttribute('src');
          if (src && src.startsWith('/')) {
            element.setAttribute('src', `/app${src}`);
          }
        }
      })
      .on('img', {
        element(element) {
          const src = element.getAttribute('src');
          if (src && src.startsWith('/')) {
            element.setAttribute('src', `/app${src}`);
          }
        }
      })
      .transform(response);
  }
  
  // For other types of content, just pass through
  return response;
}

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
    
    // Handle /api routes for invite management
    if (path.startsWith('/api/invite')) {
      // GET /api/invite/:code - Get invite details
      if (request.method === 'GET' && path.match(/^\/api\/invite\/\w+$/)) {
        const code = path.split('/').pop() || '';
        const inviteData = await env.INVITES.get(code);
        
        if (!inviteData) {
          return new Response(JSON.stringify({ error: 'Invite not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({ 
          code, 
          ...JSON.parse(inviteData) 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // POST /api/invite - Create new invite
      if (request.method === 'POST' && path === '/api/invite') {
        // Check for valid auth token
        const token = request.headers.get('X-Invite-Token');
        if (token !== env.INVITE_TOKEN) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Parse request body
        const body: any = await request.json();
        const { groupId, relay } = body as { groupId: string, relay: string };
        
        if (!groupId || !relay) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Generate unique code
        const code = generateCode(8);
        
        // Store in KV
        await env.INVITES.put(code, JSON.stringify({ groupId, relay }));
        
        // Return the new invite
        return new Response(JSON.stringify({
          code,
          url: `${url.origin}/i/${code}`
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Method not allowed
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle invite pages (/i/:code or /i/plur://...)
    if (path.startsWith('/i/')) {
      // Extract everything after /i/
      const fullPath = path.substring(3);
      
      // Case 1: Direct protocol URL with parameters (plur://join-community?group-id=X&code=Y&relay=Z)
      if (fullPath.startsWith('plur://')) {
        try {
          // The format is not a standard URL, so we need to parse it manually
          // First, extract the query part
          const queryStart = fullPath.indexOf('?');
          
          if (queryStart !== -1) {
            // Parse the parameters manually
            const queryPart = fullPath.substring(queryStart + 1);
            const queryParams = new URLSearchParams(queryPart);
            
            // Extract group ID and relay
            const groupId = queryParams.get('group-id') || '';
            const inviteCode = queryParams.get('code') || '';
            const relayEncoded = queryParams.get('relay') || '';
            const relay = relayEncoded ? decodeURIComponent(relayEncoded) : '';
            
            if (groupId && relay) {
              // Generate a preview page for the direct protocol URL
              const html = createInvitePage(inviteCode, groupId, relay, true);
              return new Response(html, {
                headers: { 'Content-Type': 'text/html' }
              });
            }
          }
        } catch (e) {
          console.error('Failed to parse protocol URL:', e);
        }
      }
      
      // Case 2: Simple KV-based code
      if (fullPath.match(/^\w+$/)) {
        const code = fullPath;
        const inviteData = await env.INVITES.get(code);
        
        if (inviteData) {
          const data = JSON.parse(inviteData as string) as { groupId: string, relay: string };
          const html = createInvitePage(code, data.groupId, data.relay);
          
          return new Response(html, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      }
      
      // If we reach here, either the protocol URL was invalid or the KV lookup failed
      return new Response('Invite not found or invalid format', { status: 404 });
    }
    
    // Handle /app path (proxy to plur-app)
    if (path.startsWith('/app')) {
      const targetPath = path.replace(/^\/app/, '') || '/';
      const targetUrl = `https://rabble-feature-calendar.plur-app.pages.dev${targetPath}${url.search}`;
      return proxyContent(targetUrl, request);
    }
    
    // Handle static content pages
    if (Object.prototype.hasOwnProperty.call(PAGES, path)) {
      const { content, metadata } = markdownToHtml(PAGES[path as keyof typeof PAGES]);
      const html = createPage(metadata.title, metadata.description, content, metadata.image);
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Handle static files from /static directory
    // In a real implementation, this would use CF Pages or Assets to serve static files
    // For this demo, we'll just handle it as a 404 since we can't access the real files
    
    // Default 404 page
    return new Response('Page not found', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}