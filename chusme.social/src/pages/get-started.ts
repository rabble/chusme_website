import { renderLayout } from '../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>Get Started with Chusme</h1>
    
    <p>Chusme is built for organizers. Whether you're creating a local mutual aid group, a creative collective, or a movement space, you can start in minutes — and grow it over time.</p>
    
    <p>This guide walks you through how to launch a community, invite your people, and start building something powerful.</p>
    
    <div class="steps-container">
      <div class="step-card">
        <div class="step-number">Step 1</div>
        <div class="step-emoji">🧑‍💻</div>
        <h2>Download or Open the App</h2>
        <p>You can use Chusme in your browser or on desktop.</p>
        <div class="step-actions">
          <a href="https://chusme.app" class="btn">Open the Web App</a>
          <a href="https://downloads.chusme.social/Chusme.dmg">Download for macOS</a>
          <a href="https://downloads.chusme.social/ChusmeSetup.exe">Download for Windows</a>
          <p><em>Mobile apps coming soon (iOS + Android)</em></p>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">Step 2</div>
        <div class="step-emoji">👤</div>
        <h2>Create Your Account</h2>
        <p>You'll be asked to:</p>
        <ul>
          <li>Choose a display name</li>
          <li>Set your profile image (optional)</li>
          <li>Link to your preferred Nostr identity (or auto-generate one)</li>
        </ul>
        <p>This identity is portable. It can be used across any Nostr-based app — not just Chusme.</p>
      </div>
      
      <div class="step-card">
        <div class="step-number">Step 3</div>
        <div class="step-emoji">🏘️</div>
        <h2>Create a Community</h2>
        <p>Start your own group by:</p>
        <ul>
          <li>Naming your community</li>
          <li>Adding a short intro message</li>
          <li>Setting visibility (public, private, or invitation-only)</li>
        </ul>
        <p>Every new group comes with:</p>
        <ul>
          <li>A shared feed for threads and updates</li>
          <li>Optional events, asks/offers, and polls</li>
          <li>Access to unlocking tools via group contributions</li>
        </ul>
      </div>
      
      <div class="step-card">
        <div class="step-number">Step 4</div>
        <div class="step-emoji">🔗</div>
        <h2>Share Your Custom Invite Link</h2>
        <p>Invite people via:</p>
        <ul>
          <li>A custom short link (e.g. <code>chusme.app/join/mycrew</code>)</li>
          <li>QR code (great for flyers, events, meetups)</li>
          <li>WhatsApp, Signal, Telegram, or email</li>
        </ul>
        <p>You can also set:</p>
        <ul>
          <li>Onboarding questions</li>
          <li>A welcome post or guide</li>
          <li>Roles (admin, mod, trusted member)</li>
        </ul>
        <blockquote><strong>Tip:</strong> Personal invites go a long way. Record a short message or voice memo explaining what the group is for and why it matters.</blockquote>
      </div>
      
      <div class="step-card">
        <div class="step-number">Step 5</div>
        <div class="step-emoji">💬</div>
        <h2>Use the Feed & Threads</h2>
        <p>Every community has:</p>
        <ul>
          <li>A group feed (chronological, not algorithmic)</li>
          <li>Threaded replies</li>
          <li>Reactions for ideas, agreements, flags, or follow-up</li>
          <li>Pinned posts for norms, links, or FAQs</li>
        </ul>
        <p>You can also:</p>
        <ul>
          <li>Schedule and announce events</li>
          <li>Set up ask/offer mutual aid threads</li>
          <li>Enable announcements-only mode for broadcasts</li>
        </ul>
      </div>
      
      <div class="step-card">
        <div class="step-number">Step 6</div>
        <div class="step-emoji">📥</div>
        <h2>Direct Messages & Notifications</h2>
        <p>Each member can:</p>
        <ul>
          <li>Send direct messages (DMs)</li>
          <li>Get notifications for threads they follow</li>
          <li>@mention people in comments or posts</li>
          <li>Subscribe to important threads (e.g. rides, alerts)</li>
        </ul>
        <p>We prioritize minimal distraction — you control your notification preferences.</p>
      </div>
      
      <div class="step-card">
        <div class="step-number">Step 7</div>
        <div class="step-emoji">💡</div>
        <h2>Cultivate Your Culture</h2>
        <p>Chusme is not just a chat tool. It's a community platform.</p>
        <p>Ways to cultivate your space:</p>
        <ul>
          <li>Rotate community roles like facilitator or greeter</li>
          <li>Use emojis and pinned messages to reinforce culture</li>
          <li>Create threads like: "Introduce yourself," "What are we working on?" "What support do you need this week?"</li>
        </ul>
      </div>
      
      <div class="step-card">
        <div class="step-number">Step 8</div>
        <div class="step-emoji">💸</div>
        <h2>Unlock Tools & Share Resources</h2>
        <p>Groups can crowdfund to unlock premium features like:</p>
        <ul>
          <li>Private video storage</li>
          <li>Custom usernames (like <code>@sofia@mygroup.chusme.social</code>)</li>
          <li>Public websites or join portals</li>
          <li>Voting and proposal tools</li>
        </ul>
        <p>Any extra funds stay with the group. You decide together how to spend them: pay a mod, translate onboarding materials, or support a member in need.</p>
      </div>
      
      <div class="step-card">
        <div class="step-number">Step 9</div>
        <div class="step-emoji">🛠️</div>
        <h2>Stay Flexible</h2>
        <p>Chusme is built on <a href="https://nostr.com">Nostr</a>, a decentralized protocol. That means:</p>
        <ul>
          <li>You can migrate to another server or app</li>
          <li>You can self-host if desired</li>
          <li>You can integrate with other Nostr-based tools over time</li>
        </ul>
        <p>Chusme is a gateway — not a gatekeeper.</p>
      </div>
    </div>
    
    <div class="help-section">
      <h2>Need Help?</h2>
      <div class="help-links">
        <a href="https://github.com/verse/chusme/wiki" class="help-link">
          <span class="help-link-icon">📚</span>
          <span class="help-link-text">See the Docs</span>
        </a>
        <a href="https://chusme.app/group/chusme-support" class="help-link">
          <span class="help-link-icon">👥</span>
          <span class="help-link-text">Join the Help Group</span>
        </a>
        <a href="mailto:team@chusme.social" class="help-link">
          <span class="help-link-icon">✉️</span>
          <span class="help-link-text">Email Us</span>
        </a>
      </div>
    </div>
    
    <div class="cta-box">
      <h3>Ready to get started?</h3>
      <a href="https://chusme.app" class="btn">Launch the App</a>
    </div>
  `;

  const html = renderLayout({
    title: "Get Started with Chusme",
    description: "Learn how to get started with Chusme in just a few easy steps. Create your community, invite members, and start organizing on your own terms.",
    content
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}