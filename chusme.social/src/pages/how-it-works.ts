import { renderLayout } from '../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>How Holis Works</h1>
    
    <p>Holis is a messaging and coordination platform for communities — built on <a href="https://nostr.com/">Nostr</a>, a decentralized protocol that gives you portability, privacy, and shared control.</p>
    
    <p>It's like email, but for groups.<br>
    It's like WordPress, but for social organizing.<br>
    You can use our app — or run your own. You're never locked in.</p>
    
    <hr>

    <h2>Start a Space</h2>

    <div class="feature-section">
      <img src="/static/assets/ios/group_list.jpg" alt="Group list screen" class="mobile-screenshot">
      <div class="feature-content">
        <p>Anyone can start a Holis space. All you need is:</p>

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
      </div>
    </div>
    
    <hr>

    <h2>Invite and Onboard</h2>

    <div class="feature-section">
      <div class="feature-content">
        <p>Once your group is live, you can:</p>

        <ul>
          <li>Share a join link via text, email, QR, or WhatsApp</li>
          <li>Choose whether your space is public, private, or encrypted</li>
          <li>Set join requirements (open, invite-only, or approval-based)</li>
          <li>Ask onboarding questions (like "where are you based?" or "how do you want to contribute?")</li>
        </ul>

        <p>Holis supports both informal hangouts and high-trust, role-based collaboration.</p>
      </div>
      <img src="/static/assets/ios/user_profile.jpg" alt="User profile screen" class="mobile-screenshot">
    </div>
    
    <hr>
    
    <h2>Coordinate Together</h2>

    <p>Every Holis group gets:</p>

    <ul>
      <li>📣 Message boards (chat + threaded replies)</li>
      <li>📆 Events with RSVP and follow-up</li>
      <li>🧭 Broadcast announcements</li>
      <li>✅ Member-driven moderation</li>
      <li>📂 Shared documents and media</li>
    </ul>

    <div class="screenshot-grid">
      <div class="screenshot">
        <img src="/static/assets/ios/posts_screen.jpg" alt="Holis posts screen" class="mobile-screenshot" />
        <p>Posts & Updates</p>
      </div>
      <div class="screenshot">
        <img src="/static/assets/ios/chat.jpg" alt="Holis chat interface" class="mobile-screenshot" />
        <p>Group Chat</p>
      </div>
      <div class="screenshot">
        <img src="/static/assets/ios/events.jpg" alt="Holis events calendar" class="mobile-screenshot" />
        <p>Events Calendar</p>
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-content">
        <h3>Community Posts</h3>
        <p>Share updates, questions, and resources with your entire community.</p>
        <p>Perfect for organizing mutual aid, planning events, or coordinating group projects.</p>
      </div>
      <img src="/static/assets/ios/posts_screen.jpg" alt="Community posts interface" class="mobile-screenshot">
    </div>

    <div class="feature-section">
      <img src="/static/assets/ios/events.jpg" alt="Event calendar view" class="mobile-screenshot">
      <div class="feature-content">
        <h3>Group Events Calendar</h3>
        <p>Create and share events with RSVPs, locations, and automated reminders.</p>
        <p>Your community's calendar stays in sync across all members.</p>
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-content">
        <h3>Direct Messages</h3>
        <p>Private, encrypted communication between members.</p>
        <p>Keep sensitive discussions secure and coordinate one-on-one.</p>
      </div>
      <img src="/static/assets/ios/dms.jpg" alt="Direct messages interface" class="mobile-screenshot">
    </div>

    <p>Use it like:</p>
    <ul>
      <li>A signal-boost channel</li>
      <li>A mutual aid board</li>
      <li>A local union backchannel</li>
      <li>A decentralized help desk</li>
    </ul>
    
    <hr>
    
    <h2>Unlock the Tools You Need</h2>

    <div class="feature-section">
      <div class="feature-content">
        <p>Holis is free to use — but you can <strong>crowdfund to unlock extra tools</strong>:</p>

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
            <td>Create identities like <code>@sofia@mygroup.holis.social</code></td>
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
      </div>
      <img src="/static/assets/ios/asks_offers.jpg" alt="Asks and offers interface" class="mobile-screenshot">
    </div>
    
    <blockquote>Any extra funds stay with your group — and you decide how to use them.</blockquote>
    
    <hr>

    <h2>Contribute and Decide Together</h2>

    <div class="feature-section">
      <div class="feature-content">
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
      </div>
      <img src="/static/assets/ios/zaps.jpg" alt="Zaps and donations interface" class="mobile-screenshot">
    </div>
    
    <hr>
    
    <h2>Built on Open Protocols</h2>
    
    <p>Holis uses <a href="https://github.com/nostr-protocol/nostr">Nostr</a>, a decentralized messaging protocol. That means:</p>
    
    <ul>
      <li>🛠️ Your group isn't trapped in our app</li>
      <li>📨 You can migrate to another server, or host your own</li>
      <li>🔗 Your group's messages, members, and identity live on-chain</li>
      <li>🏛️ It's like email or WordPress — but for community platforms</li>
    </ul>
    
    <p><strong>If we disappear, your community doesn't.</strong></p>
    
    <hr>
    
    <h2>Strong Privacy, Group-Selected Encryption</h2>

    <div class="feature-section">
      <div class="feature-content">
        <p>Holis offers:</p>

        <ul>
          <li>🔐 End-to-end encryption (E2EE) for 1:1 messages</li>
          <li>🫂 Group message encryption (Signal-style) for trusted groups</li>
          <li>🕵️ Metadata minimization: we don't track who you talk to, when, or why</li>
          <li>🚫 No ads, no surveillance, no third-party analytics</li>
        </ul>

        <p><strong>Groups can choose their own privacy level:</strong></p>
        <ul>
          <li>Fully public discussions (like an open forum)</li>
          <li>Private groups with member approvals</li>
          <li>End-to-end encrypted spaces for sensitive coordination</li>
        </ul>
      </div>
      <img src="/static/assets/ios/dms.jpg" alt="Encrypted messaging" class="mobile-screenshot">
    </div>
    
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
    
    <p>Whether you're organizing for a season or a decade, Holis gives you tools that <strong>don't disappear when the platform changes hands</strong>.</p>
    
    <hr>
    
    <h2>Start Building Your Space</h2>
    
    <p>Holis is already being used by:</p>
    
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
      ➡️ <a href="https://app.holis.social">Launch the App → app.holis.social</a><br>
      ➡️ <a href="/use-cases">Explore Use Cases</a><br>
      ➡️ <a href="https://rights.social">Read Our Commitment to Digital Rights</a>
    </p>
  `;

  const html = renderLayout({
    title: "How Holis Works",
    description: "Learn how Holis helps communities message, organize, and thrive on their own terms.",
    content
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}