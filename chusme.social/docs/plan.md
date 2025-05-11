The editing tool I’d use to write directly into docs/plans.md is currently unavailable. However, I’ve compiled everything you need below — just copy and paste it into a new file (docs/plans.md) in your project directory.

⸻


# Chusme Website Planning & Refactor Blueprint

_Last updated: 2025-05-11_

---

## ✨ Vision

Chusme is a community platform for organizers — built on open protocols and community values. Our goal is to provide groups with tools to coordinate, communicate, and sustain themselves without relying on ad-driven, centralized platforms.

---

## 🏠 Homepage Content (Draft v1)

### Hero
> **Organize your community. On your terms.**  
> A community-powered platform to message, plan, fund, and grow — without ads, algorithms, or fear of being shut down.

### Why Chusme
> We built this because:
> - Facebook deletes groups with no warning  
> - Slack isn't designed for actual communities  
> - We needed encrypted alerts, pooled funds, and digital sovereignty

### Core Differentiators

| Community-owned       | Private & Encrypted     | Unlock Together         | No Ads or Algorithms       |
|------------------------|--------------------------|--------------------------|-----------------------------|
| Built for groups, not growth hacks | End-to-end encrypted, metadata-light | Fund the tools you need | Chronological, unfiltered, and yours |

### How It Works
1. Start a space  
2. Invite your people  
3. Unlock tools together  
4. Vote on how to use community funds  
5. Sustain your people — not a platform

### Testimonials
> “Facebook deleted our 300,000-person group overnight.” — Cressida  
> “Signal couldn’t scale to our needs. Chusme could.” — Rabble  
> “Feels like WhatsApp, but for community.” — Kaye-Maree

---

## 🎯 Target Organizer Profiles

1. **Tenant Unions & Housing Justice** — KC Tenants, Rhodes
2. **Indigenous / Cultural Groups** — Kaye-Maree
3. **Event & Artist Collectives** — Leyl, Preston
4. **Mutual Aid Organizers** — Juliette, Maggie
5. **Burned by Facebook Groups** — Cressida, Vui

---

## 💸 Pricing Philosophy

- Everyone participates; not everyone has to pay
- Core access is free
- Groups raise funds to unlock advanced features:
  - Video hosting
  - Custom usernames
  - Public websites
- Surplus can fund mods, translators, or member support
- Inspired by Alcoholics Anonymous, churches, and radio

---

## 🧱 Refactor Plan

### Directory Structure

/pages
index.md
about.md
contribute.md
how-it-works.md
/use-cases
tenants.md
mutual-aid.md
artists.md
indigenous.md

### Routing Scaffold (`index.ts`)

```ts
async function router(path: string): Promise<Response | null> {
  switch (path) {
    case '/': return renderMarkdownPage('index');
    case '/about': return renderMarkdownPage('about');
    case '/contribute': return renderMarkdownPage('contribute');
    case '/how-it-works': return renderMarkdownPage('how-it-works');
    default: return null;
  }
}

Markdown Renderer Stub

function renderMarkdownPage(page: string): Response {
  const pages: Record<string, string> = {
    index: '# Welcome to Chusme',
    about: '# About Chusme',
    contribute: '# Contribute',
    'how-it-works': '# How It Works',
  };
  const md = pages[page];
  const { content, metadata } = markdownToHtml(md);
  return new Response(createPage(metadata.title, metadata.description, content));
}


⸻

🛠️ Next Steps
	•	Create markdown files per route
	•	Build router() into fetch handler
	•	Replace hardcoded homepage with Markdown-rendered version
	•	Begin wiring up /use-cases/... pages
	•	Eventually move Markdown to KV/R2 if preferred

⸻


Would you like me to generate the actual `.md` files for `index.md`, `about.md`, etc. next so you can drop them in right away?