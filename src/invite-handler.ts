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
    url: `https://rabble.community/i/${code}`
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
    url: `https://rabble.community/join/${code}`
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
    url: `https://rabble.community/j/${shortCode}`
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
  const groupDescription = invite.description || 'Join this Rabble community group';
  const avatarUrl = invite.avatar || '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join ${groupName} - Rabble Community</title>
  <meta name="description" content="${groupDescription}">
  <meta property="og:title" content="Join ${groupName}">
  <meta property="og:description" content="${groupDescription}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Rabble Community">
  ${avatarUrl ? `<meta property="og:image" content="${avatarUrl}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #55407B;
      --secondary: #FFF8F7;
      --accent: #E3D8F5;
      --highlight: #FFF8F7;
      --surface: #FFFFFF;
      --surface-alt: #F8F6FD;
      --text-primary: #1A1A1A;
      --text-secondary: #666666;
      --font-family: 'Inter', sans-serif;
      --spacing: 8px;
      --radius: 16px;
      --shadow: 0 4px 20px rgba(85, 64, 123, 0.08);
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
      background-size: cover;
      background-position: center;
    }
    
    .description {
      max-width: 400px;
      margin: 0 auto;
      font-size: 0.9rem;
      color: var(--text-secondary);
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
      background-color: var(--primary);
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
      background-color: #473569;
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
          ${avatarUrl 
            ? `<div class="group-avatar" style="background-image: url('${avatarUrl}');"></div>` 
            : `<div class="group-avatar">${groupName.charAt(0)}</div>`}
          <h1>${groupName}</h1>
          ${invite.description ? `<p class="description">${invite.description}</p>` : ''}
        </div>
        
        <a href="plur://join-community?group-id=${invite.groupId}&code=${code}&relay=${encodeURIComponent(invite.relay)}" class="button-primary" id="open-app">Open in Plur App</a>
        <a href="https://play.google.com/store/apps/details?id=app.verse.prototype.plur" class="button-secondary" id="get-android">Get on Android</a>
        <a href="https://apps.apple.com/app/plur/id1234567890" class="button-secondary" id="get-ios">Get on iOS</a>
        <a href="/app?group-id=${invite.groupId}&code=${code}&relay=${encodeURIComponent(invite.relay)}" class="button-secondary" id="open-web">Continue in Browser</a>
        
        <small>Created on ${new Date(invite.createdAt).toLocaleDateString()}</small>
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 Verse PBC · All rights reserved</p>
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