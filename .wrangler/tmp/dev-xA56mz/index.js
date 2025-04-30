var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-BOfNB9/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/index.ts
function markdownToHtml(markdown) {
  const metadata = {
    title: "Rabble Community",
    description: "Private, ad-free spaces where you set the rules."
  };
  let content = markdown;
  if (markdown.startsWith("---")) {
    const endOfFrontMatter = markdown.indexOf("---", 3);
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
  content = content.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  content = content.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  content = content.replace(/^# (.*$)/gm, "<h1>$1</h1>");
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)(?:{\.([^}]+)})?/g, (match, text, url, className) => {
    if (className) {
      return `<a href="${url}" class="${className}">${text}</a>`;
    }
    return `<a href="${url}">${text}</a>`;
  });
  content = content.replace(/^\s*-\s*(.*$)/gm, "<li>$1</li>");
  content = content.replace(/(<li>.*<\/li>\n)+/g, function(match) {
    return "<ul>" + match + "</ul>";
  });
  content = content.replace(/^\|(.*)\|$/gm, "<tr>$1</tr>");
  content = content.replace(/<tr>(.*)<\/tr>/g, (match, content2) => {
    const cells = content2.split("|").map((cell) => cell.trim());
    let row = "<tr>";
    for (const cell of cells) {
      if (cell) {
        row += `<td>${cell}</td>`;
      }
    }
    row += "</tr>";
    return row;
  });
  content = content.replace(/(<tr>.*<\/tr>\n)+/g, function(match) {
    return "<table>" + match + "</table>";
  });
  content = content.replace(/```([^`]*)\n([^`]*)```/g, '<pre><code class="language-$1">$2</code></pre>');
  content = content.replace(/`([^`]*)`/g, "<code>$1</code>");
  content = content.replace(/<section id="([^"]+)">(.*?)<\/section>/gs, '<section id="$1">$2</section>');
  content = content.replace(/<details>\s*<summary>(.*?)<\/summary>(.*?)<\/details>/gs, "<details><summary>$1</summary>$2</details>");
  content = content.replace(/:::(quote|info|warning)\n([\s\S]*?):::/g, '<blockquote class="$1">$2</blockquote>');
  content = content.replace(/^---$/gm, "<hr>");
  content = content.replace(/^([^<].*[^>])$/gm, "<p>$1</p>");
  content = content.replace(/<p><\/p>/g, "");
  return { content, metadata };
}
__name(markdownToHtml, "markdownToHtml");
var ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateCode(length = 8) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return result;
}
__name(generateCode, "generateCode");
var STATIC_FILES = {
  "/.well-known/assetlinks.json": {
    content: JSON.stringify([{
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "community.rabble",
        sha256_cert_fingerprints: ["YOUR_APP_FINGERPRINT_HERE"]
      }
    }]),
    contentType: "application/json"
  },
  "/apple-app-site-association": {
    content: JSON.stringify({
      applinks: {
        apps: [],
        details: [{
          appID: "YOUR_TEAM_ID.community.rabble",
          paths: ["/i/*"]
        }]
      }
    }),
    contentType: "application/json"
  }
};
var DESIGN_TOKENS = {
  colors: {
    primary: "#6E41E2",
    secondary: "#FF7846",
    accent: "#A642FE",
    highlight: "#FFB155",
    surface: "#FFFFFF",
    surfaceAlt: "#F8FAFF",
    textPrimary: "#111827",
    textSecondary: "#4B5563"
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { size: 48, weight: 700, lineHeight: 56 },
    body: { size: 16, weight: 400, lineHeight: 28 }
  },
  spacing: 8,
  radius: 16,
  shadow: "0 4px 24px rgba(0,0,0,0.08)"
};
function createPage(title, description, content, image) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Rabble Community</title>
  <meta name="description" content="${description}">
  ${image ? `<meta property="og:image" content="${image}">` : ""}
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
      background-color: var(--primary);
      color: white;
      padding: 1rem 0;
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
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
    }
    
    .nav-links li {
      margin-left: 2rem;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      opacity: 0.9;
      transition: opacity 0.2s;
    }
    
    .nav-links a:hover {
      opacity: 1;
    }
    
    .content {
      padding: 3rem 0;
    }
    
    .footer {
      background-color: #2C2141;
      color: white;
      padding: 2rem 0;
      font-size: 0.875rem;
    }
    
    .footer a {
      color: white;
      opacity: 0.8;
      text-decoration: none;
    }
    
    .footer a:hover {
      opacity: 1;
    }
    
    /* Components */
    h1 {
      font-size: ${DESIGN_TOKENS.typography.h1.size}px;
      font-weight: ${DESIGN_TOKENS.typography.h1.weight};
      line-height: ${DESIGN_TOKENS.typography.h1.lineHeight}px;
      margin-bottom: 1.5rem;
    }
    
    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--primary);
    }
    
    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      margin-top: 2rem;
      color: var(--primary);
    }
    
    p {
      margin-bottom: 1.5rem;
      line-height: 1.7;
    }
    
    ul, ol {
      margin-bottom: 1.5rem;
      padding-left: 2rem;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
    }
    
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      font-weight: 600;
      color: var(--primary);
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
      margin-bottom: 1.5rem;
    }
    
    input, button {
      font-family: var(--font-family);
      font-size: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius);
      border: 1px solid #ddd;
    }
    
    input {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    button {
      background-color: var(--primary);
      color: white;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #5932C4;
    }
    
    .button-primary {
      display: inline-block;
      background-color: var(--secondary);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      margin-right: 1rem;
      margin-bottom: 1rem;
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
      transition: background-color 0.2s;
    }
    
    .button-secondary:hover {
      background-color: var(--surface-alt);
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
      margin-bottom: 3rem;
    }
    
    small {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      h1 {
        font-size: 2.5rem;
        line-height: 1.2;
      }
      
      .container {
        padding: 0 1rem;
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
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/roadmap">Roadmap</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/developers">Developers</a></li>
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
      <p>&copy; 2025 Verse PBC \xB7 <a href="/terms-of-service">Terms</a> \xB7 <a href="/privacy-policy">Privacy</a></p>
    </div>
  </footer>
</body>
</html>`;
}
__name(createPage, "createPage");
var PAGES = {
  // Landing page
  "/": `---
title: "Rabble \u2014 Reclaim Your Groups"
description: "Private, ad\u2011free spaces where *you* set the rules."
image: "/assets/og-hero.png"
---

# Reclaim Your Groups  
*Say goodbye to algorithms, ads, and Meta lock\u2011in.*

[Open Web App](/app){.button-primary}
[Join Waitlist](#waitlist){.button-secondary}

---

## Why Switch to Rabble?
| Problem with Big Social | How Rabble Fixes It |
|-------------------------|---------------------|
| Groups buried in ads & noise | Pure, chronological feed \u2014 no ads, no rank\u2011manipulation |
| You don't own your community data | **You own it & can take it anywhere** |
| Suspended at any time | Transparent, community\u2011driven moderation |
| Profiles tracked & sold | Zero surveillance; privacy\u2011first design |

### Highlights
- **Invite\u2011only spaces** for clubs, activism, families, fandoms
- **End\u2011to\u2011end encrypted conversations** by default
- **Cross\u2011platform** \u2014 iOS, Android, web, desktop
- **Governance tools** \u2014 polls & weighted voting so *members* decide

:::quote
"Within a day we'd migrated our 120\u2011member collective off Facebook Groups. Now we actually *own* our space." \u2014 *Maya, community organiser*
:::

---

## How It Works (1\u20112\u20113)
1. **Create a Group** \u2014 takes 30 seconds.
2. **Send Invite Link** \u2014 email, DM, QR \u2014 your pick.
3. **Chat, share, decide** \u2014 everything stays yours forever.

<details><summary>Want the nerdy details?</summary>
Rabble is built on the open Nostr protocol, which uses public\u2011key cryptography so you hold your own identity. No central server owns your data.
</details>

---

<section id="waitlist">
### Get Early Access
<form action="https://rabble.mailerapi.com" method="post">
  <input type="email" placeholder="Email" required />
  <button>Request Invite</button>
</form>
<small>No spam. One click to unsubscribe.</small>
</section>`,
  // About page
  "/about": `---
title: "About Rabble & Verse PBC"
description: "Social media that serves people, not advertisers."
image: "/assets/og-about.png"
---

### Our Mission
Big platforms turned *your* communities into someone else's revenue stream. Rabble flips the script: **communities own themselves**.

### A Public\u2011Benefit Corporation
Verse PBC is legally bound to prioritise public good over profit. We answer to a charter, not venture\u2011capital metrics.

### Guiding Principles
| Principle | In Practice |
|-----------|-------------|
| **User sovereignty** | Port your data anytime; export keys & posts. |
| **Privacy by default** | End\u2011to\u2011end encryption, no tracking pixels, minimal logs. |
| **Open foundations** | Built on open protocols & open\u2011source code. |

### Meet the Team
| | | |
|---|---|---|
| ![Evan](/press-kit/headshots/evan.webp) | **Evan Henshaw\u2011Plath** | CEO / Product lead |
| ![Erin](/press-kit/headshots/erin.webp) | **Erin** | Community & Ops |

*Want to join us?* [Open roles](https://verse-pbc.org/jobs)`,
  // Privacy Policy
  "/privacy-policy": `---
title: "Privacy Policy"
description: "Your data, your rules."
---

### TL;DR
We do **not** track you across the web, sell your data, or inject ads. All personal content lives on servers you choose.

| Data | Purpose | Retention |
|------|---------|-----------|
| Email (waitlist) | Send invites & updates | Until you unsubscribe |
| Nostr pubkey | Deliver encrypted invites | Until account deletion |
| Plausible analytics | Aggregate usage stats | 24 h rolling |

---

## Full Policy
<details>
<summary>Expand legal text</summary>

1. **Controller** \u2014 Verse PBC (NZBN 9429051234567)  
2. **Lawful basis** \u2014 consent (Article 6 GDPR)  
3. **Rights** \u2014 access, rectify, erase. Email privacy@rabble.community  
4. **Transfers** \u2014 servers in \u{1F1F3}\u{1F1FF} & \u{1F1E9}\u{1F1EA}; SCCs where required  
5. **Security** \u2014 AES\u2011256 at rest, TLS 1.3 in transit  
6. **Cookies** \u2014 only a short\u2011lived session cookie  
7. **Changes** \u2014 versioned; 14\u2011day notice for material updates

</details>`,
  // Terms of Service
  "/terms-of-service": `---
title: "Terms of Service"
description: "Rules to keep Rabble safe & sustainable."
---

### Quick Summary
- **Be excellent** \u2014 no hate speech, harassment, or illegal content.
- **You own your posts**; we need a license to display them.
- **No guarantees** \u2014 beta software can break; export keys regularly.
- **Disputes** \u2014 NZ law; arbitration before courts.

---

## Full Terms
<details>
<summary>Expand full text</summary>

1. **Acceptance** \u2014 by creating an account you agree\u2026  
2. **Eligibility** \u2014 13 years or older\u2026  
3. **User content**\u2026  
*(insert full legalese here)*

</details>`,
  // FAQ
  "/faq": `---
title: "Frequently Asked Questions"
description: "Everything you wanted to know about leaving Meta behind."
---

### Is Rabble a Facebook/WhatsApp replacement?
Yes \u2014 but without ads, data harvesting, or algorithmic feeds.

### Do I need to understand crypto or Nostr?
No. Rabble works like any modern chat app. Keys & relays are optional\u2011advanced settings.

### How is this free if you don't sell ads?
We'll launch optional paid perks (custom domains, extra storage) \u2014 core chat stays free forever.

### Can I export or move my group later?
Absolutely. You can download your archive and import it elsewhere.`,
  // Roadmap
  "/roadmap": `---
title: "Product Roadmap"
description: "From beta to global federation."
---

| Quarter | Milestone | Status |
|---------|-----------|--------|
| Q2 2025 | **Closed Beta** \u2014 invite\u2011only iOS + Android | \u{1F504} In progress |
| Q3 2025 | **App Store Launch** | \u23F3 |
| Q4 2025 | **Groups v2** (threads, file sharing) | \u23F3 |
| 2026    | **Relay Grants** \u2014 fund 10 independent relays | \u23F3 |`,
  // Developers
  "/developers": `---
title: "Developers"
description: "APIs, SDKs, and open\u2011source repos."
---

### GitHub Repos
- **rabble\u2011app** \u2014 Next.js + React Native mono\u2011repo
- **rabble\u2011relay\u2011tools** \u2014 scripts for relay ops

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
  "/blog/2025-04-24-welcome-to-rabble": `---
title: "Why We're Reclaiming Our Groups"
description: "Centralised social media is broken. Here's our fix."
image: "/assets/blog/welcome.webp"
---

# Why We're Reclaiming Our Groups

Social networks once promised global connection. Today they gatekeep speech, harvest data, and nudge behaviour for ad spend.

When Facebook started in college dorms, it was simple \u2014 connect with peers. As it evolved into Meta, a different agenda emerged. Communities became products, not people. Engagement metrics trumped human connection. Groups became vehicles for advertising and behavior tracking.

Rabble takes us back to basics: 

* **User sovereignty** - You hold your keys, own your data
* **No surveillance** - Your digital life isn't for sale
* **Community control** - Decisions made by members, not algorithms
* **Interoperability** - Take your identity and posts to any compatible service

We believe social media can be better \u2014 can be both enjoyable and ethical. We challenge the notion that exploitation is necessary for sustainability. Our public-benefit corporation structure ensures we're accountable to these values, not just profit.

Join us in building social media that serves people first.`,
  // Blog index
  "/blog": `---
title: "Rabble Blog"
description: "Updates from the Rabble team."
---

# Latest from Rabble

## [Why We're Reclaiming Our Groups](/blog/2025-04-24-welcome-to-rabble)
*April 24, 2025*

Social networks once promised global connection. Today they gatekeep speech, harvest data, and nudge behaviour for ad spend...

[Read more \u2192](/blog/2025-04-24-welcome-to-rabble)`
};
function createInvitePage(code, groupId, relay) {
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
        
        <a href="rabble://invite/${code}" class="button-primary" id="open-app">Open in Rabble App</a>
        <a href="https://play.google.com/store/apps/details?id=community.rabble" class="button-secondary" id="get-android">Get on Android</a>
        <a href="https://apps.apple.com/app/rabble/id1234567890" class="button-secondary" id="get-ios">Get on iOS</a>
        <a href="/app?invite=${code}" class="button-secondary" id="open-web">Continue in Browser</a>
        
        <small>Group ID: ${groupId}<br>Relay: ${relay}</small>
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 Verse PBC \xB7 <a href="/terms-of-service">Terms</a> \xB7 <a href="/privacy-policy">Privacy</a></p>
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
  <\/script>
</body>
</html>`;
}
__name(createInvitePage, "createInvitePage");
async function proxyContent(url, request) {
  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (key !== "host") {
      headers.set(key, value);
    }
  }
  const response = await fetch(url, {
    method: request.method,
    headers,
    body: request.body,
    redirect: "follow"
  });
  if (response.headers.get("content-type")?.includes("text/html")) {
    return new HTMLRewriter().on("a", {
      element(element) {
        const href = element.getAttribute("href");
        if (href && href.startsWith("/")) {
          element.setAttribute("href", `/app${href}`);
        }
      }
    }).on("link", {
      element(element) {
        const href = element.getAttribute("href");
        if (href && href.startsWith("/")) {
          element.setAttribute("href", `/app${href}`);
        }
      }
    }).on("script", {
      element(element) {
        const src = element.getAttribute("src");
        if (src && src.startsWith("/")) {
          element.setAttribute("src", `/app${src}`);
        }
      }
    }).on("img", {
      element(element) {
        const src = element.getAttribute("src");
        if (src && src.startsWith("/")) {
          element.setAttribute("src", `/app${src}`);
        }
      }
    }).transform(response);
  }
  return response;
}
__name(proxyContent, "proxyContent");
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (STATIC_FILES[path]) {
      return new Response(STATIC_FILES[path].content, {
        headers: {
          "Content-Type": STATIC_FILES[path].contentType,
          "Cache-Control": "public, max-age=86400"
        }
      });
    }
    if (path.startsWith("/api/invite")) {
      if (request.method === "GET" && path.match(/^\/api\/invite\/\w+$/)) {
        const code = path.split("/").pop() || "";
        const inviteData = await env.INVITES.get(code);
        if (!inviteData) {
          return new Response(JSON.stringify({ error: "Invite not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify({
          code,
          ...JSON.parse(inviteData)
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      if (request.method === "POST" && path === "/api/invite") {
        const token = request.headers.get("X-Invite-Token");
        if (token !== env.INVITE_TOKEN) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        const body = await request.json();
        const { groupId, relay } = body;
        if (!groupId || !relay) {
          return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const code = generateCode(8);
        await env.INVITES.put(code, JSON.stringify({ groupId, relay }));
        return new Response(JSON.stringify({
          code,
          url: `${url.origin}/i/${code}`
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path.match(/^\/i\/\w+$/)) {
      const code = path.split("/").pop() || "";
      const inviteData = await env.INVITES.get(code);
      if (!inviteData) {
        return new Response("Invite not found", { status: 404 });
      }
      const { groupId, relay } = JSON.parse(inviteData);
      const html = createInvitePage(code, groupId, relay);
      return new Response(html, {
        headers: { "Content-Type": "text/html" }
      });
    }
    if (path.startsWith("/app")) {
      const targetPath = path.replace(/^\/app/, "") || "/";
      const targetUrl = `https://plur-app.cloudflare.dev${targetPath}${url.search}`;
      return proxyContent(targetUrl, request);
    }
    if (PAGES[path]) {
      const { content, metadata } = markdownToHtml(PAGES[path]);
      const html = createPage(metadata.title, metadata.description, content, metadata.image);
      return new Response(html, {
        headers: { "Content-Type": "text/html" }
      });
    }
    return new Response("Page not found", {
      status: 404,
      headers: { "Content-Type": "text/plain" }
    });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-BOfNB9/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-BOfNB9/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
