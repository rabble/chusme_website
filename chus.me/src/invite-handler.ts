// Enhanced invite handler with web invite and short URL support

export interface InviteData {
  groupId: string;
  relay: string;
}

export interface ShortcodeMapping {
  code: string;
}

export interface WebInviteData extends InviteData {
  name?: string;
  description?: string;
  avatar?: string;
  createdAt: number;
  creatorPubkey?: string;
}

// Generate a short alphanumeric code
const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function generateCode(length = 8): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return result;
}

// Generate a shorter code for short URLs (4 chars)
export function generateShortCode(): string {
  return generateCode(4);
}

// Create a standard invite
export async function createInvite(
  env: { INVITES: KVNamespace },
  groupId: string,
  relay: string
): Promise<{ code: string; url: string }> {
  const code = generateCode();
  
  const inviteData: InviteData = {
    groupId,
    relay
  };
  
  await env.INVITES.put(code, JSON.stringify(inviteData));
  
  return {
    code,
    url: `https://chus.me/i/${code}`
  };
}

// Create a web invite with additional metadata
export async function createWebInvite(
  env: { INVITES: KVNamespace },
  groupId: string,
  relay: string,
  metadata: {
    name?: string;
    description?: string;
    avatar?: string;
    creatorPubkey?: string;
  }
): Promise<{ code: string; url: string }> {
  const code = generateCode();
  
  const webInviteData: WebInviteData = {
    groupId,
    relay,
    name: metadata.name,
    description: metadata.description,
    avatar: metadata.avatar,
    creatorPubkey: metadata.creatorPubkey,
    createdAt: Date.now()
  };
  
  await env.INVITES.put(`web:${code}`, JSON.stringify(webInviteData));
  
  return {
    code,
    url: `https://chus.me/join/${code}`
  };
}

// Create a short URL invite
export async function createShortUrlInvite(
  env: { INVITES: KVNamespace },
  code: string
): Promise<{ shortCode: string; url: string }> {
  const shortCode = generateShortCode();
  
  const shortcodeMapping: ShortcodeMapping = {
    code
  };
  
  await env.INVITES.put(`short:${shortCode}`, JSON.stringify(shortcodeMapping));
  
  return {
    shortCode,
    url: `https://chus.me/j/${shortCode}`
  };
}

// Get invite data from a standard code
export async function getInvite(
  env: { INVITES: KVNamespace },
  code: string
): Promise<InviteData | null> {
  const data = await env.INVITES.get(code);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as InviteData;
  } catch (e) {
    console.error('Failed to parse invite data', e);
    return null;
  }
}

// Get web invite data from a code
export async function getWebInvite(
  env: { INVITES: KVNamespace },
  code: string
): Promise<WebInviteData | null> {
  const data = await env.INVITES.get(`web:${code}`);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as WebInviteData;
  } catch (e) {
    console.error('Failed to parse web invite data', e);
    return null;
  }
}

// Resolve a short code to the full invite code
export async function resolveShortCode(
  env: { INVITES: KVNamespace },
  shortCode: string
): Promise<string | null> {
  const data = await env.INVITES.get(`short:${shortCode}`);
  if (!data) return null;
  
  try {
    const mapping = JSON.parse(data) as ShortcodeMapping;
    return mapping.code;
  } catch (e) {
    console.error('Failed to parse shortcode mapping', e);
    return null;
  }
}

// Create HTML for web invites with rich metadata
export function createWebInvitePage(invite: WebInviteData, code: string): string {
  const groupName = invite.name || 'Community Group';
  const groupDescription = invite.description || 'Join this Chusme community group';
  const avatarUrl = invite.avatar || '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join ${groupName} - Chusme</title>
  <meta name="description" content="${groupDescription}">
  <meta property="og:title" content="Join ${groupName}">
  <meta property="og:description" content="${groupDescription}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Chusme">
  ${avatarUrl ? `<meta property="og:image" content="${avatarUrl}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700;800&family=Crimson+Pro:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #000000;
      --secondary: #F5F1E9;
      --accent: #5E452A;
      --highlight: #FFFDF7;
      --surface: #F9F6F0;
      --surface-alt: #EDEAE0;
      --text-primary: #000000;
      --text-secondary: #3D3D3D;
      --font-family: 'Alegreya', 'Crimson Pro', 'Georgia', serif;
      --spacing: 8px;
      --radius: 0px;
      --shadow: none;
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
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .header {
      background-color: var(--primary);
      color: white;
      padding: 1rem 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .logo {
      font-size: 1.75rem;
      font-weight: 800;
      color: white;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
    }
    
    .logo::before {
      content: "🔗";
      display: inline-block;
      font-size: 1.75rem;
      margin-right: 0.75rem;
    }
    
    .content {
      padding: 3rem 0;
      flex: 1;
      display: flex;
      align-items: center;
    }
    
    .invite-card {
      background-color: var(--surface);
      padding: 2rem;
      text-align: center;
      width: 100%;
      border: 3px solid var(--primary);
    }
    
    .group-info {
      margin: 2rem 0;
    }
    
    .group-avatar {
      width: 100px;
      height: 100px;
      background-color: var(--primary);
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2.5rem;
      font-weight: 800;
      background-size: cover;
      background-position: center;
      border: 3px solid var(--primary);
    }
    
    .description {
      max-width: 400px;
      margin: 0 auto;
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.7;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.3;
    }
    
    p {
      margin-bottom: 1.5rem;
      color: var(--text-secondary);
      font-size: 1.125rem;
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
      margin-bottom: 1rem;
      width: 100%;
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
      margin-bottom: 1rem;
      width: 100%;
      transition: background-color 0.2s;
    }
    
    .button-secondary:hover {
      background-color: var(--primary);
      color: white;
    }
    
    .footer {
      background-color: var(--primary);
      color: white;
      padding: 2rem 0;
      font-size: 1rem;
      text-align: center;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
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
    
    /* Woodcut style decorative divider */
    .woodcut-divider {
      height: 20px;
      background-image: url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 L40 6 M3 3 L3 9 M8 2 L8 10 M13 1 L13 11 M18 2 L18 10 M23 3 L23 9 M28 2 L28 10 M33 1 L33 11 M38 3 L38 9' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E");
      background-repeat: repeat-x;
      margin: 1.5rem 0;
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
      <a href="/" class="logo">Chusme</a>
    </div>
  </header>
  
  <main class="content">
    <div class="container">
      <div class="invite-card">
        <div class="group-info">
          ${avatarUrl 
            ? `<div class="group-avatar" style="background-image: url('${avatarUrl}');"></div>` 
            : `<div class="group-avatar">${groupName.charAt(0)}</div>`}
          <h1>${groupName}</h1>
          ${invite.description ? `<p class="description">${invite.description}</p>` : ''}
        </div>
        
        <div class="woodcut-divider"></div>
        
        <a href="plur://join-community?group-id=${invite.groupId}&code=${code}&relay=${encodeURIComponent(invite.relay)}" class="button-primary" id="open-app">Open in Plur App</a>
        <a href="https://play.google.com/store/apps/details?id=app.chusme.app" class="button-secondary" id="get-android">Get on Android</a>
        <a href="https://apps.apple.com/app/chusme/id6738932333" class="button-secondary" id="get-ios">Get on iOS</a>
        <a href="https://chusme.app/?group-id=${invite.groupId}&code=${code}&relay=${encodeURIComponent(invite.relay)}" class="button-secondary" id="open-web">Continue in Browser</a>
        
        <small>Created on ${new Date(invite.createdAt).toLocaleDateString()}</small>
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 Chus.me · All rights reserved</p>
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
  </script>
</body>
</html>`;
}