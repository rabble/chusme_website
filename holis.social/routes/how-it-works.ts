import { renderLayout } from '../src/layout';

export default async function handler(): Promise<Response> {
  const content = `
    <h1>How Chusme Works</h1>
    
    <p>Chusme is a messaging and coordination platform for communities — built on <a href="https://nostr.com/">Nostr</a>, a decentralized protocol that gives you portability, privacy, and shared control.</p>
    
    <p>It's like email, but for groups.<br>
    It's like WordPress, but for social organizing.<br>
    You can use our app — or run your own. You're never locked in.</p>
    
    <hr>
    
    <h2>Start a Space</h2>
    
    <p>Anyone can start a Chusme space. All you need is:</p>
    
    <ul>
      <li>A name for your group</li>
      <li>A group bio and welcome message</li>
      <li>Invite links for your community members</li>
    </ul>
    
    <p>Each space gets:</p>
    <ul>
      <li>A private discussion feed</li>
      <li>Optional broadcast-only channels</li>
      <li>A group fund for contributions</li>
      <li>Tools to post updates, events, documents, and more</li>
    </ul>
    
    <hr>
    
    <h2>Invite and Onboard</h2>
    
    <p>Once your group is live, you can:</p>
    
    <ul>
      <li>Share a join link via text, email, QR, or WhatsApp</li>
      <li>Choose whether your space is open or invite-only</li>
      <li>Ask onboarding questions (like "where are you based?" or "how do you want to contribute?")</li>
    </ul>
    
    <p>Chusme supports both informal hangouts and high-trust, role-based collaboration.</p>
    
    <hr>
    
    <h2>Coordinate Together</h2>
    
    <p>Every Chusme group gets:</p>
    
    <ul>
      <li>📣 Message boards (chat + threaded replies)</li>
      <li>📆 Events with RSVP and follow-up</li>
      <li>🧭 Broadcast announcements</li>
      <li>✅ Member-driven moderation</li>
      <li>📂 Shared documents and media</li>
    </ul>
    
    <p>Use it like:</p>
    <ul>
      <li>A signal-boost channel</li>
      <li>A mutual aid board</li>
      <li>A local union backchannel</li>
      <li>A decentralized help desk</li>
    </ul>
    
    <hr>
    
    <h2>Unlock the Tools You Need</h2>
    
    <p>Chusme is free to use — but you can <strong>crowdfund to unlock extra tools</strong>:</p>
    
    <table>
      <tr>
        <th>Feature</th>
        <th>Example Use</th>
      </tr>
      <tr>
        <td>📹 Video hosting</td>
        <td>Share training or event replays</td>
      </tr>
      <tr>
        <td>🧑‍💼 Custom usernames</td>
        <td>Create identities like <code>@sofia@mygroup.chusme.social</code></td>
      </tr>
      <tr>
        <td>🌐 Public website</td>
        <td>Publish updates or join pages</td>
      </tr>
      <tr>
        <td>🗳️ Proposal voting</td>
        <td>Decide how to spend pooled funds</td>
      </tr>
      <tr>
        <td>📊 Analytics</td>
        <td>See what's working in your community</td>
      </tr>
    </table>
    
    <blockquote>Any extra funds stay with your group — and you decide how to use them.</blockquote>
    
    <hr>
    
    <h2>Contribute and Decide Together</h2>
    
    <p>Each group has its own <strong>community fund</strong>.</p>
    
    <ul>
      <li>Members can chip in monthly or as-needed</li>
      <li>Money goes first to unlock tools</li>
      <li>Leftover funds can pay organizers, support members, or fund events</li>
    </ul>
    
    <p>Groups decide how to use funds using:</p>
    <ul>
      <li>Quick emoji reactions</li>
      <li>Structured Loomio-style voting</li>
      <li>Custom decision rules (you choose!)</li>
    </ul>
    
    <hr>
    
    <h2>Built on Open Protocols</h2>
    
    <p>Chusme uses <a href="https://github.com/nostr-protocol/nostr">Nostr</a>, a decentralized messaging protocol. That means:</p>
    
    <ul>
      <li>🛠️ Your group isn't trapped in our app</li>
      <li>📨 You can migrate to another server, or host your own</li>
      <li>🔗 Your group's messages, members, and identity live on-chain</li>
      <li>🏛️ It's like email or WordPress — but for community platforms</li>
    </ul>
    
    <p><strong>If we disappear, your community doesn't.</strong></p>
    
    <hr>
    
    <h2>Strong Privacy, Optional Encryption</h2>
    
    <p>Chusme offers:</p>
    
    <ul>
      <li>🔐 End-to-end encryption (E2EE) for 1:1 messages</li>
      <li>🫂 Group message encryption (Signal-style) for trusted groups</li>
      <li>🕵️ Metadata minimization: we don't track who you talk to, when, or why</li>
      <li>🚫 No ads, no surveillance, no third-party analytics</li>
    </ul>
    
    <p>You can choose:</p>
    <ul>
      <li>Fully open discussion (like a forum)</li>
      <li>Private groups with onboarding gates</li>
      <li>Locked-down encrypted coordination zones</li>
    </ul>
    
    <p>Perfect for:</p>
    <ul>
      <li>Protest organizing</li>
      <li>Legal aid groups</li>
      <li>Youth and family services</li>
      <li>Indigenous or sovereign spaces</li>
    </ul>
    
    <hr>
    
    <h2>Built for the Long Haul</h2>
    
    <ul>
      <li>Open source</li>
      <li>Interoperable with other Nostr apps</li>
      <li>Self-hostable</li>
      <li>Designed for migration, autonomy, and resilience</li>
    </ul>
    
    <p>Whether you're organizing for a season or a decade, Chusme gives you tools that <strong>don't disappear when the platform changes hands</strong>.</p>
    
    <hr>
    
    <h2>Start Building Your Space</h2>
    
    <p>Chusme is already being used by:</p>
    
    <ul>
      <li>Tenant unions</li>
      <li>Cultural organizers</li>
      <li>Mutual aid networks</li>
      <li>Groups banned from Facebook</li>
      <li>Indigenous community centers</li>
    </ul>
    
    <p>Want to join them?</p>
    
    <p>
      ➡️ <a href="/get-started" class="btn">Get Started Guide</a><br>
      ➡️ <a href="https://chusme.app">Launch the App → chusme.app</a><br>
      ➡️ <a href="/use-cases">Explore Use Cases</a><br>
      ➡️ <a href="https://rights.social">Read Our Commitment to Digital Rights</a>
    </p>
  `;

  const html = renderLayout({
    title: "How Chusme Works",
    description: "Learn how Chusme helps communities message, organize, and thrive on their own terms.",
    content
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}