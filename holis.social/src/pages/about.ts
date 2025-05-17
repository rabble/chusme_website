import { renderLayout } from '../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <div class="with-sidebar">
      <div class="main-content">
        <h1>About Holis</h1>
        <p><strong>Holis is a platform for community organizers</strong> — built on open protocols, sustained by community contributions, and grounded in collective values. We offer groups the tools to coordinate, communicate, and grow — without relying on extractive, ad-driven platforms like Facebook or Slack.</p>
        <p>We're here for the communities that build real things — and need real infrastructure to support them.</p>
        <hr>
        <h2>Vision</h2>
        <p>To empower communities to <strong>organize, communicate, and fund themselves</strong> on their own terms — with <strong>privacy</strong>, <strong>security</strong>, and <strong>digital sovereignty</strong> at the core.</p>
        <ul>
          <li>Communities govern their own digital spaces</li>
          <li>Technology reflects the values of mutual aid and solidarity</li>
          <li>Infrastructure is collectively owned — not leased from billionaires</li>
        </ul>
        <hr>
        <h2>Our Roots</h2>
        <p>Holis is one part of a broader ecosystem of community tech, shaped by years of work in decentralized social platforms and community organizing. We're built by the same team behind:</p>
        <ul>
          <li><a href="https://nos.social/about"><strong>Nos Social</strong></a> — A simple, ad-free social app that connects people over the Nostr protocol. Nos is a starting point for a fully open and decentralized social web, where your identity and data are portable and controlled by you.</li>
          <li><a href="https://verse-pbc.org"><strong>Verse PBC</strong></a> — A Public Benefit Corporation that builds resilient, public-interest infrastructure for community-owned apps. Verse supports projects like Holis with a focus on care, transparency, and protocol-first architecture.</li>
          <li><a href="https://rights.social"><strong>Rights.social</strong></a> — A manifesto and framework for digital self-determination. We believe that online communities deserve rights just like physical ones — including the right to free association, data ownership, and algorithmic transparency.</li>
          <li><a href="https://planetary.social"><strong>Planetary</strong></a> — A decentralized social network that runs on the Secure Scuttlebutt (SSB) protocol. Planetary helped pioneer humane tech for creators, activists, and small communities — without surveillance or platform lock-in.</li>
        </ul>
        <p>These projects share one thread: <strong>technology that centers people, not platforms.</strong></p>
        <hr>
        <h2>Our Approach</h2>
        <ul>
          <li><strong>User Ownership</strong><br>Your data, relationships, and group identity should always belong to you.</li>
          <li><strong>Decentralization by Default</strong><br>We build on protocols like <a href="https://github.com/nostr-protocol/nostr">Nostr</a> so that no one — not even us — can unilaterally control your community.</li>
          <li><strong>Community Governance</strong><br>Each group on Holis sets its own norms, moderation flows, and decision-making models. Inspired by tools like <a href="https://www.loomio.com">Loomio</a>, not top-down feeds.</li>
          <li><strong>Transparency & Openness</strong><br>Holis is open source. We publish roadmaps and welcome contributors who want to shape the direction of the platform.</li>
        </ul>
        <hr>
        <h2>Join Us</h2>
        <p>Holis isn't just a product — it's a commons.</p>
        <ul>
          <li>Neighborhood groups don't disappear when Facebook changes the rules</li>
          <li>Activists can coordinate securely and privately</li>
          <li>Garden clubs and protest networks alike can own their digital infrastructure</li>
        </ul>
        <p><strong>We invite organizers, developers, and communities to build this future with us.</strong></p>
        <p><a href="https://app.holis.social">Start a group</a><br>
        <a href="https://rights.social">Read the Social Media Bill of Rights</a><br>
        <a href="https://github.com/verse/holis">Contribute or collaborate</a></p>
      </div>

      <div class="sidebar">
        <div class="sidebar-box">
          <h3>🗣️ Why "Holis"?</h3>

          <p>The name Holis is a play on the Spanish word chisme, which means gossip — but not in a negative sense.</p>

          <p>In many communities, chisme is how news travels. It's how people look out for each other. It's the unofficial channel — where trust, curiosity, and care intersect.</p>

          <p>We're reclaiming that idea:</p>

          <p>Holis is the good kind of gossip. The kind that builds relationships, shares vital information, and connects people to what's happening around them.</p>

          <p>It's also:</p>
          <ul>
            <li>Easy to say in many languages</li>
            <li>Feels friendly and informal</li>
            <li>Evokes storytelling, trust, and community rhythm</li>
          </ul>

          <p>Holis is what happens in line at the market, in group chats after a meeting, at the edge of a protest march — where real organizing takes place.</p>

          <div class="sidebar-divider"></div>
        </div>
      </div>
    </div>
  `;

  const html = renderLayout({
    title: "About Holis",
    description: "Holis is a platform for community organizers — built on open protocols, sustained by community contributions, and grounded in collective values.",
    content
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
} 